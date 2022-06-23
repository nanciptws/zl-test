import NextCors from 'nextjs-cors';
const fetch = require('node-fetch');
var AWS = require("aws-sdk");

export default async function handler(req, res) {
    
    await NextCors(req, res, {
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200
    });
    
    const params = req.query.param;
    //:email/:given_name/:family_name/:phone_number/:aws_token
    if(params.length > 0){
        
        //get params
        const email = params[0];
        const given_name = params[1];
        const family_name = params[2];
        let phone_number = params[3];
        const aws_token = params[4];
        const COGNITO_AUD = process.env.cognito.client_id;
        const AWS_ACCESS_KEY_ID = process.env.cognito.access_key_id;
        const AWS_SECRET_ACCESS_KEY = process.env.cognito.secret_access_key;
        const AWS_REGION = process.env.cognito.region;
        let return_array = null;
        const config_eu = process.env.bcapi_eu;
        const config_us = process.env.bcapi_us;

        const substring = "+";
        if(!phone_number.includes(substring)){
            phone_number = "+"+phone_number
        }

        phone_number = phone_number.replace(/ /g,"");
        
        
        AWS.config.update({
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY,
            'version' : 'latest',
        }); 
        const cognitoIdServiceProvider = new AWS.CognitoIdentityServiceProvider({
            region: AWS_REGION,
        });

        var params_cog =  {
            AccessToken:aws_token,
            UserAttributes: [
                {
                    Name: "given_name",
                    Value: given_name
                },
                {
                    Name: "family_name",
                    Value: family_name
                },
                {
                    Name: "phone_number",
                    Value: phone_number
                }
            ]
        }

        cognitoIdServiceProvider.updateUserAttributes(params_cog, function(err, data) {
            console.log('err')
            console.log(err)
            if(err) {
                console.log(err.code)
                console.log(' ')
                console.log(' ')
                console.log('----------------------')
                if(err.code == "NotAuthorizedException"){
                    return_array = { 'status':false, 'message':'auth' };
                } else if(err.code == "InvalidParameterException"){
                    return_array = { 'status':false, 'message':"Invalid phone number format." };
                }
                res.status(200).json(return_array);                
            } else {
                return_array = { 'status':true, 'message':"Your account details have been updated." };

                //////////////////////////////////////////////////////////////EU
                //Get Customer from EU
                var get_options_eu = {method: 'GET', headers: {accept: 'application/json','content-type': 'application/json','x-auth-token': config_eu.access_token}};
                const get_end_point_eu = 'https://api.bigcommerce.com/stores/'+config_eu.store_hash+'/v3/customers?email%3Ain='+email;
                fetch(get_end_point_eu,get_options_eu).then((response) => response.json()).then((data) => {
                    if(data.data.length > 0){
                        const customer_id = data.data[0].id;
                        const bc_body= [{id:customer_id,first_name: given_name,last_name: family_name,phone: phone_number}];
                        var options_eu = {method: 'PUT',headers: { 'content-type': 'application/json', 'x-auth-token': config_eu.access_token},body: JSON.stringify(bc_body),json: true};
                        const end_points_eu = 'https://api.bigcommerce.com/stores/'+config_eu.store_hash+'/v3/customers';
                        fetch(end_points_eu,options_eu).then((response) => response.json()).then((data) => {

                            //////////////////////////////////////////////////////////////US start
                            //Get Customer from US
                            var get_options_us = {method: 'GET', headers: {accept: 'application/json','content-type': 'application/json','x-auth-token': config_us.access_token}};
                            const get_end_point_us = 'https://api.bigcommerce.com/stores/'+config_us.store_hash+'/v3/customers?email%3Ain='+email;
                            fetch(get_end_point_us,get_options_us).then((response) => response.json()).then((data) => {
                                if(data.data.length > 0){
                                    const customer_id = data.data[0].id;
                                    const bc_body= [{id:customer_id,first_name: given_name,last_name: family_name,phone: phone_number}];
                                    var options_us = {method: 'PUT',headers: { 'content-type': 'application/json', 'x-auth-token': config_us.access_token},body: JSON.stringify(bc_body),json: true};
                                    const end_points_us = 'https://api.bigcommerce.com/stores/'+config_us.store_hash+'/v3/customers';
                                    fetch(end_points_us,options_us).then((response) => response.json()).then((data) => {});
                                    res.status(200).json(return_array);
                                }
                            });
                            //////////////////////////////////////////////////////////////US End

                        });
                    }
                });
                
            }
        });


        
    }
}