const { withCommerceConfig } = require('./framework/commerce/config')


//Europe Store locale
const eu_store_locale = ['en-gb', 'en-no', 'en-se', 'en-dk', 'en-fi'];

//Store 1 locale
const us_store_locale = ['zl-st', 'de-gb', 'de-de', 'en-ca', 'en-us', 'en-au', 'en-nz'];


//only use android and ios mobile withour Head & Footer
const android_os_locale = ['it', 'fr', 'de', 'se', 'fi', 'no', 'da', 'en', 'sv'];


const arr_1 = eu_store_locale.concat(us_store_locale);
const arr_2 = arr_1.concat(android_os_locale);

const locales = arr_2;
const defaultLocale = 'de-gb';


module.exports = withCommerceConfig({
    env: {
        locale: {
            "eu_store": eu_store_locale,
            "us_store": us_store_locale
        },
        bcapi_eu: {
            "store_hash": "balujsf",
            "access_token": "ihrewa9h7m31u2win2",
            "client_id": "twgdxc54vfl2xb5xjet",
            "client_secret": "9b868bc38387ca82181f87f5408d1f527e16b",
            "store_url": "https://store.my.com/"
        },
        bcapi_us: {
            "store_hash": "zirihc1s",
            "access_token": "4b9q7cpdwcj8kfbbrav43rnb",
            "client_id": "87o2m5a9bb4xtltk8xvf9ad",
            "client_secret": "0d649945f9a70a79751efa54b44cb4e0a521f3a62da8d",
            "store_url": "https://store-1.mybigcommerce.com/"
        },
        cognito: {
            "url": "https://auth.us-east-1.amazoncognito.com/",
            "client_id": "1klev5r63lot",
            "access_key_id": "ALWSYGLAZVO",
            "secret_access_key": "SSh78RFRfLLSzMFNyj+xpD+6qP",
            "region": "us-east-2"
        },
        prismic: {
            "url": "https://prismic.io/api/v2",
            "repo_name": "inc",
            "access_token": "77-9EO-_vQ4T77-977-9Ve-_vSjvv70p77-977-9Pu-_ve-_vV5ONO-_ve-_vU8A77-977-9Ce-_ve-_ve-_ve-_vW4"
        }
    },
    experimental: {
        scrollRestoration: true
    },
    i18n: {
        locales,
        defaultLocale,
        localeDetection: false
    },
    trailingSlash: false,
    reactStrictMode: false,
    images: {
        domains: ['images.prismic.io', 'cdn11.bigcommerce.com', 'api.bigcommerce.com'],
    }
})

// Don't delete this console log, useful to see the commerce config in Vercel deployments
console.log('next.config.js', JSON.stringify(module.exports, null, 2))