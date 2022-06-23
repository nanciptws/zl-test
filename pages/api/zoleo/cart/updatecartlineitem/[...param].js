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
        let itemId = params[6];
        let totalItems = params[7];
        let type = params[8];

        //get store info
        const config = use_api_bc(store);

        //get currencies
        const currencies = await get_currencies(store, locale)

        //local
        const local_arr = locale.split("-");
        const cart_locale = local_arr[0]+"-"+local_arr[1].toUpperCase();

        
        if(type == "i"){
            quantity = parseInt(quantity)+1;
        } else{
            if(quantity == 1 && type == "d"){
                quantity = parseInt(0);
            } else{
                quantity = parseInt(quantity)-1;
            }
        }

        // //is pdp txt
        // if($txtqty >= 1){
        //     $quantity = $txtqty + $quantity - 1;
        // }

        if(totalItems == 1 && quantity == 0 && type == "d"){
            const types = {'remove_cart' : 'Y'};
            var options_delete = {
                method: 'DELETE',
                headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    'x-auth-token': config.access_token
                }
            };
            const delete_url = 'https://api.bigcommerce.com/stores/'+config.store_hash+'/v3/carts/'+cartid;
            
            const cur_res = await fetch(delete_url,options_delete).then((response) => response.json()).then((json) => { return json; }).catch((error) => { console.error(error);});

            const return_cart = {
                'types':types,
                'cart' : cur_res,
                'currencies': currencies
            }
            res.status(200).json(return_cart);
        } else{
            if(quantity == 0){
                const types = {'remove_cart' : 'N'};
                var options_put = {
                    method: 'DELETE',
                    headers: {
                        accept: 'application/json',
                        'content-type': 'application/json',
                        'x-auth-token': config.access_token
                    }
                };
                const update_url = 'https://api.bigcommerce.com/stores/'+config.store_hash+'/v3/carts/'+cartid+'/items/'+itemId;
                
                const cur_res = await fetch(update_url,options_put).then((response) => response.json()).then((json) => { return json; }).catch((error) => { console.error(error);});

                const return_cart = {
                    'types':types,
                    'cart' : cur_res,
                    'currencies': currencies
                }
                res.status(200).json(return_cart);
                
            } else{
                //update_customer_id($card_id, $cid);

                let line_items_exits = {
                    "customer_id" : customerId,
                    "currency" : {"code" : currencies.currency_code},
                    "line_item" :  {
                        "quantity" : quantity,
                        "product_id" : productId
                    }
                };
                var types_up = {'success' : 'Y'};

                var options_put = {
                    method: 'PUT',
                    headers: {
                    accept: 'application/json',
                    'content-type': 'application/json',
                    'x-auth-token': config.access_token
                    },
                    body: JSON.stringify(line_items_exits),
                    json: true
                };
                
                const update_url = 'https://api.bigcommerce.com/stores/'+config.store_hash+'/v3/carts/'+cartid+'/items/'+itemId;
                
                const cur_res = await fetch(update_url,options_put).then((response) => response.json()).then((json) => { return json; }).catch((error) => { console.error(error);});

                if(cur_res.status && cur_res.status == 422){
                    types_up = { 'success' : 'N', 'items_id' : itemId }
                }
                const put_return = { 'types': types_up, 'cart': cur_res }
                
                let is_exit = true;
                if(cur_res.status && cur_res.status == 404){
                    is_exit = false;
                }

                if(is_exit == true){
                    res.status(200).json(put_return);
                    return false;
                } else{
                    
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
                    const types = {"action":"Create a Cart!",'success' : 'Y'};
                    const end_point = 'https://api.bigcommerce.com/stores/'+config.store_hash+'/v3/carts';
                    const cur_res = await fetch(end_point,options).then((response) => response.json()).then((json) => { return json; }).catch((error) => { console.error(error);});
                    const card_id = cur_res.data.id;
                    let checkouts_taxes = {"taxes" : 0};
                    //Get Vat in eu store
                    if(store == "eu"){
                        const get_checkout = await get_checkout_vat(store, locale, card_id);
                        checkouts_taxes = {"taxes" : get_checkout['data']['taxes']};
                    }
                    const return_cart = {
                        'types':types,
                        'cart' : cur_res,
                        'currencies': currencies,
                        'taxes' : checkouts_taxes
                    }
                    res.status(200).json(return_cart);
                    return false;
                }
            }
        }
        
    }else{
        res.status(404)
    }
}