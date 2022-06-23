import cn from 'classnames'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import s from './I18nWidget.module.css'
import { ChevronDown } from '@components/icons'
import ClickOutside from '@lib/click-outside'
import Cookies from 'js-cookie'
import { bc_data_cookies, cognito_client_id, cognito_urL, eu_bc_url, get_store_code, site_url, us_bc_url } from 'prismic-configuration'
import $ from 'jquery'

interface dataTypes {
  data_type: string,
  data_locale:string
}

const I18nWidget = (dataType: dataTypes) => {
  const data_locale = JSON.parse(dataType['data_locale']);
  const [display, setDisplay] = useState(false)
  const {
    locale,
    locales,
    defaultLocale = 'de-gb',
    asPath: currentPath,
  } = useRouter();

  
  

  const store_code = get_store_code(locale);
  if(locale != "de-de"){
    Cookies.set('current_locale', ""+locale, {expires : 2});
  }
  let login_url = cognito_urL+""+"login?response_type=token&client_id="+cognito_client_id+"&redirect_uri="+site_url+"en-gb/sso/&state="+locale+"_"+store_code+"_web";

  const cid = bc_data_cookies(store_code,locale);

  const checkAuth = () => {}
  
  useEffect(()=>{

    //When dark mode is on browser to chatbot issue fix start
    let themeInitCount = 1;
    const themeInit = setInterval(function(){
      const dataTheme = $('html').attr("data-theme");
      if(dataTheme == "dark"){
        $('html').removeAttr("style").removeAttr("data-theme");
        clearInterval(themeInit);
      }
      if(themeInitCount > 25){ clearInterval(themeInit); }
      themeInitCount++;
    });
    //When dark mode is on browser to chatbot issue fix end
    
    
    

    function reportDevice(){
      if(window.innerWidth >= 991){
        document.body.classList.add("desktop");
        document.body.classList.remove("mobile");
      } else{
        document.body.classList.remove("desktop");
        document.body.classList.add("mobile");
      }
    }
    reportDevice();
    window.addEventListener('resize', reportDevice)

    const change_country = document.querySelector(".li_ftr_Change_Country > a");
    change_country?.setAttribute("href", "javascript:void(0)")
    change_country?.setAttribute('onclick', "window.location.href='"+site_url+"my-region'");
    

    if(currentPath.match('/cart')){
      $("li[aria-label='Language selector']").attr("style","visibility:hidden;opacity:0;");
      $(".top-menu .nav__top-menu-item").hide();
    } else{
      $("li[aria-label='Language selector']").attr("style","visibility:visible;opacity:1;");
      $(".top-menu .nav__top-menu-item").show();
    }
    const order_confirmation = localStorage.getItem('order_confirmation');
    if(order_confirmation != null){
      document.cookie = 'basketeu=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'basketeudetails=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'basketus=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'basketusdetails=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      document.cookie = 'order_confirmation=;expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      Cookies.remove('basketeu');
      Cookies.remove('basketeudetails');
      Cookies.remove('basketus');
      Cookies.remove('basketusdetails');
      localStorage.removeItem('order_confirmation')
      const cart_count = document.querySelectorAll<HTMLElement>('.cart_count')
      if (cart_count) {
        for (let cch = 0; cch < cart_count.length; cch++) {
          const ele = cart_count[cch]
          ele.innerText = '0';
          var countIn = 1;
          var countInter = setInterval(function(){
            ele.setAttribute('style', 'display:none;')
            if(countIn >= 150){ clearInterval(countInter) }
            countIn++;
          },100);
        }
      }
    }
    //when order is order confirmation to remove vercel cart id end

    //not found cart id start
    const cart_cookies = Cookies.get('basket' + store_code)  
    if (typeof cart_cookies !== 'undefined') {
      const cart = JSON.parse(cart_cookies);
      const cart_id = cart['id'];
      const end_point = site_url+`api/zoleo/cart/getacart/${store_code}/${locale}/${cart_id}`;
      fetch(end_point).then((response) => response.json()).then((cart_res) => {
          if(cart_res.status || cart_res.status == 404){
            const cart_count = document.querySelectorAll<HTMLElement>('.cart_count')
            if (cart_count) {
              for (let cch = 0; cch < cart_count.length; cch++) {
                const ele = cart_count[cch]
                ele.innerText = '0' ;
                ele.setAttribute('style', 'display:none')
              }
            }
            Cookies.remove('basketeu');
            Cookies.remove('basketeudetails');
            Cookies.remove('basketus');
            Cookies.remove('basketusdetails');
            localStorage.removeItem('order_confirmation');
            const cart_empty = document.querySelector<HTMLElement>('.cart_empty')
            if(cart_empty) {
              cart_empty.style.display = 'block'
            }
            return false;
          }
      });
    }
    //not found cart id end


    setTimeout(() => {
      const global_container_id = "GTM-TSQR27P";
      let container_id = "";
      let google_ads_id = "";

      if(locale == "en-gb"){
        container_id = "GTM-WFC4VR7";
        google_ads_id = "AW-10839038984";
      }
      else if(locale == "en-no"){
        container_id = "GTM-PSG2XRW";
        google_ads_id = "AW-10839038984";
      }
      else if(locale == "en-se"){
        container_id = "GTM-M7LVLHC";
        google_ads_id = "AW-10839038984";
      }
      else if(locale == "en-fi"){
        container_id = "GTM-P4HHMWD";
        google_ads_id = "AW-10839038984";
      }
      else if(locale == "en-dk"){
        container_id = "GTM-N7C26NF";
        google_ads_id = "AW-10839038984";
      }
      else if(locale == "en-ca"){
        container_id = "GTM-P9KFXLR";
        google_ads_id = "AW-670233656";
      }
      else if(locale == "en-us"){
        container_id = "GTM-KR3LPQF";
        google_ads_id = "AW-670233656";
      }
      else if(locale == "en-au"){
        container_id = "GTM-MNPMH3M";
        google_ads_id = "AW-670233656";
      }
      else if(locale == "en-nz"){
        container_id = "GTM-PBLT7V8";
        google_ads_id = "AW-670233656";
      }


      //Google Tag Manager - Global all pages //Total - 2 GTM
      const gtm_script_global = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.id="gtm_head_global_script";j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${global_container_id}');`;
      $('#gtm_head_global, #gtm_iframe_global, #gtm_head_global_script').remove();
      var gtm_zoleo_global = document.createElement('script');
      gtm_zoleo_global.setAttribute("id", 'gtm_head_global');
      gtm_zoleo_global.setAttribute("zoleo-gmt-global", global_container_id);
      gtm_zoleo_global.type  = 'text/javascript';
      gtm_zoleo_global.text = gtm_script_global;
      document.head.appendChild(gtm_zoleo_global);
      //Google Tag Manager (noscript)
      var gtm_iframe_global = document.createElement("iframe");
      gtm_iframe_global.setAttribute("id", "gtm_iframe_global");
      gtm_iframe_global.setAttribute("src", "https://www.googletagmanager.com/ns.html?id="+global_container_id);
      gtm_iframe_global.setAttribute("style", "width: 100px;height: 100px;border: none;display: none;");
      document.body.prepend(gtm_iframe_global);


      //Google Tag Manager - Local wise
      const gtm_script = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.id='gtm_head_script';j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${container_id}');`;
      $('#gtm_head, #gtm_iframe, #gtm_head_script').remove();
      var gtm_zoleo = document.createElement('script');
      gtm_zoleo.setAttribute("id", 'gtm_head');
      gtm_zoleo.setAttribute("zoleo-gmt", container_id);
      gtm_zoleo.type  = 'text/javascript';
      gtm_zoleo.text = gtm_script;
      document.head.appendChild(gtm_zoleo);
      //Google Tag Manager (noscript)
      var gtm_iframe = document.createElement("iframe");
      gtm_iframe.setAttribute("id", "gtm_iframe");
      gtm_iframe.setAttribute("src", "https://www.googletagmanager.com/ns.html?id="+container_id);
      gtm_iframe.setAttribute("style", "width: 100px;height: 100px;border: none;display: none;");
      document.body.prepend(gtm_iframe);


      //Google Ads Tag
      const google_ads_script = `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${google_ads_id}');`;
      $('#google_ads_head, #google_ads_script_tag').remove();
      let google_ads_tag = document.createElement('script');
      google_ads_tag.setAttribute("id", 'google_ads_head');
      google_ads_tag.setAttribute("zoleo-ads", google_ads_id);
      google_ads_tag.type  = 'text/javascript';
      google_ads_tag.text = google_ads_script;
      document.head.appendChild(google_ads_tag);
      let google_ads_tag_script = document.createElement('script');
      google_ads_tag_script.setAttribute("id", 'google_ads_script_tag');
      google_ads_tag_script.setAttribute("zoleo-ads", google_ads_id);
      google_ads_tag_script.setAttribute("async", '');
      google_ads_tag_script.type  = 'text/javascript';
      google_ads_tag_script.src = "https://www.googletagmanager.com/gtag/js?id="+google_ads_id;
      document.head.appendChild(google_ads_tag_script);

      //Hotjar Tracking Code
      const hotjar_tracking_script = `(function(h,o,t,j,a,r){h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};h._hjSettings={hjid:1664945,hjsv:6};a=o.getElementsByTagName('head')[0];r=o.createElement('script');r.async=1;r.id="hotjar_tracking_tag_script";r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;a.appendChild(r);})(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');`;
      $('#hotjar_tracking_tag, #hotjar_tracking_script, #hotjar_tracking_tag_script').remove();
      let hotjar_tracking_tag = document.createElement('script');
      hotjar_tracking_tag.setAttribute("id", 'hotjar_tracking_tag');
      hotjar_tracking_tag.setAttribute("hotjar","Tracking");
      hotjar_tracking_tag.type  = 'text/javascript';
      hotjar_tracking_tag.text = hotjar_tracking_script;
      document.head.appendChild(hotjar_tracking_tag);


       //Meta Pixel Code for AU Only
      if(locale == "en-au"){
      const meta_pixel_script = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;t.id="meta_pixel_tag_script";s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '614443772835058');fbq('track', 'PageView')`;
      $('#meta_pixel_tag, #meta_pixel_img, #meta_pixel_tag_script').remove();
      let meta_pixel_tag = document.createElement('script');
      meta_pixel_tag.setAttribute("id", 'meta_pixel_tag');
      meta_pixel_tag.setAttribute("hotjar","Tracking");
      meta_pixel_tag.type  = 'text/javascript';
      meta_pixel_tag.text = meta_pixel_script;
      document.head.appendChild(meta_pixel_tag);
      document.head.append(`<noscript id="meta_pixel_img"><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=614443772835058&ev=PageView&noscript=1" /></noscript>`);
      }
      //Meta Pixel Code for NZ Only
      else if(locale == "en-nz"){
      const meta_pixel_script = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;t.id="meta_pixel_tag_script";s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '614443772835058');fbq('track', 'PageView')`;
      $('#meta_pixel_tag, #meta_pixel_img, #meta_pixel_tag_script').remove();
      let meta_pixel_tag = document.createElement('script');
      meta_pixel_tag.setAttribute("id", 'meta_pixel_tag');
      meta_pixel_tag.setAttribute("hotjar","Tracking");
      meta_pixel_tag.type  = 'text/javascript';
      meta_pixel_tag.text = meta_pixel_script;
      document.head.appendChild(meta_pixel_tag);
      document.head.append(`<noscript id="meta_pixel_img"><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=614443772835058&ev=PageView&noscript=1" /></noscript>`);
      }
      //Meta Pixel Code for Global except AU and NZ
      else {
      const meta_pixel_script = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;t.id="meta_pixel_tag_script";s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init', '993477857951910');fbq('track', 'PageView')`;
      $('#meta_pixel_tag, #meta_pixel_img, #meta_pixel_tag_script').remove();
      let meta_pixel_tag = document.createElement('script');
      meta_pixel_tag.setAttribute("id", 'meta_pixel_tag');
      meta_pixel_tag.setAttribute("hotjar","Tracking");
      meta_pixel_tag.type  = 'text/javascript';
      meta_pixel_tag.text = meta_pixel_script;
      document.head.appendChild(meta_pixel_tag);
      document.head.append(`<noscript id="meta_pixel_img"><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=993477857951910&ev=PageView&noscript=1" /></noscript>`);
      }
      $(".y-rich-snippet-script").remove();

    }, 4000);

  
    
    var item_count = 0;
    const cart_count = document.querySelectorAll<HTMLElement>('.cart_count');
    if(cart_count){
      const cart_cookies = Cookies.get('basket' + store_code);
      if (typeof cart_cookies !== 'undefined') {
        const itemsCount = JSON.parse(cart_cookies);
        item_count = itemsCount.item_count;
        for (let cch = 0; cch < cart_count.length; cch++) {
          const ele = cart_count[cch];
          ele.innerText = ""+itemsCount.item_count;;
          ele.setAttribute('style','display:block');
        }
      }else{
        for (let cch = 0; cch < cart_count.length; cch++) {
          const ele = cart_count[cch];
          ele.setAttribute('style','display:none');
        }
      }
    }
    
    const li_head_account = document.querySelector<HTMLElement>('body .li_head_account > a');
    const li_head_account_txt = document.querySelector<HTMLElement>('body .li_head_account > a .user-account');
    const li_mh_My_Account = document.querySelector<HTMLElement>('body .li_mh_My_Account > a');
    const li_ftr_myZOLEO_Account = document.querySelector<HTMLElement>('body .li_ftr_myZOLEO_Account > a');
    const extra_link = document.querySelector<HTMLElement>('body .extra_link > a');
    const li_head_logout = document.querySelector<HTMLElement>('body .li_head_logout');
    const li_ftr_My_Account = document.querySelector<HTMLElement>('body .li_ftr_My_Account > a');
    const li_ftr_My_Orders = document.querySelector<HTMLElement>('body .li_ftr_My_Orders > a');
    const my_acc_link = document.querySelector<HTMLElement>('body .top-bar .my_acc_link');

    const sign_in_link = document.querySelector<HTMLElement>('body .sign_in_link');
    if(sign_in_link){
      if(sign_in_link.innerText != ""){
          login_url = sign_in_link.innerText;
      }      
    }


    //check customer login
    if(cid > 0){  

        if(extra_link){
          const cogAccess = Cookies.get("cogAccess");
          if(cogAccess){
            const href = extra_link.getAttribute('data-href');
            extra_link.setAttribute('href',href+cogAccess);
          }
        }

        if(li_head_account){
          li_head_account.setAttribute('href', '#');
          li_head_account.setAttribute('class', 'icon login_user');
        }
        if(li_head_account_txt){
          const data_text = $(li_head_account_txt).attr("data-text");
          $(li_head_account_txt).text(data_text+" ");
        }
        if(my_acc_link){
          if(store_code == 'eu'){
            my_acc_link.setAttribute('href', eu_bc_url+`account.php?action=order_status&locale=${locale}&sc=${store_code}`);
          } else{
            my_acc_link.setAttribute('href', us_bc_url+`account.php?action=order_status&locale=${locale}&sc=${store_code}`);
          }
        }
        if(li_mh_My_Account){
          if(store_code == 'eu'){
            li_mh_My_Account.setAttribute('href', eu_bc_url+`account.php?action=order_status&locale=${locale}&sc=${store_code}`);
          } else{
            li_mh_My_Account.setAttribute('href', us_bc_url+`account.php?action=order_status&locale=${locale}&sc=${store_code}`);
          }
        }
        if(li_ftr_My_Account){
          if(store_code == 'eu'){
            li_ftr_My_Account.setAttribute('href', eu_bc_url+`account.php?action=order_status&locale=${locale}&sc=${store_code}`);
          } else{
            li_ftr_My_Account.setAttribute('href', us_bc_url+`account.php?action=order_status&locale=${locale}&sc=${store_code}`);
          }
        }
        if(li_ftr_myZOLEO_Account){
          const cogAccess = Cookies.get("cogAccess");
          if(cogAccess){
            if(extra_link){
              const href = extra_link.getAttribute('data-href');
              li_ftr_myZOLEO_Account.setAttribute('href',href+cogAccess);
            }
          }
        }
        if(li_ftr_My_Orders){
          if(store_code == 'eu'){
            li_ftr_My_Orders.setAttribute('href', eu_bc_url+`account.php?action=order_status&locale=${locale}&sc=${store_code}`);
          } else{
            li_ftr_My_Orders.setAttribute('href', us_bc_url+`account.php?action=order_status&locale=${locale}&sc=${store_code}`);
          }
        }
        if(li_head_logout){
          if(li_head_logout){ li_head_logout.setAttribute('style', 'display:block;'); }
        }
    }else{
      if(li_head_account){ li_head_account.setAttribute('href', login_url); }
      if(li_mh_My_Account){ li_mh_My_Account.setAttribute('href', login_url); }
      if(li_ftr_My_Account){ li_ftr_My_Account.setAttribute('href', login_url); }
      if(li_ftr_My_Account){ li_ftr_My_Account.setAttribute('onclick', "window.location.href='"+login_url+"'"); }
      if(li_ftr_myZOLEO_Account){
        if(store_code == 'eu'){
          li_ftr_myZOLEO_Account.setAttribute('href', login_url);
        } else{
          li_ftr_myZOLEO_Account.setAttribute('href', login_url);
        }
      }
      if(li_ftr_My_Orders){
        if(store_code == 'eu'){
          li_ftr_My_Orders.setAttribute('href', login_url);
        } else{
          li_ftr_My_Orders.setAttribute('href', login_url);
        }
      }
    }


  })


  const options = locales?.filter((val) => val !== locale)
  
  if (dataType['data_type'] == 'mobile') {
    return (
      data_locale.map((list:any, i:number)=>(
        list.locale == locale ?
          (<li key={i} className="nav__top-menu-item mobile-display-only">
            <a href={site_url+'my-region'} onClick={() => setDisplay(false)}>
            Change your Region <br/> 
              <img width="22" height="22" src={list.flag_path} alt={list.title} />&nbsp;
              <span id="countryx">{list.title}</span>
            </a>
          </li>) : ""
      )) 
    )
  } 
  else if (dataType['data_type'] == 'li_list') {
    return (
      data_locale.map((list:any, i:number)=>(
        list.locale == locale ? 
          (<ClickOutside key={i} active={display} onClick={() => setDisplay(false)}>
            <li key={i} className={s.nvabar_lang_drp} aria-label="Language selector" onClick={() => setDisplay(!display)}>
              <img width="20" height="20" src={list.flag_path+"&w=50&q=20"} alt={list.title} />
              {options && (
                <span className="cursor-pointer">
                  <ChevronDown className={cn(s.icon, { [s.active]: display })} />
                </span>
              )}
              {options?.length && display ? (
                <span onClick={() => setDisplay(false)} aria-label="Close panel">
                  <ul className={s.local_list}>
                      {data_locale.map((lists:any, ii:number)=>(
                        lists.locale != locale ? 
                          (<li key={lists.locale} onClick={checkAuth}>
                            <Link href={currentPath} locale={lists.locale}><a className={cn(s.item)} onClick={() => setDisplay(false)} >{lists.title}</a></Link>
                          </li>)
                        :""
                      ))}
                  </ul>
                </span>
              ) : null}
            </li>
        </ClickOutside>): ""
      ))
    )
  } else {
    return <h1>No</h1>
  }
}

export default I18nWidget
