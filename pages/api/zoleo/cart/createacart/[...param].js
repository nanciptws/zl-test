import { get_checkout_vat, get_currencies, update_customer_id, use_api_bc } from '../../config';

const fetch = require('node-fetch');
export default async function handler(req, res) {  
    const params = req.query.param;
    if(params.length > 0){
    
        //get params
        let store = params[0];
        let locale = params[1];
        let productId = params[2];
        let quantity = params[3];
        let customerId = params[4];
        let cartid = params[5];
        let cCode = params[6];
        let action = params[7];

        //get store info
        const config = use_api_bc(store);

        //get currencies
        const currencies = await get_currencies(store, locale)
        
        const local_arr = locale.split("-");
        const cart_locale = local_arr[0]+"-"+local_arr[1].toUpperCase();

        let line_items_add = [];
        if(action == "re_create"){
            var options_re = {
                method: 'GET',
                headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                'x-auth-token': config.access_token
                },
                json: true
            };
            const end_point_re = 'https://api.bigcommerce.com/stores/'+config.store_hash+'/v3/carts/'+cartid;
            const data_re = await fetch(end_point_re,options_re).then((response) => response.json()).then((json) => { return json; }).catch((error) => { console.error(error);});
            
            
            const physical_items = data_re.data.line_items.physical_items;
            
            const line_items = [];

            if(productId > 0){
                line_items.push({"quantity" : quantity,"product_id" : productId})
            }

            for (let pi = 0; pi < physical_items.length; pi++) {
                const v = physical_items[pi];
                const productId = v['product_id'];
                const quantity = v['quantity'];
                line_items.push({"quantity" : quantity,"product_id" : productId})
            }

            line_items_add = {
                "locale" : cart_locale,
                "currency" : {"code" : cCode},
                "line_items" : line_items
            };


        }else{

            line_items_add = {
                "locale" : cart_locale,
                "currency" : {"code" : currencies.currency_code},
                "line_items" : [
                    {
                        "quantity" : quantity,
                        "product_id" : productId
                    }
                ]
            };
            
        }

        
        const types = ["Create a Cart!",{'success' : 'Y'}];

        var options = {
            method: 'POST',
            headers: {
            accept: 'application/json',
            'content-type': 'application/json',
            'x-auth-token': config.access_token
            },
            body: JSON.stringify(line_items_add),
            json: true
        };
        const end_point = 'https://api.bigcommerce.com/stores/'+config.store_hash+'/v3/carts';
        const cur_res = await fetch(end_point,options).then((response) => response.json()).then((json) => { return json; }).catch((error) => { console.error(error);});


        let card_id = 0;
        if(cur_res.data){
            card_id = cur_res.data.id;
        }
        // if(cur_res.status && cur_res.status == 422){
        //     card_id = 0;
        // }

        let checkouts_taxes = {"taxes" : 0};
        if(card_id != 0){
            //update_customer in cart
            await update_customer_id(store, locale, customerId, card_id);
            //Get Vat in eu store
            if(store == "eu"){
                const get_checkout = await get_checkout_vat(store, locale, card_id);
                checkouts_taxes = {"taxes" : get_checkout['data']['taxes']};
            }
        }
        
        const return_cart = {
            "new":"api",
            'types':types,
            'cart' : cur_res,
            'currencies': currencies,
            'taxes' : checkouts_taxes
        }

        res.status(200).json(return_cart);
    }else{
        res.status(404)
    }
}