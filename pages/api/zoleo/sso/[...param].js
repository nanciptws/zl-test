const jwt = require('jsonwebtoken');
const {v4: uuidv4} = require('uuid');
const fetch = require('node-fetch');

export default async function handler(req, res) {  
    const params = req.query.param;
    if(params.length > 0){
    
        //get params
        const store = params[0];
        const locale = params[1];
        const type = params[2];
        const cognitoToken = params[3];
        const COGNITO_AUD = process.env.cognito.client_id;
        let return_array = { 'status':false, 'message':'Authentication failed.' };

        const userData = JSON.parse(Buffer.from(cognitoToken, 'base64').toString('utf-8'));
        const email     = userData['email'];
        const firstName = userData['given_name'];
        const lastName  = userData['family_name'];
        const aud       = userData['aud'];

        if(aud == COGNITO_AUD){
            const config_eu = process.env.bcapi_eu;
            const config_us = process.env.bcapi_us;
            let customer_id_eu = 0;
            let customer_id_us = 0;

            let is_login_url = "account.php?action=order_status&locale="+locale+"&sc="+store;
            if(type == "checkout"){
                is_login_url = "checkout";
            }

            function getLoginUrl_eu(customerId) {
                const dateCreated_eu = Math. round((new Date()). getTime() / 1000);
                const  payload = {
                    "iss": config_eu.client_id,
                    "iat": dateCreated_eu,
                    "jti": uuidv4(),
                    "operation": "customer_login",
                    "store_hash": config_eu.store_hash,
                    "customer_id": customerId,
                    "redirect_to" : config_eu.store_url+is_login_url
                }
                let token = jwt.sign(payload, config_eu.client_secret, {algorithm:'HS256'});
                return `${config_eu.store_url}login/token/${token}`;
            };
            function getLoginUrl_us(customerId) {
                const dateCreated_us = Math. round((new Date()). getTime() / 1000);
                const  payload = {
                    "iss": config_us.client_id,
                    "iat": dateCreated_us,
                    "jti": uuidv4(),
                    "operation": "customer_login",
                    "store_hash": config_us.store_hash,
                    "customer_id": customerId,
                    "redirect_to" : config_us.store_url+is_login_url
                }
                let token = jwt.sign(payload, config_us.client_secret, {algorithm:'HS256'});
                return `${config_us.store_url}login/token/${token}`;
            };
            
            
            //////////////////////////////////////////////////////////////EU
            //Get Customer from EU
            var get_options_eu = {method: 'GET', headers: {accept: 'application/json','content-type': 'application/json','x-auth-token': config_eu.access_token}};
            const get_end_point_eu = 'https://api.bigcommerce.com/stores/'+config_eu.store_hash+'/v3/customers?email%3Ain='+email;
            const customer_eu = await fetch(get_end_point_eu,get_options_eu).then((response) => response.json()).then((json) => { return json; }).catch((error) => { console.error(error);});        
            
            //exits customer get ID
            if(customer_eu.data.length > 0){
                customer_id_eu = customer_eu.data[0].id;
            }
            //new customer add
            else{
                const new_customer_obj_eu = [{'first_name':firstName,'last_name':lastName,'email':email}];
                const new_options_eu = {method: 'POST', headers: {accept: 'application/json','content-type': 'application/json','x-auth-token': config_eu.access_token}, body: JSON.stringify(new_customer_obj_eu)};
                const new_end_point_eu = 'https://api.bigcommerce.com/stores/'+config_eu.store_hash+'/v3/customers';
                const new_customer_eu = await fetch(new_end_point_eu,new_options_eu).then((response) => response.json()).then((json) => { return json; }).catch((error) => { console.error(error);});        
                customer_id_eu = new_customer_eu.data[0].id;
            }
            const checkout_url_eu = config_eu.store_url+"checkout";

            


            //////////////////////////////////////////////////////////////US
            //Get Customer from US
            var get_options_us = {method: 'GET', headers: {accept: 'application/json','content-type': 'application/json','x-auth-token': config_us.access_token}};
            const get_end_point_us = 'https://api.bigcommerce.com/stores/'+config_us.store_hash+'/v3/customers?email%3Ain='+email;
            const customer_us = await fetch(get_end_point_us,get_options_us).then((response) => response.json()).then((json) => { return json; }).catch((error) => { console.error(error);});        
            
            //exits customer get ID
            if(customer_us.data.length > 0){
                customer_id_us = customer_us.data[0].id;
            }
            //new customer add
            else{
                const new_customer_obj_us = [{'first_name':firstName,'last_name':lastName,'email':email}];
                const new_options_us = {method: 'POST', headers: {accept: 'application/json','content-type': 'application/json','x-auth-token': config_us.access_token}, body: JSON.stringify(new_customer_obj_us)};
                const new_end_point_us = 'https://api.bigcommerce.com/stores/'+config_us.store_hash+'/v3/customers';
                const new_customer_us = await fetch(new_end_point_us,new_options_us).then((response) => response.json()).then((json) => { return json; }).catch((error) => { console.error(error);});        
                customer_id_us = new_customer_us.data[0].id;
            }
            const checkout_url_us = config_us.store_url+"checkout";

            //Customer login jwt
            const login_url_eu = getLoginUrl_eu(customer_id_eu);
            const login_url_us = getLoginUrl_us(customer_id_us);

            if(customer_id_eu > 0 && customer_id_us > 0) {

                //final data EU & US
                return_array = {
                    'status':true,
                    'sc': store,
                    'locale':locale,
                    'type' : type,
                    'eu_login_url':login_url_eu,
                    'eu_checkout_url':checkout_url_eu,
                    'eu_store_url':config_eu.store_url,
                    'eu_auth':customer_id_eu,
                    'us_login_url':login_url_us,
                    'us_checkout_url':checkout_url_us,
                    'us_store_url':config_us.store_url,
                    'us_auth':customer_id_us
                };

            }
        }
        res.status(200).json(return_array);
    }else{
        res.status(404)
    }
}