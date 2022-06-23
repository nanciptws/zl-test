import { get_currencies } from '../config';
export default async function handler(req, res) {  
    const params = req.query.param;
    const store = params[0];
    const locale = params[1];
    if(params.length > 0){
        const currencies = await get_currencies(store, locale)
        res.status(200).json(currencies);
    }
}