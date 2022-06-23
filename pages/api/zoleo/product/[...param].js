import { get_currencies, get_token, use_api_bc } from '../config';

const fetch = require('node-fetch');

export default async function handler(req, res) {  
    const params = req.query.param;
    if(params.length > 0){
        const store = params[0];
        const locale = params[1];
        let productId = params[2];
        const config = use_api_bc(store);
    
        //get token
        const store_token = await get_token(store);
    
        //get currencies
        const currencies = await get_currencies(store, locale)
        const currencies_id = currencies.id;
    
        const product_query = `query productById { site { product(entityId: ${productId}) { entityId name sku path categories{ edges{ node{ name } } } prices(includeTax:false){ basePrice { value } salePrice { value } } customFields{ edges{ node{ name value } } } defaultImage{ ...ImageFields } images{ edges{ node{ ...ImageFields } } } inventory{ isInStock hasVariantInventory aggregated{ availableToSell warningLevel } } description plainTextDescription availabilityV2{ status description } relatedProducts{ edges{ node{ entityId name sku path images{ edges{ node{ url(width:320) isDefault } } } prices(includeTax:true){ basePrice { value } salePrice {value} } } } } } } } fragment ImageFields on Image { url80wide: url(width: 80) url600wide: url(width: 500) altText isDefault }`;
    
        
        const end_point_cur = config.store_url+'graphql?setCurrencyId='+currencies_id;
        var options = {
            'method': 'POST',
            'headers': { 'Authorization': `Bearer ${store_token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ query: product_query,
            variables: {} })
        };
        
        const product = await fetch(end_point_cur,options).then((response) => response.json())
        const product_obj = {
            'currencies' : currencies,
            'product' : product
        }
        res.status(200).json(product_obj);
    }else{
        res.status(404)
    }
}