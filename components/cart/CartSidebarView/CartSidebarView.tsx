import { FC } from 'react'
import s from './CartSidebarView.module.css'
import { Button, LoadingDots } from '@components/ui'
import { useUI } from '@components/ui/context'
import { Cross } from '@components/icons'
import { useRouter } from "next/router";
import { bc_data_cookies, eu_bc_url, get_store_code, site_url, us_bc_url } from 'prismic-configuration'
import Cookies from 'js-cookie'
import CustomLink from '@components/common/CustomLink'
import $ from 'jquery'


const CartSidebarView: FC = () => {
  const locale = useRouter().locale;
  const store_code = get_store_code(locale);
  const { closeSidebar } = useUI()
  const cart_cookies = Cookies.get('basket'+store_code);

  const moneyFormat = function(price:any){
    return (price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }

  var cid = 0;
  if(typeof(cart_cookies) !== "undefined"){
    
    function get_cart(){
      const each_cart_cookies = Cookies.get('basket'+store_code);
      var exi_cart_ck:any = 0;
      if(each_cart_cookies){
        exi_cart_ck = JSON.parse(each_cart_cookies);
      }
      const is_loading_tmp = document.querySelector<HTMLElement>('.is_loading');
      cid = bc_data_cookies(store_code,locale);
      
      if(is_loading_tmp){
        is_loading_tmp.style.display = "flex";
      }

      const cart_id = exi_cart_ck['id'];
      var end_point = site_url+`api/zoleo/cart/getacart/${store_code}/${locale}/${cart_id}`;

      fetch(end_point).then((response) => response.json()).then((cart_res) => { 
        const cart_id = cart_res.cart.data.id;
        
        const is_loading = document.querySelector<HTMLElement>('.is_loading');
        const cart_item = document.querySelector<HTMLElement>('.cart_item');
        const cart_items = document.querySelector<HTMLElement>(".cart_items");
        const subTotal = document.querySelector<HTMLElement>(".subTotal");
        const total = document.querySelector<HTMLElement>(".total");
        const btn_checkout = document.querySelector<HTMLElement>(".btn_checkout");
        const total_vat = document.querySelector<HTMLElement>(".total_vat") as HTMLElement;
        const total_vat_count = document.querySelector<HTMLElement>(".total_vat_count");
        const total_item = cart_res.cart.data.line_items.physical_items.length;
        //const inventory_level = cart_res.inventory_level;

        var html = '';
        var item_quantity = 0;
          for (let i = 0; i < total_item; i++) {
            const obj = cart_res.cart.data.line_items.physical_items[i];
            var item_url = obj.url.split('/');
            item_quantity += parseInt(obj.quantity)
            html += `
              <li class="cart_product" items_id="${obj.id}">
                    <p class="${s.sufficient_stock+" sufficient_stock"}">Does not have sufficient stock</p>
                    <div class="${s.content}">
                      <div class="p_img"><img src="${obj.image_url}" /></div>
                      <div class="${s.p_items}">
                        <div class="${s.p_title+ " p_title"}"><a href="${item_url[3]}">${obj.name}</a></div>
                        <div class="div_price ${'p_price '+ s.p_price}" data-token="${cart_res.currencies.token}" data-price="${obj.extended_list_price.toFixed(2)}">${cart_res.currencies.token}${moneyFormat(obj.extended_list_price)}</div>
                        <div class="${s.div_action}">
                          <button type="button" class="action" items="${total_item}" action="r" product_sku="${obj.sku}" data-price="${obj.sale_price}" cart_id="${cart_id}" items_id="${obj.id}" quantity="${obj.quantity}" product_id="${obj.product_id}" title="Remove">
                            <svg style="position: relative;top: 1px;" viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="1.4"><path d="M18 6L6 18"></path><path d="M6 6l12 12"></path></svg>
                          </button>
                          <input value="${obj.quantity}" readOnly style="cursor: default;" />

                          <button type="button" class="action" action="d" items="${total_item}" cart_id="${cart_id}" items_id="${obj.id}"  quantity="${obj.quantity}" product_id="${obj.product_id}">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                          </button>
                          <button type="button" class="action" action="i" items="${total_item}" cart_id="${cart_id}" items_id="${obj.id}"  quantity="${obj.quantity}" product_id="${obj.product_id}">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 5V19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M5 12H19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                          </button>
                        </div>
                      </div>
                    </div>
              </li>
            `;
          }
          
          if(cart_items){
            cart_items.innerHTML =html;
            if(subTotal) { 
              subTotal.innerHTML = cart_res.currencies.token + '' + moneyFormat(cart_res.cart.data.base_amount)
            }
            if(total) { 
              total.innerHTML = cart_res.currencies.token +""+ moneyFormat(cart_res.cart.data.base_amount);
            }

            if(total_vat_count) {
              if(cart_res.taxes.taxes.length >= 0){
                if(cart_res.taxes.taxes[0].amount > 0){
                  total_vat.style.display = "flex";
                  total_vat_count.innerHTML = cart_res.currencies.token + '' + moneyFormat(cart_res.taxes.taxes[0].amount);
                }else{
                  total_vat.style.display = "none";
                }
              } else{
                if(total_vat){ total_vat.style.display = "none"; }
              }
            }

            
            if(btn_checkout) { 
              cid = bc_data_cookies(store_code,locale);
              //With Login
              btn_checkout.addEventListener('click', function(){
                if(is_loading){
                  is_loading.style.display = "flex";
                }
                fetch(end_point).then((response) => response.json()).then((cartURL) => {
                  if(is_loading){
                    is_loading.style.display = "flex";
                  }
                  window.location.href = cartURL.cart.data.redirect_urls.checkout_url;
                });
              })
            }
            if(is_loading){
              is_loading.style.display = "none";
            }

            if(cart_item){
              cart_item.style.display = "block";
            }

            //cart Remove, increment and dincrement start 
            const p_action = document.querySelectorAll<HTMLElement>('.action');
            if(p_action){

              for (var i = 0; i < p_action.length; i++) {
                  p_action[i].addEventListener('click', function() {
                    cid = bc_data_cookies(store_code,locale);

                    const action = this.getAttribute('action');
                    const cart_id = this.getAttribute('cart_id');
                    const items_id = this.getAttribute('items_id');
                    const quantity = this.getAttribute('quantity');
                    const pId = this.getAttribute('product_id');
                    const items = this.getAttribute('items');
                    const pSku = this.getAttribute('product_sku')
                    const pPrice = this.getAttribute('data-price')
                    
                    
                    const productName = document.querySelector<HTMLElement>('.cart_product[items_id="'+items_id+'"] .p_title a');
                    let pName = null;
                    if(productName){
                      pName = productName.innerText;
                    }
                    const productPrice = document.querySelector<HTMLElement>('.cart_product[items_id="'+items_id+'"] .p_price');
                    
                    let data_layer_category = "Accessories";
                    if(pName == "ZOLEO Global Satellite Communicator"){
                      data_layer_category = "Device";
                    }

                    //increment and dincrement
                    if(action !== null && action === 'i' || action === 'd'){
                      if(is_loading){
                        is_loading.style.display = "flex";
                      }
                      
                      let end_point_qty_update = site_url+ `api/zoleo/cart/updatecartlineitem/${store_code}/${locale}/${pId}/${quantity}/${cid}/${cart_id}/${items_id}/${items}/${action}`
                      
                      fetch(end_point_qty_update)
                      .then((response) => response.json())
                      .then((cart_res) => { 
                        if(cart_res.types.success == "N"){
                          //does not have sufficient stock
                          const sufficient_stock = document.querySelector<HTMLElement>(".cart_product[items_id='"+cart_res.types.items_id+"'] .sufficient_stock");
                          if(sufficient_stock){ sufficient_stock.style.display = "table"; }
                          if(is_loading){ is_loading.style.display = "none"; }
                        } else{
                          if(cart_res.types.remove_cart == "N" || cart_res.types.success == "Y"){
                            get_cart();
                          } else{
                            if(cart_count){
                              for (let cch = 0; cch < cart_count.length; cch++) {
                                const ele = cart_count[cch];
                                ele.innerText = "0";
                                ele.setAttribute('style','display:none');
                              }
                            }

                            Cookies.remove('basket'+store_code);
                            const cart_empty = document.querySelector<HTMLElement>('.cart_empty');
                            if(cart_empty){ cart_empty.style.display = "block"; }
                            if(cart_item){ cart_item.style.display = "none"; }
                            if(is_loading){ is_loading.style.display = "none"; }
                          }    
                        }
                      });
                    }
                    //remove cart
                    else if(action !== null && action === 'r'){
                      if(is_loading){
                        is_loading.style.display = "flex";
                      }
                      var dataLayer = []
                      dataLayer.push({ ecommerce: null });
                      dataLayer.push({
                        event: "remove_from_cart",
                        ecommerce: {
                          items: [
                            {
                              item_id: ""+pSku,
                              item_name: ""+pName,
                              affiliation: "Zoleo",
                              currency: ""+currency_code,
                              index: 0,
                              item_brand: "Zoleo",
                              item_category: ""+data_layer_category,
                              price: pPrice,
                              quantity: quantity
                            }
                          ]
                        }
                      });
                      console.log('dataLayer removeFromCart')
                      console.log(dataLayer)

                      let end_point_delete = site_url+`api/zoleo/cart/deleteacart/${store_code}/${locale}/${cart_id}/${items_id}/${items}`
                      
                      fetch(end_point_delete)
                      .then((response) => response.json())
                      .then((cart_res) => { 
                        if(cart_res.types.remove_cart == "N"){
                          get_cart();
                        } else{
                          if(cart_count){
                            for (let cch = 0; cch < cart_count.length; cch++) {
                              const ele = cart_count[cch];
                              ele.innerText = "0";
                              ele.setAttribute('style','display:none');
                            }
                          }

                          Cookies.remove('basket'+store_code);
                          Cookies.remove('basket'+store_code+"details");
                          const cart_empty = document.querySelector<HTMLElement>('.cart_empty');
                          if(cart_empty){ cart_empty.style.display = "block"; }
                          if(cart_item){ cart_item.style.display = "none"; }
                          if(is_loading){ is_loading.style.display = "none"; }
                        }                        
                      });
                    }
                  });
              }
            }
            //cart Remove, increment and dincrement End
          
          }

          const items_count = item_quantity;
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
          
          const cart_count = document.querySelectorAll<HTMLElement>('.cart_count');
          if(cart_count){
            for (let cch = 0; cch < cart_count.length; cch++) {
              const ele = cart_count[cch];
              ele.innerText = ""+items_count;
              ele.setAttribute('style','display:block');
            }
          }

          //Set Cookies in BC stores start
          var node_data = JSON.stringify({'sc':store_code, 'l':locale });
          var node_data_cart = JSON.stringify({'sc':store_code, 'eu_cart_count': items_count});
          if(store_code == 'us'){
            node_data_cart = JSON.stringify({'sc':store_code, 'us_cart_count': items_count});
          }
          Cookies.set('node_data', node_data, {expires : 2});

          //eu
          var eu_iframe = document.createElement("iframe");
          eu_iframe.setAttribute("id", "iframe1");
          eu_iframe.setAttribute("src", eu_bc_url+'auth-in-php/?node_data='+node_data+'&node_data_cart='+node_data_cart);
          eu_iframe.setAttribute("style", "width: 100px;height: 100px;border: none;display: none;");
          //us
          var us_iframe = document.createElement("iframe");
          us_iframe.setAttribute("id", "iframe2");
          us_iframe.setAttribute("src", us_bc_url+'auth-in-php/?node_data='+node_data+'&node_data_cart='+node_data_cart);
          us_iframe.setAttribute("style", "width: 100px;height: 100px;border: none;display: none;");

          setTimeout(() => {
            document.body.append(eu_iframe);
            document.body.append(us_iframe);
          },1000);
          //Set Cookies in BC stores End

        // for (let il = 0; il < inventory_level.length; il++) {
        //   const il_obj = inventory_level[il];
        //   if(il_obj.inventory_tracking != "none"){
        //     var sufficient_stock = document.querySelector<HTMLElement>(".cart_product[product_id='"+il_obj.id+"'] .sufficient_stock");
        //     var sufficient_stock_qty = document.querySelector<HTMLElement>(".cart_product[product_id='"+il_obj.id+"']");
        //     if(sufficient_stock_qty){
        //       if(''+sufficient_stock_qty.getAttribute('quantity') == il_obj.inventory_level){
        //         if(sufficient_stock){ sufficient_stock.style.display = "table"; }
        //       }
        //     }
        //   }
        // }

      });
    }
    get_cart();
  }
  const handleClose = () => closeSidebar()
  
  return (
    <div className={s.cart_sidebar_view+" cart_sidebar_view"}>

      <div className={s.is_loading+ " is_loading"}>
        <LoadingDots />
      </div>

      {handleClose && (
        <button title="Close" onClick={handleClose} aria-label="Close" className={s.handle_close} >
          <Cross />
        </button>
      )}

      <div className={s.is_empty+ " cart_empty"} style={{display:'none'}}>
        <span className={s.is_empty_icon}>
          <svg fill="#1C2E33" width="26" height="28" viewBox="0 0 26 28"><path d="M10 24c0 1.094-0.906 2-2 2s-2-0.906-2-2 0.906-2 2-2 2 0.906 2 2zM24 24c0 1.094-0.906 2-2 2s-2-0.906-2-2 0.906-2 2-2 2 0.906 2 2zM26 7v8c0 0.5-0.391 0.938-0.891 1l-16.312 1.906c0.078 0.359 0.203 0.719 0.203 1.094 0 0.359-0.219 0.688-0.375 1h14.375c0.547 0 1 0.453 1 1s-0.453 1-1 1h-16c-0.547 0-1-0.453-1-1 0-0.484 0.703-1.656 0.953-2.141l-2.766-12.859h-3.187c-0.547 0-1-0.453-1-1s0.453-1 1-1h4c1.047 0 1.078 1.25 1.234 2h18.766c0.547 0 1 0.453 1 1z"></path></svg>
        </span>
        <h2 className={s.is_empty_title}>
          Your cart is empty
        </h2>
        <p className={s.is_empty_desc} onClick={handleClose}>
          <a href="#">Continue Shopping</a>
        </p>
      </div>

      <div className="cart_item" style={{display:'none'}}>
        <div className={s.line_items_list}>
          <CustomLink href="/cart">
            <h2 onClick={handleClose} className={s.cart_title}>
                <svg width="26" height="28" viewBox="0 0 26 28"><path d="M10 24c0 1.094-0.906 2-2 2s-2-0.906-2-2 0.906-2 2-2 2 0.906 2 2zM24 24c0 1.094-0.906 2-2 2s-2-0.906-2-2 0.906-2 2-2 2 0.906 2 2zM26 7v8c0 0.5-0.391 0.938-0.891 1l-16.312 1.906c0.078 0.359 0.203 0.719 0.203 1.094 0 0.359-0.219 0.688-0.375 1h14.375c0.547 0 1 0.453 1 1s-0.453 1-1 1h-16c-0.547 0-1-0.453-1-1 0-0.484 0.703-1.656 0.953-2.141l-2.766-12.859h-3.187c-0.547 0-1-0.453-1-1s0.453-1 1-1h4c1.047 0 1.078 1.25 1.234 2h18.766c0.547 0 1 0.453 1 1z"></path></svg> My Cart
            </h2>
          </CustomLink>
          <ul className={s.ul_line_items_list+" cart_items"} style={{listStyle:"none"}}>
            
          </ul>
        </div>

        <div className={s.cart_summary}>
          <ul className={s.ul_cart_summary}>
            <li className="flex justify-between py-1">
              <span>Subtotal</span>
              <span className="subTotal">0</span>
            </li>
            <li className="flex justify-between py-1">
              <span>Shipping</span>
              <span className="font-bold tracking-wide">FREE</span>
            </li>
          </ul>
          <div className="flex justify-between border-t border-accent-2 py-3 font-bold mb-2">
            <span>Total</span>
            <span className="total">0</span>
          </div>
          <div className={s.total_vat+" total_vat"}><span>Vat Included in Total</span><span className='total_vat_count'>0</span></div>
          <div className={s.mc_checkout}>
            <Button href="#" className="btn_checkout" Component="a" width="100%">
              Proceed to Checkout
            </Button>
          </div>
          <p className={s.continue_shop} onClick={handleClose}>
          <a href="#">Continue Shopping</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default CartSidebarView
