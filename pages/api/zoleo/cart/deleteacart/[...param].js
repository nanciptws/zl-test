import { use_api_bc } from '../../config';
const fetch = require('node-fetch');

export default async function handler(req, res) {  
    const params = req.query.param;
    if(params.length > 0){
    
        //get params
        let store = params[0];
        let locale = params[1];
        let cartid = params[2];
        let itemId = params[3];
        let totalItems = params[4];
        
        //get store info
        const config = use_api_bc(store);

        //Delete
        if(totalItems == "1"){
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
                'cart' : cur_res
            }
            res.status(200).json(return_cart);
            return false;
        } else{
            const types = {'remove_cart' : 'N'};
            const options_put = {
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
                'cart' : cur_res
            }
            res.status(200).json(return_cart);
            return false;
        } 
        
    }else{
        res.status(404)
    }
}