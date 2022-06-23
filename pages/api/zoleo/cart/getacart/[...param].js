import { get_checkout_vat, get_currencies, use_api_bc } from '../../config';

const fetch = require('node-fetch');
export default async function handler(req, res) {  
    const params = req.query.param;
    if(params.length > 0){
    
        //get params
        let store = params[0];
        let locale = params[1];
        let cartid = params[2];

        //get store info
        const config = use_api_bc(store);

        //get currencies
        const currencies = await get_currencies(store, locale)

        var options_re = {
            method: 'GET',
            headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'x-auth-token': config.access_token
            },
            json: true
        };
        const end_point_re = 'https://api.bigcommerce.com/stores/'+config.store_hash+'/v3/carts/'+cartid+'?include=redirect_urls';
        const cart_res = await fetch(end_point_re,options_re).then((response) => response.json()).then((json) => { return json; }).catch((error) => { console.error(error);});

        if(cart_res.status && cart_res.status == 404){
            res.send({status: 404});
            return false;
        }
        

        let is_vat = false;
        let checkouts_taxes = {"taxes" : 0};
        if(store == 'eu'){
            is_vat = true;
            const get_checkout = await get_checkout_vat(store, locale, cart_res.data.id);
            checkouts_taxes = {"taxes" : get_checkout['data']['taxes']};
        }
        
        const return_cart = {
            'cart' : cart_res,
            'currencies': currencies,
            'taxes' : checkouts_taxes
        }

        res.status(200).json(return_cart);
    }else{
        res.status(404)
    }
}