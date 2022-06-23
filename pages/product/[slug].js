import { linkResolver, get_store_code, prismic_fetch_query, bc_data_cookies, site_url } from "prismic-configuration"
import { Layout } from '@components/common'
import fetch from "node-fetch";
import s from './product.module.css'
import Image from 'next/image'
import { NextSeo } from 'next-seo'
import { RichText } from 'prismic-reactjs'
import { Button, useUI } from '@components/ui'
import { useEffect, useState } from 'react'
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Head from 'next/head'
import { ProductSlider } from '@components/product'
import Link from "@components/ui/Link";
import React from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Parser from 'html-react-parser';
import $ from 'jquery'
import Script from "next/script";


export default function Product({productContent, product, currencies, product_yotpo}) {

  const [loading, setLoading] = useState(false);
  const locale = useRouter().locale;
  const store_code = get_store_code(locale);
  const { openSidebar } = useUI()
  const pId = product.entityId;
  var cid = 0;
  
  const is_cat_accessories = product.categories?.edges?.map(({ node: { name } }) => name).includes('Accessories')
  let data_layer_category = "Device";
  if(is_cat_accessories == true){ data_layer_category = "Accessories"; }
  

  let average_score = 0;
  let total_reviews = 0;
  if(product_yotpo.status.code == 200){
    const ele = product_yotpo.response.bottomline;
    average_score = ele.average_score;
    total_reviews = ele.total_reviews;
  }
  let ItemAvailability = "https://schema.org/OutOfStock";
  if(product.inventory.isInStock){
    ItemAvailability = "https://schema.org/InStock";
  }

  const relatedProducts_length = product.relatedProducts.edges.length;
  let is_show_count = 3;
  let is_show_mcount = 2;
  if(relatedProducts_length == 2){
    is_show_count = 2;
  }
  if(relatedProducts_length == 1){
    is_show_count = 1;
    is_show_mcount = 1;
  }
  var settings_rp = {
    dots: false,
    centerMode: false,
    slidesToShow: is_show_count,
    slidesToScroll: 1,
    arrows: true,
    autoplay: false,
    autoplaySpeed: 10000,
    responsive: [
      {
        breakpoint: 767,
        settings: {
          slidesToShow: is_show_mcount,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
  ]
  }

  const prices = product.prices;
  let basePrice = 0;
  if(prices.basePrice){
    basePrice = prices.basePrice.value.toFixed(2);
  }
  let salePrice = 0;
  if(prices.salePrice != null){
    salePrice = prices.salePrice.value.toFixed(2);
  }
  
  const customFields = product.customFields;
  let product_badge = "On Sale Now!";
  if(customFields){
    for (let cf = 0; cf < customFields.edges.length; cf++) {
      const cf_ele = customFields.edges[cf].node;
      if(cf_ele.name == "sale_badge_label"){ product_badge = cf_ele.value; }
    }
  }
  
  var social_url = "";
  useEffect(()=>{

    setTimeout(() => {
      $(".keen-slider .thumbs").each(function(){
        const src = $(this).find('img').attr('src');
        $(this).find("img").attr('src',src.replace('/80w/','/600w/')).attr('width','600').attr('height','500')
      })
    }, 2000);

    /* toggle */
    $(".additional_tabs .acc_head").off().on('click', function(){
      $(this).toggleClass('active').next('.acc_content').slideToggle(300);
      $(this).siblings().removeClass('active').next('.acc_content').slideUp(300);
    });
    $('.additional_tabs .tabs_title a').off().on('click', function() {  
        $('html, body').animate({scrollTop: $(this.hash).offset().top - 150}, 700);
        $(this).parent().addClass('active').siblings().removeClass('active');
        return false;
    });

    //yotpo start
    if(window.yotpo){
      window.yotpo.initialized = false;
      window.yotpo.clean();
      for (let i = 0, len = window.yotpo.widgets.length; i < len; i++) {
        window.yotpo.widgets[i].settings.pid = product.entityId;
        window.yotpo.widgets[i].settings.main_widget_pid = product.entityId;
      }
      setTimeout(() => {
        window.yotpo.initWidgets()
      }, 500);
      
    }
    //yotpo end


    //social_url start
    const curl = new URL(window.location.href);
    social_url = decodeURIComponent(curl.href);
    $(".facebook_link").attr('href', 'https://facebook.com/sharer/sharer.php?u='+social_url);
    $(".mail_link").attr('href', "mailto:?subject="+product.name+"&body="+social_url);
    $(".twitter_link").attr('href', "https://twitter.com/intent/tweet/?text="+product.name+"&url="+social_url);
    $(".print_link").attr('href', "https://pinterest.com/pin/create/button/?url="+social_url+"&description="+product.plainTextDescription);
    //social_url end

  })


  const quantity_id  = function(e){
    e.stopPropagation();
    //if(e.detail == 1){ }

    const txt_qty = document.querySelector('.txt_qty');
    const action = e.target.getAttribute('action');
    if(action == "i"){
      if(txt_qty){
        txt_qty.value = parseInt(txt_qty.value) + parseInt(1);
      }
    } else {
      if(txt_qty && txt_qty.value > 1){
        txt_qty.value = parseInt(txt_qty.value) - parseInt(1);
      }
      if(txt_qty.value < 0){
        txt_qty.value = parseInt(1);
      }
    }

  }

  
  const addToCart = function(e){

    //check customer login
    const cid = bc_data_cookies(store_code,locale);

    e.target.disabled = true;
    setLoading(true)
    const cart_cookies = Cookies.get('basket'+store_code);
    const txt_qtys = document.querySelector('.txt_qty');
    const txt_qty = txt_qtys.value;
    txt_qtys.setAttribute('value', parseInt(1));

    const current_currency = currencies.currency_code;

    const dataLayer_price = product.prices.salePrice == null ? product.prices.basePrice.value.toFixed(2) : product.prices.salePrice.value.toFixed(2);
    dataLayer = [];
    dataLayer.push({ ecommerce: null });
    dataLayer.push({
      event: "add_to_cart",
      ecommerce: {
        items: [
          {
            item_id: ""+product.sku,
            item_name: ""+product.name,
            affiliation: "Zoleo",
            currency: ""+current_currency,
            index: 0,
            item_brand: "Zoleo",
            item_category: ""+data_layer_category,
            price: dataLayer_price,
            quantity: txt_qty
          }
        ]
      }
    });
    console.log('dataLayer add_to_cart')
    console.log(dataLayer)

    const cart_details = Cookies.get('basket'+store_code+'details');
    var re_create_url = "";
    if(typeof(cart_details) !== "undefined"){
      
      const cart_d_obj = JSON.parse(cart_details);
      const cart_currency = cart_d_obj.currency_code
      if(current_currency != cart_currency){
        re_create_url = site_url+`api/zoleo/cart/createacart/${store_code}/${locale}/${pId}/${txt_qty}/${cid}/${cart_d_obj.card_id}/${current_currency}/re_create`;
      }
    }

    if(typeof(cart_cookies) === "undefined"){

      Cookies.remove("is_draft_order");
      
      //Add new (Create a Cart)      
      const createa_cart = site_url+`api/zoleo/cart/createacart/${store_code}/${locale}/${pId}/${txt_qty}/${cid}/0/ccode/new`;
      
      fetch(createa_cart)
      .then((response) => response.json())
      .then((cart_res) => { 

        const items_count = cart_res.cart.data.line_items.physical_items.length;
        const cart_id = cart_res.cart.data.id;
        
        const basket = {"l": locale,"id": cart_id, 'item_count':items_count};
        Cookies.set('basket'+store_code, JSON.stringify(basket), { expires : 2 });

        //Check Locale and re create cart start
        const currency_code = cart_res.cart.data.currency.code;
        const basket_details = { 
          "l": locale,
          "currency_code":currency_code,
          "store_code":store_code,
          "card_id":cart_id
        };
        Cookies.set('basket'+store_code+'details', JSON.stringify(basket_details), { expires : 2 });
        //Check Locale and re create cart end

        openSidebar(cart_res);
        setLoading(false);
        e.target.disabled = false;
      });
    }else{
      //existing cart update (Add Cart Line Items)
      const exi_cart_ck = JSON.parse(cart_cookies);
      const cart_id = exi_cart_ck['id'];

      var exits_cart = site_url+`api/zoleo/cart/addcartlineitem/${store_code}/${locale}/${pId}/${txt_qty}/${cid}/${cart_id}`;
      
      if(re_create_url != ""){
        exits_cart = re_create_url;
      }


      
      fetch(exits_cart)
      .then((response) => response.json())
      .then((cart_res) => {
        if(cart_res.cart.data){
          const items_count = cart_res.cart.data.line_items.physical_items.length;
          const cart_id = cart_res.cart.data.id;
          const basket = {"l": locale,"id": cart_id, 'item_count':items_count};
          Cookies.set('basket'+store_code, JSON.stringify(basket), { expires : 2 });
        }
        openSidebar();
        setLoading(false);
        e.target.disabled = false;
      });
    }    
  }

  return (
    <>
      <div className={s.productView+" productView"} key="pdata">

        <Head>
            <title>{productContent.data.meta_title}</title>
            
            <meta name='title' content={productContent.data.meta_title} key="title" />
            <meta property='og:title' content={productContent.data.meta_title} key="og:title" />
            <script defer async src="//staticw2.yotpo.com/6ApQc0m9rPp8mtlb7zxrU5SGPUcPxVFMexB9wkVP/widget.js"></script>
        </Head>
        <div className={s.prod_view_mn}>
          <div className="container">

            <h1 className={s.productView_title}>{product.name}</h1>            
            <div className={s.yotpo_below_title+" "+s.yotpo+" yotpo bottomLine"} data-yotpo-product-id={product.entityId}>&nbsp;</div>

            <div className={s.productView_images}>
              <div className={s.productView_image+" product_thubm"}>

                <ProductSlider key={productContent.data.id}>
                  {product.images.edges.map((image, i) => (
                    <div key={i}>
                        <Image src={image.node.url600wide} alt={image.node.altText || 'Product Image'} width={600} height={600} priority={i === 0} quality="85" />
                    </div>
                  ))}
                </ProductSlider>
              </div>
            </div>
            
            <div className={s.productView_details}>
              <div className={s.productView_product}>
                <div className={s.price_section}>

                  {salePrice != "0" ? <span className={s.sale_label}>{product_badge}</span> : ""}

                  <span className={salePrice != "0" ? s.old_price : s.p_price}>
                    {currencies.token}{basePrice}
                    <sup className={s.currency_code}>{currencies.currency_code}</sup>
                  </span>

                  {salePrice != "0" ?<span className={s.p_price+' '+s.regular_price}>
                    {currencies.token}{salePrice}
                    <sup className={s.currency_code}>{currencies.currency_code}</sup></span> : ""}

                  {productContent.data.vat_label != "" ? <p className={s.include_tax}>{productContent.data.vat_label}</p> : ""}
                </div> 
                {product.availabilityV2.status == "Unavailable" ? <div className={s.wtb_btn}><Link href={'/'+locale+'/'+productContent.data.buy_button.uid}><a className={'btn_red btn'}>{productContent.data.buy_button_title}</a></Link></div> :
                 product.inventory.isInStock == true ? 
                  <div key={product.inventory.isInStock} className={s.buy_btn_section}>
                      <div className={s.Quantity_item_actions}>
                          <label key="lbl_qty" className={s.Quantity_action_qty}>
                            <input disabled key="txt_qty" type="text" className="txt_qty" value="1" readOnly />
                          </label>
                          <button key="btn_d" className={s.Quantity_action_button+ " quantity_di"} action="d" onClick={quantity_id}>
                            <svg action="d" width="18" height="18" viewBox="0 0 24 24" fill="none"><path action="d" d="M5 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                          </button>
                          <button key="btn_i" className={s.Quantity_action_button+ " quantity_di"} action="i" onClick={quantity_id}>
                            <svg action="i" width="18" height="18" viewBox="0 0 24 24" fill="none"><path action="i" d="M12 5V19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path><path action="i" d="M5 12H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                          </button>
                      </div>
                      <Button
                        aria-label={productContent.data.add_to_cart_button}
                        type="button"
                        className={"btn green_btn "+s.add_cart}
                        onClick={addToCart}
                        loading={loading}
                      >{productContent.data.add_to_cart_button}</Button>
                  </div>
                  : <p style={{color:"#F1513E"}}>Out of stock.</p>
              }

                <span className={s.prod_sku}><strong>SKU: </strong>{product.sku}</span>
                

                <div className={s.productView_description}>
                  <div className={s.contents}>
                    {Parser(product.description)}
                  </div>
                  
                  { productContent.data.availability_text != null ? <span className={s.availability}><strong>Availability:</strong><br/>{productContent.data.availability_text}</span> : ""}

                  
                  <ul className={s.social_share}>
                    <li><a href="" className="facebook_link" target="_blank" title="facebook" rel="noopener noreferrer follow"><i className="icon-facebook" /></a></li>
                    <li><a href="" className="mail_link" target="_blank" rel="noopener noreferrer follow"><svg height="30px" viewBox="0 0 60 60" width="30px"><g><g fill="#000000" transform="translate(11.000000, 10.000000)"><path d="M19,15.4615385 L36.3076923,0.461538462 L1.69230769,0.461538462 L19,15.4615385 Z M14.3251765,13.8010536 L19,17.6382399 L23.6015813,13.8010536 L36.3076923,24.6923077 L1.69230769,24.6923077 L14.3251765,13.8010536 Z M0.538461538,23.5384615 L0.538461538,1.61538462 L13.2307692,12.5769231 L0.538461538,23.5384615 Z M37.4615385,23.5384615 L37.4615385,1.61538462 L24.7692308,12.5769231 L37.4615385,23.5384615 Z"/></g></g></svg></a></li>
                    <li><a href="" className="twitter_link" target="_blank" rel="noopener noreferrer follow"><i className="icon-twitter" /></a></li>
                    <li><a href="" className="print_link" target="_blank" rel="noopener noreferrer follow"><svg height="20px" width="20px" viewBox="0 0 512 512"><path d="M255.998,0.001c-141.384,0 -255.998,114.617 -255.998,255.998c0,108.456 67.475,201.171 162.707,238.471c-2.24,-20.255 -4.261,-51.405 0.889,-73.518c4.65,-19.978 30.018,-127.248 30.018,-127.248c0,0 -7.659,-15.334 -7.659,-38.008c0,-35.596 20.632,-62.171 46.323,-62.171c21.839,0 32.391,16.399 32.391,36.061c0,21.966 -13.984,54.803 -21.203,85.235c-6.03,25.482 12.779,46.261 37.909,46.261c45.503,0 80.477,-47.976 80.477,-117.229c0,-61.293 -44.045,-104.149 -106.932,-104.149c-72.841,0 -115.597,54.634 -115.597,111.095c0,22.004 8.475,45.596 19.052,58.421c2.09,2.535 2.398,4.758 1.776,7.343c-1.945,8.087 -6.262,25.474 -7.111,29.032c-1.117,4.686 -3.711,5.681 -8.561,3.424c-31.974,-14.884 -51.963,-61.627 -51.963,-99.174c0,-80.755 58.672,-154.915 169.148,-154.915c88.806,0 157.821,63.279 157.821,147.85c0,88.229 -55.629,159.232 -132.842,159.232c-25.94,0 -50.328,-13.476 -58.674,-29.394c0,0 -12.838,48.878 -15.95,60.856c-5.782,22.237 -21.382,50.109 -31.818,67.11c23.955,7.417 49.409,11.416 75.797,11.416c141.389,0 256.003,-114.612 256.003,-256.001c0,-141.381 -114.614,-255.998 -256.003,-255.998Z"/></svg></a></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>


        
        { productContent.data.is_additional == true ? 
        <div className={s.productView_Additionals} style={{ backgroundImage : `url(${productContent.data.section_back_image.url+"&q=100&w=540"})` }}>
          {
            productContent.data.body.map((body, ch) => (
              <span key={ch}>
              { ch === 0 ? (<div key={ch} className={s.title}>{body.slice_type == 'product_description_title' ? (<h2 className={s.text_center}>{body.primary.head_title}</h2>) : ('')}</div>) :"" }
              </span>
            ))

          }

          <div className="container">
            {productContent.data.body.map((body, bi) => (
              <span key={bi} className={s.pro_desc}>

              {bi !== 0 ? (<>{body.slice_type == 'product_description_title' ? (
                  <h2 className={s.text_center}>{body.primary.head_title}</h2>
                ) : ('')}</>) : ""}

              

                {body.slice_type == 'product_description_content' ? (
                  <>
                    {body.items.map((pdata, biii) => (
                      <div key={biii} className={s.specs_mn}>
                        <div className={s.specs_list}>
                          <div className={s.specs_left}>
                            <span>{pdata.content_title}</span>
                            { JSON.stringify(pdata.product_images) !== "{}" ? <img src={pdata.product_images.url + '&w=300&q=80'} alt={pdata.product_images.alt} loading="lazy" width="auto" /> : "" }

                            <div className={s.specs_right + ' ' + s.contents + ' ' +s.specs_left_content}> 
                              <RichText render={pdata.content_left_desc} serializeHyperlink={linkResolver} />
                            </div>

                            
                          </div>
                          <div className={s.specs_right + ' ' + s.contents}>
                            <RichText render={pdata.content_desc} serializeHyperlink={linkResolver} />
                          </div>
                        </div>
                        <hr className={s.specs_hr} />
                      </div>
                    ))}
                  </>
                ) : (
                  ''
                )}
              </span>
            ))}

            <div></div>
          </div>
        </div>
        : '' }

      { productContent.data.is_tab == true ? 
        <div className={"additional_tabs "+ s.additional_tabs}>
          <div className={"tabs_title desktop_only "+ s.tabs_title}>
            <div className="container">
              <ul>
              {productContent.data.product_tabs.map((item, i) => (
                <li key={i}><a href={'#'+i}>{item.tab_item}</a></li>
              ))}
              </ul>
            </div>
          </div>
          <div className={"mobile_only acc_head "+s.acc_head} > 
            {productContent.data.product_tabs[0].tab_item}
            <span className={"toggle_icons "+s.toggle_icons}></span>
          </div>
          <div id="0" className={s.zoleo_work +" zoleo_work acc_content "+ s.acc_content}>
            <div className={s.title +" container"}>
              <h2>{productContent.data.tab1_title}</h2>
              <strong>{productContent.data.tab1_desc}</strong>
            </div>
            <div className={s.coverage+' coverage'}>
              <div className={s.zoleo_msg+' zoleo_msg '+ s.light+' '+s.full_bg} style={{backgroundImage: 'url('+productContent.data.tab1_left_bg_image.url+'&q=100&w=540)'}}>
                <div className={s.content}>
                  <i className={productContent.data.tab1_left_icon}></i>
                  <RichText render={productContent.data.tab1_left_desc} serializeHyperlink={linkResolver} />
                </div>
              </div>
              <div className={s.zoleo_device+' zoleo_device '+s.full_bg+' '+s.light} style={{backgroundImage: 'url('+productContent.data.tab1_right_bg_image.url+'&q=100&w=540)'}}>
                <div className={s.content}>
                  <i className={productContent.data.tab1_right_icon}></i>
                  <RichText render={productContent.data.tab1_right_desc} serializeHyperlink={linkResolver} />
                </div>
              </div>
            </div>
          </div>
          <div className={"mobile_only acc_head "+s.acc_head} > 
            {productContent.data.product_tabs[1].tab_item}
            <span className={"toggle_icons "+s.toggle_icons}></span>
          </div>
          <div id="1" className={s.mobile_app+ ' mobile_app acc_content ' +s.acc_content}>
            <div className={s.title+" container"}>
              <h2>{productContent.data.tab2_title}</h2>
            </div>
            <div className={"container "+s.apps} >
              {productContent.data.tab2_apps.map((item, i) => (
                <div className={s.items} key={i}>
                  <img src={item.image.url} alt={item.image.alt} loading="lazy" width="auto" />
                  <p>{item.app_title}</p>
                </div>
              ))}
            </div>
            <div className={"container "+s.app_bottom}>
              <RichText render={productContent.data.tab2_desc} serializeHyperlink={linkResolver} />
              <div className={s.store}>
                <a href={productContent.data.apple_link.url} className={s.apple}>
                  <img src={productContent.data.apple_store_image.url} alt={productContent.data.apple_store_image.alt} loading="lazy" width="auto" />
                </a>
                <a href={productContent.data.google_link.url} className={s.google}>
                  <img src={productContent.data.google_store_image.url} alt={productContent.data.google_store_image.alt} loading="lazy" width="auto" />
                </a>
              </div>
              <RichText render={productContent.data.tab2_note} serializeHyperlink={linkResolver} />
            </div>
          </div>
          <div className={"mobile_only acc_head "+s.acc_head} > 
            {productContent.data.product_tabs[2].tab_item}
            <span className={"toggle_icons "+s.toggle_icons}></span>
          </div>
          <div id="2" className={s.features +" features acc_content "+s.acc_content}>
            <div className="container">
              <div className={s.inner_section}>
                <h2>{productContent.data.tab3_title}</h2>
                <RichText render={productContent.data.tab3_desc} serializeHyperlink={linkResolver} />
                <h3>{productContent.data.tab3_subtitle}</h3>
                <a href={productContent.data.tab3_link.url}>{productContent.data.tab3_link_title}</a>
              </div>
            </div>
          </div>
          <div className={"mobile_only acc_head "+s.acc_head} > 
            {productContent.data.product_tabs[3].tab_item}
            <span className={"toggle_icons "+s.toggle_icons}></span>
          </div>
          <div id="3" className={s.share_location+' share_location '+s.full_bg+' '+s.light+' acc_content '+s.acc_content} style={{backgroundImage: 'url('+productContent.data.tab4_bg_image.url+'&w=500)'}}>
            <div className={'container '+ s.location+' two_col_left_text '+s.two_col_left_text+' '+s.mobile_swap}>
              <div className={s.left_content}>
                <h2 className="desktop_only">{productContent.data.tab4_title}</h2>
                <RichText render={productContent.data.tab4_desc} serializeHyperlink={linkResolver} />
              </div>
              <div className={s.right_img}>
                <h2 className="mobile_only">{productContent.data.tab4_title}</h2>
                <img src={productContent.data.tab4_image.url} alt={productContent.data.tab4_image.alt} />
              </div>
            </div>
          </div>
          <div className={"mobile_only acc_head "+s.acc_head} > 
            {productContent.data.product_tabs[4].tab_item}
            <span className={"toggle_icons "+s.toggle_icons}></span>
          </div>
          <div id="4" className={s.sos_help +" sos_help acc_content "+s.acc_content}>
            <div className={"container "+s.two_col+' '+s.mobile_swap}>
              <div className={s.left_content}>
                <h2 className="desktop_only">{productContent.data.tab5_title}</h2>
                <RichText render={productContent.data.tab5_desc} serializeHyperlink={linkResolver} />
              </div>
              <div className={s.right_img}>
                <h2 className="mobile_only">{productContent.data.tab5_title}</h2>
                <img src={productContent.data.tab5_image.url} alt={productContent.data.tab5_image.alt} loading="lazy" width="auto" />
              </div>
            </div>
          </div>
          <div className={"mobile_only acc_head "+s.acc_head} > 
            {productContent.data.product_tabs[5].tab_item}
            <span className={"toggle_icons "+s.toggle_icons}></span>
          </div>
          <div id="5" className={s.what_in_box+' acc_content '+s.acc_content}>
            <div className={'container '+s.title}>
              <h2>{productContent.data.tab6_title}</h2>
            </div>
            <div className={"container "+s.two_col}>
              <div className={s.left_img}>
                <iframe width="560" height="315" src={productContent.data.tab6_iframe} 
                  title="YouTube video player" 
                  frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen="1" loading="lazy"></iframe>
              </div>
              <div className={s.right_content}>
                <RichText render={productContent.data.tab6_desc} serializeHyperlink={linkResolver} />
              </div>
            </div>
          </div>

        </div> : ""}

      </div>


      { product.relatedProducts.edges.length > 0 ? 

      <div className={s.related_products +" related_products"}>
          <div className="container">
            <div className={s.title}>
            <h2>Related Products</h2></div>
            <div className={"prod_slider"}>
                <Slider {...settings_rp} className={"slider_related " + s.slider_related}>      
                {product.relatedProducts.edges.map( (rpdata, i) => (
                  <li key={i}>
                    <Link href={`/product${rpdata.node.path}`} className={s.prod_img} title={rpdata.node.name}>
                      {rpdata.node.images.edges.map( (img, i) => (
                        img.node.isDefault == true ? <Image key={i} src={img.node.url} alt={rpdata.node.name || 'Product Image'} width={600} height={600} priority={i === 0} quality="85" />:""
                      ))}
                    </Link>      
                    <h4><Link href={`/product${rpdata.node.path}`}>{rpdata.node.name}</Link></h4>
                    <div className={s.related_price}  > 
                      {rpdata.node.prices.salePrice != null ?<span className={s.sale_price}>{currencies.token}{rpdata.node.prices.salePrice.value.toFixed(2)}</span> : ""}           
                      <span className={rpdata.node.prices.salePrice != null ?  s.regular_price : ""}> {currencies.token}{rpdata.node.prices.basePrice.value.toFixed(2)}</span>
                    </div>
                  </li>
                  ))
                }
                </Slider>
            </div>
          </div>
        </div>
        : "" }

      <div id="section_yotpo" className="section_yotpo">
        <div className="container">
            <div className="yotpo yotpo-main-widget" data-product-id={product.entityId} data-product-sku={product.sku} data-price={ salePrice == '0' ? basePrice : salePrice } 
            data-currency={currencies.currency_code} data-name={product.name} data-url={product.path} data-image-url={product.defaultImage.url80wide} data-description={ product.plainTextDescription }></div> 
        </div>
      </div>

      
      <div className="product_schema" itemScope itemType="http://schema.org/Product" style={{display:'none'}}>
        <span itemProp="name">{product.name}</span>
        <img itemProp="image" src={product.defaultImage.url80wide} alt={product.name} />
        <span itemProp="description">{product.plainTextDescription}</span>
        <span itemProp="sku">{product.sku}</span>
        <span itemProp="mpn">{product.entityId}</span>

        <span itemProp="brand" itemScope itemType="http://schema.org/Brand">
          <span itemProp="name" content="Zoleo">Zoleo</span>
        </span>

        {
          average_score != 0 ? (
            <span itemProp="review" itemScope itemType="http://schema.org/Review">
            <span itemProp="reviewRating" itemScope itemType="http://schema.org/Rating">
              <span itemProp="ratingValue">{average_score}</span>
              <span itemProp="bestRating">{average_score}</span>
            </span>
            <span itemProp="author" itemScope itemType="http://schema.org/Person">
              <span itemProp="name">Zoleo</span>
            </span>
          </span>
          )
        :""}

        {
          average_score != 0 ? (
            <span itemProp="aggregateRating" itemScope itemType="http://schema.org/AggregateRating">
            <span itemProp="ratingValue">{average_score}</span>
            stars, based on <span itemProp="reviewCount">{total_reviews}</span>reviews
          </span>
          )
        :""}

        <span itemProp="offers" itemScope itemType="http://schema.org/Offer">
          <span itemProp="url">{site_url+locale+"/product"+product.path}</span> 
          <meta itemProp="priceCurrency" content={currencies.currency_code}/>
          <span itemProp="price" content={product.prices.salePrice == null ? product.prices.basePrice.value.toFixed(2) : product.prices.salePrice.value.toFixed(2)}>{product.prices.salePrice == null ? product.prices.basePrice.value.toFixed(2) : product.prices.salePrice.value.toFixed(2)}</span>
          <meta itemProp="itemCondition" content="https://schema.org/NewCondition"/>
          <meta itemProp="availability" content={ItemAvailability} />
        </span>
      </div>

      <Script id="pdp_dataLayer" strategy="afterInteractive">
          {`
            dataLayer.push({ ecommerce: null });
            dataLayer.push({
              event: "view_item",
              ecommerce: {
                items: [
                  {
                    item_id: "${product.sku}",
                    item_name: "${product.name}",
                    affiliation: "Zoleo",
                    currency: "${currencies.currency_code}",
                    index: 0,
                    item_brand: "Zoleo",
                    item_category: "${data_layer_category}",
                    location_id: "L_12345",
                    price: ${product.prices.salePrice == null ? product.prices.basePrice.value.toFixed(2) : product.prices.salePrice.value.toFixed(2)},
                    quantity: 1
                  }
                ]
              }
            });
          `}
      </Script>

      <NextSeo
        title={product.name}
        description={product.plainTextDescription}
        openGraph={{
          type: 'website',
          title: product.name,
          description: product.plainTextDescription,
          images: [
            {
              url: product.defaultImage.url80wide,
              width: 400,
              height: 400,
              alt: product.name,
            },
          ],
        }}
      />
    </>
  )
}

export async function getServerSideProps(context){
  //,headers: {'Accept': 'application/json','Content-Type': 'application/json'}
  const f_local = context.locale;
  const sc = get_store_code(f_local);
  const return_data = await prismic_fetch_query(f_local, 'product', context.params.slug);
  const productContent = return_data[2];

  if(typeof(productContent) == "undefined"){
    return {
      props: {
        menu:return_data[0],
        footer:return_data[1]
      },
      notFound: true
    }
  } else{
    var pId = 0;
    if(typeof(productContent) != "undefined"){
      pId = productContent.data.bc_product_id
    }
    const end_point_products = site_url+`api/zoleo/product/${sc}/${f_local}/${pId}`;
    const product = await fetch(end_point_products).then((response) => response.json()).then((json) => { return json; }).catch((error) => { console.error(error);});  
    const products = product.product.data.site.product
    const currencies = product.currencies;

    //get a yotpo reviews
    const options_yotpo = { method: 'GET', headers: {Accept: 'application/json', 'Content-Type': 'application/json'}};
    const product_yotpo = await fetch('https://api.yotpo.com/products/6ApQc0m9rPp8mtlb7zxrU5SGPUcPxVFMexB9wkVP/'+products.entityId+'/bottomline', options_yotpo).then((response) => response.json()).then((json) => { return json; }).catch((error) => { console.error(error);});  

    return {
      props: {
        menu:return_data[0],
        footer:return_data[1],
        productContent:productContent,
        product:products,
        currencies:currencies,
        product_yotpo:product_yotpo
      }
    }
  }

  
}

Product.Layout = Layout