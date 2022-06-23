import { get_checkout_vat,use_api_bc } from '../../config';
import { site_url } from 'prismic-configuration';
import NextCors from 'nextjs-cors';
const fetch = require('node-fetch');
const prismic = require('@prismicio/client');

export default async function handler(req, res) {  

    await NextCors(req, res, {
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200
    });

    const params = req.query.param;
    if(params.length > 0){
    
        //get params
        let store = params[0];
        let locale = params[1];
        let cartid = params[2];

        


        //get store info
        const config = use_api_bc(store);

        const get_checkout = await get_checkout_vat(store, locale, cartid);

        const billing_address = get_checkout.data.billing_address;
        const physical_items = get_checkout.data.cart.line_items.physical_items;

        const country = billing_address.country;
        const cart_currency = get_checkout.data.cart.currency.code;
        const cid = get_checkout.data.cart.customer_id

        //############Prismic content_management Data fetch in local en-gb start
        const repoName = process.env.prismic.repo_name;
        const accessToken = process.env.prismic.access_token;
        const endpoint = prismic.getEndpoint(repoName);
        const routes = [ { type: 'content_management', path: '/:uid'}, { type: 'menu', path: '/:uid'}, { type: 'footer', path: '/:uid' } ]
        const client = prismic.createClient(endpoint, { routes, fetch, accessToken })
        //get All settings
        const content_management = await client.getAllByType('content_management', {lang: 'en-gb',});
        const res_cm = content_management[0].data.locale_data;
        for (let pcm = 0; pcm < res_cm.length; pcm++) {
            const ele_pcm = res_cm[pcm];
            const pcm_locale = ele_pcm.locale
            const pcm_country = ele_pcm.my_region_page_title
            if(pcm_country.match(country)){
                locale = pcm_locale;
            }
        }
        //############Prismic content_management Data fetch in local en-gb end

        // const country_list = {  
        //     "United Kingdom" : { l:"en-gb" },
        //     "Denmark" : { l:"en-dk" },
        //     "Finland" : { l:"en-fi" },
        //     "Norway" : { l:"en-no" },
        //     "Sweden" : { l:"en-se" },
        //     "Canada" : { l:"en-ca" },
        //     "United States" : { l:"en-us" },
        //     "Australia" : { l:"en-au" },
        //     "New Zealand" : { l:"en-nz" },
        // };
        // if(country_list[country]){ locale = country_list[country].l; }

        let line_items = [];
        for (let pi = 0; pi < physical_items.length; pi++) {
            const element = physical_items[pi];
            line_items.push({
                "item_id": element.id,
                "quantity": element.quantity
            })
        }
        const consignment_data = [{
                "address": billing_address,
                "line_items": line_items
        }]

        const re_create_url = site_url + `api/zoleo/cart/createacart/${store}/${locale}/0/0/${cid}/${cartid}/${cart_currency}/re_create`;
        
        const new_cart = await fetch(re_create_url).then((response) => response.json());
        const ncart_id = new_cart.cart.data.id;
        const ncart_count = new_cart.cart.data.line_items.physical_items.length;
        const ncart_currency = new_cart.cart.data.currency.code;
        
        //new cart checkout
        const nget_checkout = await get_checkout_vat(store, locale, ncart_id);

        //post
        var options_consignment  = {
            method: 'POST',
            headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'x-auth-token': config.access_token
            },
            body: JSON.stringify(consignment_data)
        };
        const end_point_con = 'https://api.bigcommerce.com/stores/'+config.store_hash+'/v3/checkouts/'+ncart_id+'/consignments';
        const cart_res_cons = await fetch(end_point_con,options_consignment).then((response) => response.json());
        const consignment_id = cart_res_cons.data.consignments[0].id;
        

        //PUT
        var options_consignment_put  = {
            method: 'PUT',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                'x-auth-token': config.access_token
            },
            body: '{"shipping_option_id":"56bae95ee69289961d2605b5c190d269"}'
        };
        const end_point_con_put = 'https://api.bigcommerce.com/stores/'+config.store_hash+'/v3/checkouts/'+ncart_id+'/consignments/'+consignment_id;
        const cart_res_cons_put = await fetch(end_point_con_put,options_consignment_put).then((response) => response.json());

        const return_data={
            'locale':locale,
            'checkout':nget_checkout
        }

        res.status(200).json(return_data);
        

    }else{
        res.status(404)
    }
}