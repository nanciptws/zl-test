import Prismic from "prismic-javascript"
import Link from '@components/ui/Link'
import Cookies from "js-cookie";

export const apiEndPoint = process.env.prismic.url;
export const accessToken = process.env.prismic.access_token;
const createClientOption = (req = null, prismicAccessToken = null) => {
    const reqOption = req ? {req} : {};
    const accessTokenOption = prismicAccessToken ? {accessToken: prismicAccessToken} : {};
    return {
        ...reqOption,
        ...accessTokenOption,
    }
}

export const Client = (req = null) => Prismic.client(apiEndPoint, createClientOption(req, accessToken))

export const linkResolver = (type, element, content, children, index) => {
  if (element.data.link_type === 'Document') {
    return <Link href={"/"+element.data.uid} key={element.data.id}>{content}</Link>  
  }
  if (element.data.link_type === 'Web') {
    return <a id={element.data.id} href={element.data.url} key={element.data.url} rel="noopener noreferrer follow" target={element.data.target ? "_blank":"_self"} >{content}</a>
  }
}


  
//export const site_url = "http://localhost:3000/";
export const site_url = "https://www.my.com/";
export const eu_bc_url = process.env.bcapi_eu.store_url;
export const us_bc_url = process.env.bcapi_us.store_url;
export const cognito_urL = process.env.cognito.url;
export const cognito_client_id = process.env.cognito.client_id;

export const get_store_code = (locale) => {
  var store_code = "";
  const eu_store_locale = process.env.locale.eu_store;
  const us_store_locale = process.env.locale.us_store;
  if(eu_store_locale.indexOf(locale) >= 0){
    store_code = 'eu';
  }else{
    store_code = 'us';
  }
  return store_code;
}


//get Header, footer and pages query
export async function prismic_fetch_query(locale, query, getBy){

  //Get Setting
  const content_management = await Client().query(Prismic.Predicates.at('document.type', 'content_management'), { lang: 'en-gb' });
  
    const eu_store = content_management.results[0].data.eu_store;
    const us_store = content_management.results[0].data.us_store;
    const eu_store_arr = eu_store.split(',');
    const us_store_arr = us_store.split(',');
    const eu_length = eu_store_arr.indexOf(locale);
    const us_length = us_store_arr.indexOf(locale);

    //Navnar Dropdown
    const locale_data = content_management.results[0].data.locale_data;
    
    var prismic_lang = "en-gb"

    if(eu_length >= 0){ prismic_lang = 'en-gb'; }
    else if(us_length >= 0){ prismic_lang = 'en-ca'; }

    //menu
    let menu = await Client().query(Prismic.Predicates.at('document.type', 'menu'), { lang: prismic_lang });
    const allow_locales_menu = menu.results[0].data.locales;
    if(typeof(allow_locales_menu) != "undefined" && allow_locales_menu != null){
      const allow_locales_menu_arr = allow_locales_menu.split(',');
      const allow_menu_length = allow_locales_menu_arr.indexOf(locale);
      if(allow_menu_length >= 0){ 
        menu = await Client().query(Prismic.Predicates.at('document.type', 'menu'), { lang: locale });
      }
    }
    
    //footer
    let footer = await Client().query(Prismic.Predicates.at('document.type', 'footer'), { lang: prismic_lang });
    const allow_locales_footer = footer.results[0].data.locales;
    
    if(typeof(allow_locales_footer) != "undefined" && allow_locales_footer != null){
      const allow_locales_footer_arr = allow_locales_footer.split(',');
      const allow_footer_length = allow_locales_footer_arr.indexOf(locale);
      if(allow_footer_length >= 0){ 
        footer = await Client().query(Prismic.Predicates.at('document.type', 'footer'), { lang: locale });
      }
    }
    
    var pages = false;
    if(typeof(getBy) != "undefined"){
      if(query !== false){
        pages = await Client().getByUID(query, getBy, { lang: prismic_lang });
        if(typeof(pages) !== "undefined"){
          //if chnage to content any locales
          const allow_locales = pages.data.locales;
          if(typeof(allow_locales) != "undefined" && allow_locales != null){
            const allow_locales_arr = allow_locales.split(',');
            const allow_length = allow_locales_arr.indexOf(locale);
            if(allow_length >= 0){ 
              pages = await Client().getByUID(query, getBy, { lang: locale });
            }
          }
        }

        //id android device local 
        if(typeof(pages) === "undefined"){
          pages = await Client().getByUID(query, getBy, { lang: locale });
        }

      }
    }
    else{
      if(query !== false){
        pages = await Client().query(Prismic.Predicates.at('document.type', query), { lang: prismic_lang });
        if(typeof(pages) !== "undefined"){
          //if chnage to content any locales
          if(pages.results[0]){
            const allow_locales = pages.results[0].data.locales;
            if(typeof(allow_locales) != "undefined" && allow_locales != null){
              const allow_locales_arr = allow_locales.split(',');
              const allow_length = allow_locales_arr.indexOf(locale);
              if(allow_length >= 0){ 
                pages = await Client().query(Prismic.Predicates.at('document.type', query), { lang: locale });
              }
            }
          }
        }
      }
    }

    const menu_obj = { locale_data, menu }
    return [menu_obj, footer, pages];

}


//get Header, footer and pages query with filter
export async function prismic_fetch_query_with_filter(locale, query, orderings){

  //Get Setting
  const content_management = await Client().query(Prismic.Predicates.at('document.type', 'content_management'), { lang: 'en-gb' });
  const eu_store = content_management.results[0].data.eu_store;
  const us_store = content_management.results[0].data.us_store;
  const eu_store_arr = eu_store.split(',');
  const us_store_arr = us_store.split(',');
  const eu_length = eu_store_arr.indexOf(locale);
  const us_length = us_store_arr.indexOf(locale);
  
  var prismic_lang = "en-gb"

  if(eu_length >= 0){ prismic_lang = 'en-gb'; }
  else if(us_length >= 0){ prismic_lang = 'en-ca'; }

  
  //menu
  let menu = await Client().query(Prismic.Predicates.at('document.type', 'menu'), { lang: prismic_lang });
  const allow_locales_menu = menu.results[0].data.locales;
  if(typeof(allow_locales_menu) != "undefined" && allow_locales_menu != null){
    const allow_locales_menu_arr = allow_locales_menu.split(',');
    const allow_menu_length = allow_locales_menu_arr.indexOf(locale);
    if(allow_menu_length >= 0){ 
      menu = await Client().query(Prismic.Predicates.at('document.type', 'menu'), { lang: locale });
    }
  }
  
  //footer
  let footer = await Client().query(Prismic.Predicates.at('document.type', 'footer'), { lang: prismic_lang });
  const allow_locales_footer = footer.results[0].data.locales;
  
  if(typeof(allow_locales_footer) != "undefined" && allow_locales_footer != null){
    const allow_locales_footer_arr = allow_locales_footer.split(',');
    const allow_footer_length = allow_locales_footer_arr.indexOf(locale);
    if(allow_footer_length >= 0){ 
      footer = await Client().query(Prismic.Predicates.at('document.type', 'footer'), { lang: locale });
    }
  }


  var pages = false;
  if(query !== false){
    ///*page,pageSize: 20,*/
    pages = await Client().query(Prismic.Predicates.at('document.type', query), { orderings: orderings, lang: prismic_lang });
    //if chnage to content any locales
    const allow_locales = pages.results[0].data.locales;
    if(typeof(allow_locales) != "undefined" && allow_locales != null){
      const allow_locales_arr = allow_locales.split(',');
      const allow_length = allow_locales_arr.indexOf(locale);
      if(allow_length >= 0){ 
        pages = await Client().query(Prismic.Predicates.at('document.type', query), { orderings: orderings, lang: locale });
      }
    }
  } 
  return [menu, footer, pages];
}

  
export const bc_data_cookies = (sc, locale) => {
  const auth_cookes = Cookies.get('bc_data');
  var customer_id = 0;
  if(typeof(auth_cookes) !== "undefined"){
    const bc_data = JSON.parse(auth_cookes);
    customer_id = bc_data[sc+'_id'];
  }
  return customer_id;
}


//sitemap_generator_fn
export async function sitemap_generator_fn(sc, locale, fs){

  //Product
  const end_point_products = site_url+`api/zoleo/get-all-product/${sc}/${locale}`;
  const product = await fetch(end_point_products).then((response) => response.json()).then((json) => { return json; }).catch((error) => { console.error(error);});  
  const products = product.data.site.products.edges;

  //Blog List
  const blog = await prismic_fetch_query_with_filter(locale,'blog_post', '[document.last_publication_date desc]');
  const blog_list = blog[2].results;
  const baseUrl = site_url;

  let path_pages = "/var/task/.next/server/pages";
  if(baseUrl == "http://localhost:3000/"){
    path_pages = "pages";
  }

  
  let prismic_pages = [];

  const response = await fetch(`${apiEndPoint}?access_token=${accessToken}`)
  const parsedResponse = await response.json()
  const masterRef = parsedResponse && parsedResponse.refs && parsedResponse.refs.find(ref => ref.isMasterRef)
  const prismic_data = await fetch(`${apiEndPoint}/documents/search?ref=${masterRef.ref}&page=1&pageSize=100&lang=${locale}`).then((res) => res.json());
  for (let ir = 0; ir < prismic_data.results.length; ir++) {
    const ele = prismic_data.results[ir];
    const uid = ele.uid;
    prismic_pages.push(uid)
  }
  
  let count = 1;
  const total_pages = prismic_data.total_pages;
  if(total_pages > 1){
    for (let ip = 0; ip < total_pages; ip++) {
      if(count != 1){
        const prismic_data_1 = await fetch(`${apiEndPoint}/documents/search?ref=${masterRef.ref}&page=${count}&pageSize=100&lang=${locale}`).then((res) => res.json());
        for (let ir = 0; ir < prismic_data_1.results.length; ir++) {
          const ele = prismic_data_1.results[ir];
          const uid = ele.uid;
          prismic_pages.push(uid)
        }
      }
      count++;
    }
  }

  function removeExtension(filename){
    const etx = filename.split('.').pop();
    if(filename.split('.').length > 1){
      return baseUrl+locale+"/"+filename.replace("."+etx,'');
    } else{
      return baseUrl+locale+"/"+filename;
    }
  }
  function removeExtension_fname(filename){
    const etx = filename.split('.').pop();
    if(filename.split('.').length > 1){
      return filename.replace("."+etx,'');
    } else{
      return filename;
    }
  }
  const staticPages = fs
    .readdirSync(path_pages)
    .filter((staticPage) => {
      return ![
        'en-gb','en-no','en-se','en-dk','en-fi',
        'de-gb','de-de','en-ca','en-us','en-au','en-nz',
        'it','fr','de', 'se', 'fi', 'no', 'da', 'en', 'sv',
        "_app.tsx",
        "_app.js",
        "[...pages].tsx",
        "_document.tsx",
        "_document.js",
        "_error.js",
        "sitemap.xml.js",
        "auth-in-php.js",
        "customer",
        "page",
        "product",
        "type-of-action",
      ].includes(staticPage);
    })
    .map((staticPagePath) => {
      return `${staticPagePath}`;
    });
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
          <loc>${baseUrl+locale}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>0.5</priority>
        </url>

      ${staticPages
        .map((url) => {
          if(prismic_pages.indexOf(removeExtension_fname(url)) > 0){
            return `
              <url>
                <loc>${removeExtension(url)}</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
                <changefreq>monthly</changefreq>
                <priority>0.5</priority>
              </url>
            `;
          }
        })
        .join("")}

        ${blog_list.map((list) => {
            return `
              <url>
                <loc>${baseUrl+locale+'/newsroom/'+list.uid}</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
                <changefreq>monthly</changefreq>
                <priority>0.5</priority>
              </url>
            `;
        }).join("")}

        ${products.map((list) => {
          const ppath = list.node.path.replace(/\//g, '');
          const ppath_1 = ppath.replace('zoleo-', '');

          let final_product = prismic_pages[prismic_pages.indexOf(ppath)];
          if(typeof(prismic_pages[prismic_pages.indexOf(ppath)]) == 'undefined'){
            final_product = prismic_pages[prismic_pages.indexOf(ppath_1)];
          }

          if(prismic_pages.indexOf(ppath) > 0 || prismic_pages.indexOf(ppath_1) > 0){
            if(typeof(final_product) != "undefined"){
              return `
                <url>
                  <loc>${baseUrl+locale+"/product/"+final_product}</loc>
                  <lastmod>${new Date().toISOString()}</lastmod>
                  <changefreq>monthly</changefreq>
                  <priority>1.0</priority>
                </url>
              `;
            }
          }
        })
        .join("")}
        
    </urlset>
  `;
  return sitemap;
}


export const filterResultsByTypename = (nodes, typename) => {
  const results = [];
  const keys = Object.keys(nodes);
  for (let i = 0; i < keys.length; i++) {
      const data = nodes[keys[i]];
      if (data && data.slice_type === typename) {
          results.push(data);
      }
  }
  return results;  
}