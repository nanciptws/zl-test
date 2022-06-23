import { get_currencies, get_token, use_api_bc } from '../config';

const fetch = require('node-fetch');

export default async function handler(req, res) {  
    const params = req.query.param;
    if(params.length > 0){
        const store = params[0];
        const locale = params[1];
        const config = use_api_bc(store);
    
        //get token
        const store_token = await get_token(store);
    
        const product_query = `query getallproduct {site { products{ edges{ node{ entityId name path } } } } }`;
    
        const end_point_cur = config.store_url+'graphql';
        var options = {
            'method': 'POST',
            'headers': { 'Authorization': `Bearer ${store_token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ query: product_query,
            variables: {} })
        };
        
        const product = await fetch(end_point_cur,options).then((response) => response.json())
        res.status(200).json(product);
    }else{
        res.status(404)
    }
}