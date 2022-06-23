//get_store_info
export const use_api_bc = (store) => {  
    let config = process.env.bcapi_us
    if(store == "eu"){
        config = process.env.bcapi_eu;
    }
    return config;
}

export const get_token = async (store) => {
    const config = use_api_bc(store);
    let date = new Date(); date.setDate(date.getDate() + 7);
    const unix_timestamp = Math.floor((date).getTime() / 1000)
    var options = {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-auth-token': config.access_token},
        body: JSON.stringify({channel_id: 1, expires_at: unix_timestamp}),
        json: true
    };
    const end_point = 'https://api.bigcommerce.com/stores/'+config.store_hash+'/v3/storefront/api-token';
    const token = await fetch(end_point,options).then((response) => response.json());
    return token.data.token;
}

//get_currencies
export const get_currencies = async (store,locale) => {
    const config = use_api_bc(store);
    const end_point_cur = 'https://api.bigcommerce.com/stores/'+config.store_hash+'/v2/currencies';
    const options_cur = {
      'method': 'GET',
      'headers': { 'accept': 'application/json', 'Content-Type': 'application/json', 'x-auth-token': config.access_token }
    };
    const cur_res = await fetch(end_point_cur,options_cur).then((response) => response.json()).then((json) => { return json; }).catch((error) => { console.error(error);});

    let currency = [];
    for (let cs = 0; cs < cur_res.length; cs++) {
      const cur_ele = cur_res[cs];
      const id = cur_ele['id'];
      const name = cur_ele['name'];
      const is_default = cur_ele['is_default'];
      const isdefault = cur_ele['is_default'] == true ? "y":"n";
      const currency_code = cur_ele['currency_code'];
      const token = cur_ele['token'];
      const rate = cur_ele['currency_exchange_rate'];

      const in_currency_locale = name.split("@");
      if(in_currency_locale.length > 0){
        const arr_currency_locale = in_currency_locale[1].split(",");
        if(arr_currency_locale.indexOf(locale) != "-1"){
          currency = {"is_default" : isdefault, "id" : id, "currency_code" : currency_code,"token" : token,"rate" : rate};
        }
      }
      
    }
    return currency;
}


//update_customer_id in cart
export const update_customer_id = async (store, locale, id, card_id) => {
  const config = use_api_bc(store);
  var options = {
      method: 'PUT',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'x-auth-token': config.access_token
      },
      body: JSON.stringify({customer_id: id}),
      json: true
  };
  const end_point = 'https://api.bigcommerce.com/stores/'+config.store_hash+'/v3/carts/'+card_id;
  const data = await fetch(end_point,options).then((response) => response.json()).then((json) => { return json; }).catch((error) => { console.error(error);});
  return data;
}


//get checkouts vat
export const get_checkout_vat = async (store, locale, card_id) => {
  const config = use_api_bc(store);
  var options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        'x-auth-token': config.access_token
      },
      json: true
  };
  const end_point = 'https://api.bigcommerce.com/stores/'+config.store_hash+'/v3/checkouts/'+card_id;
  const data = await fetch(end_point,options).then((response) => response.json()).then((json) => { return json; }).catch((error) => { console.error(error);});
  return data;
}

