import { FC, useEffect } from 'react'
import NextHead from 'next/head'
import { DefaultSeo } from 'next-seo'
import config from '@config/seo.json'
import $ from 'jquery'
import { useRouter } from 'next/router'

const Head: FC = () => {
  const locale = useRouter().locale;
  const global_measurement_id = "G-0RW67BGLGE";
  let measurement_id = "";
  
  if(locale == "en-gb"){
    measurement_id = "G-HV7ZEQKB9Z";
  }
  else if(locale == "en-no"){
    measurement_id = "G-19FNWJHVBN";
  }
  else if(locale == "en-se"){
    measurement_id = "G-RLH6Y3G7ZF";
  }
  else if(locale == "en-fi"){
    measurement_id = "G-1SZ1VWF32K";
  }
  else if(locale == "en-dk"){
    measurement_id = "G-NSB2V9R012";
  }
  else if(locale == "en-ca"){
    measurement_id = "UA-141188129-9";
  }
  else if(locale == "en-us"){
    measurement_id = "UA-141188129-10";
  }
  else if(locale == "en-au"){
    measurement_id = "UA-141188129-7";
  }
  else if(locale == "en-nz"){
    measurement_id = "UA-141188129-12";
  }


  return (
    <div>
      <DefaultSeo {...config} />
      <NextHead>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1.0, user-scalable=no" />
        <link rel="manifest" href="/site.webmanifest" key="site-manifest" />
        <script async src={'https://www.googletagmanager.com/gtag/js?id='+global_measurement_id}></script>
        <script async src={'https://www.googletagmanager.com/gtag/js?id='+measurement_id}></script>
        <script defer src="../../assets/js/gtm_script.js" measurement-id-global={global_measurement_id}  measurement-id={measurement_id} />
      </NextHead>
    </div>
  )
}

export default Head
