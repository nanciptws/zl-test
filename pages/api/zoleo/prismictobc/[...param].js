import NextCors from 'nextjs-cors';
const fetch = require('node-fetch');
const prismic = require('@prismicio/client');
const PrismicDOM = require('prismic-dom');

export default async function handler(req, res) {  

    await NextCors(req, res, {
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200
    });

    const repoName = process.env.prismic.repo_name;
    const accessToken = process.env.prismic.access_token;
    const endpoint = prismic.getEndpoint(repoName);
    const params = req.query.param;
    
    if(params.length > 0){
        
        //get params
        const store = params[0];
        const locale = params[1];
        let type = params[2];

        const linkResolver = (type, element, content, children, index) => {
            if (type.link_type == 'Document') { return "/"+locale+"/"+type.uid; }
            if (type.link_type === 'Web') { return type.url; }
        }

        const routes = [ { type: 'content_management', path: '/:uid'}, { type: 'menu', path: '/:uid'}, { type: 'footer', path: '/:uid' } ]
        const client = prismic.createClient(endpoint, { routes, fetch, accessToken })

        //get All settings
        const content_management = await client.getAllByType('content_management', {lang: 'en-gb',});
        const res_cm = content_management[0].data;

        const eu_store = res_cm.eu_store;
        const us_store = res_cm.us_store;
        const eu_store_arr = eu_store.split(',');
        const us_store_arr = us_store.split(',');

        const eu_length = eu_store_arr.indexOf(locale);
        const us_length = us_store_arr.indexOf(locale);
        

        let prismic_lang = "en-gb";
        if(eu_length >= 0){ prismic_lang = 'en-gb'; }
        else if(us_length >= 0){ prismic_lang = 'en-ca'; }

        
        //region_selector
        const region_selector = res_cm.locale_data;


        // orderings: {
        // field: 'document.first_publication_date',
        // direction: 'desc',
        // },

        //get Menu
        const fetch_menu = await client.getAllByType('menu', {lang: prismic_lang,});
        let menu = fetch_menu[0].data;
        if(menu.locales != null && typeof(menu.locales) != "undefined"){
            const allow_locales_menu = menu.locales;
            const allow_locales_menu_arr = allow_locales_menu.split(',');
            const allow_menu_length = allow_locales_menu_arr.indexOf(locale);
            if(allow_menu_length >= 0){ 
                const fetch_menu_1 = await client.getAllByType('menu', {lang: locale,});
                menu = fetch_menu_1[0].data;
            }
        }
        

        //get footer
        const fetch_footer = await client.getAllByType('footer', {lang: prismic_lang,});
        let footer = fetch_footer[0].data;
        if(footer.locales != null && typeof(footer.locales) != "undefined"){
            const allow_locales_footer = footer.locales;
            const allow_locales_footer_arr = allow_locales_footer.split(',');
            const allow_footer_length = allow_locales_footer_arr.indexOf(locale);
            if(allow_footer_length >= 0){ 
                const fetch_footer_1 = await client.getAllByType('footer', {lang: locale,});
                footer = fetch_footer_1[0].data;
            }
        }

        let return_data ={
            'lang':locale,
            'menu' :menu,
            'footer' :footer,
            'region_selector':region_selector
        }

        if(type == "chk_confirmation"){
            const fetch_checkout = await client.getAllByType('checkout', {lang: prismic_lang,});
            const checkout = fetch_checkout[0].data;
            
            //asTree
            var html_checkout_desc = PrismicDOM.RichText.asHtml(checkout.desc, linkResolver);

            return_data ={
                'lang':locale,
                'menu' :menu,
                'footer' :footer,
                'region_selector':region_selector,
                "checkout" :checkout,
                "checkout_desc":html_checkout_desc
            }
        }

        res.status(200).json(return_data);
    }
}