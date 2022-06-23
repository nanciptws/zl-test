import { get_checkout_vat, get_currencies, use_api_bc } from '../../config';
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

        //get store info
        const config = use_api_bc(store);

        //get currencies
        const currencies = await get_currencies(store, locale)

        //Get cart
        var options_cart = { method: 'GET', headers: { accept: 'application/json', 'content-type': 'application/json', 'x-auth-token': config.access_token }, json: true};
        const end_point_cart = 'https://api.bigcommerce.com/stores/'+config.store_hash+'/v3/carts/'+cartid+'?include=redirect_urls';
        const cart_res = await fetch(end_point_cart,options_cart).then((response) => response.json()).then((json) => { return json; }).catch((error) => { console.error(error);});

        //local
        const local_arr = locale.split("-");
        const cart_locale = local_arr[0]+"-"+local_arr[1].toUpperCase();

        if(cart_res.status && cart_res.status == 404){
            let line_items_add = {
                "locale" : cart_locale,
                "currency" : {"code" : currencies.currency_code},
                "line_items" : [
                    {
                        "quantity" : quantity,
                        "product_id" : productId
                    }
                ]
            };
            
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
            const cart_res = await fetch(end_point,options).then((response) => response.json()).then((json) => { return json; }).catch((error) => { console.error(error);});

            let checkouts_taxes = {"taxes" : 0};
            //Get Vat in eu store
            if(store == "eu"){
                const get_checkout = await get_checkout_vat(store, locale, cart_res.data.id);
                checkouts_taxes = {"taxes" : get_checkout['data']['taxes']};
            }

            const return_cart = {
                'types':types,
                'cart' : cart_res,
                'currencies': currencies,
                'taxes' : checkouts_taxes
            }
            res.status(200).json(return_cart);
            
        } else{

            const physical_items = cart_res.data.line_items.physical_items;

            let line_id = 0;
            let ext_quantity = 0;
            let is_exit_product = 0;
            for (let pi = 0; pi < physical_items.length; pi++) {
                const v = physical_items[pi];
                if(productId == v['product_id']){
                    line_id = v["id"];
                    ext_quantity = parseInt(v["quantity"])+1;
                    is_exit_product = 1;
                }
            }

            //update line item
            if(is_exit_product === 1){

                //is pdp txt
                if(quantity >= 1){
                    quantity = parseInt(ext_quantity) + parseInt(quantity) - 1;
                }

                let line_items_exits = {
                    "locale" : cart_locale,
                    "currency" : {"code" : currencies.currency_code},
                    "line_item" :  {
                        "quantity" : quantity,
                        "product_id" : productId
                    }
                };
                const types_up = ["Update line items! ___"];

                var options_put = {
                    method: 'PUT',
                    headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    'x-auth-token': config.access_token
                    },
                    body: JSON.stringify(line_items_exits),
                    //json: true
                };
                
                const update_url = 'https://api.bigcommerce.com/stores/'+config.store_hash+'/v3/carts/'+cartid+'/items/'+line_id;
                
                const cur_res = await fetch(update_url,options_put).then((response) => response.json()).then((json) => { return json; }).catch((error) => { console.error(error);});

                const put_return = {
                    'type': types_up,
                    'cart': cur_res
                }

                res.status(200).json(put_return);
                return false;
            } else{
                //echo "new product update line items";

                
                let line_items_new = {
                    "currency" : {"code" : currencies.currency_code},
                    "line_items" : [{
                        "quantity" : quantity,
                        "product_id" : productId
                    }]
                };

                const types_new = ["New product update line items!"];

                var options_new = {
                    method: 'POST',
                    headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    'x-auth-token': config.access_token
                    },
                    body: JSON.stringify(line_items_new),
                    json: true
                };

                const new_por_url = 'https://api.bigcommerce.com/stores/'+config.store_hash+'/v3/carts/'+cartid+'/items';
                
                const cur_res = await fetch(new_por_url,options_new).then((response) => response.json()).then((json) => { return json; }).catch((error) => { console.error(error);});

                const new_return = {
                    'type': types_new,
                    'cart': cur_res
                }

                res.status(200).json(new_return);
                return false;
            }
        }
        
    }else{
        res.status(404)
    }
}