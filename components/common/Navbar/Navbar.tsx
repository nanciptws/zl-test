import { FC, useEffect } from 'react'
import NavbarRoot from './NavbarRoot'
import s from './Navbar.module.css'
import { Container } from '@components/ui'
import UserNav from 'components/common/UserNav/UserNav'
import Link from '@components/ui/Link'
import { I18nWidget } from '@components/common'
import { cognito_client_id, cognito_urL, filterResultsByTypename, site_url } from 'prismic-configuration'
import Cookies from 'js-cookie'
import { RichText } from "prismic-reactjs";
import { linkResolver } from "prismic-configuration"
import $ from 'jquery'
import CustomLink from '../CustomLink'


interface Props { menu: any }

const Navbar: FC<Props> = ({ menu }) => {

  useEffect(() => {

    //Toggle Class
    $(document).on('click',".header-main .mobile-menu",function () {
      $(".header-main nav").toggleClass("active");
      $("body").toggleClass("open-menu");
    });

    //Open menu desktop
    $(document).on('click','.desktop .top-menu > li', function(){
      const topClick = $(this);
      topClick.find('.sub-menu').show();
      topClick.toggleClass('active');
      $(topClick).off().on("mouseleave",function () {
        topClick.removeClass('active');
      });
    });
    
    // // open menu on tab
    // $(document).on('focus','.desktop .top-menu > li', function(){
    //   const topClick = $(this);
    //   topClick.find('.sub-menu').show();
    //   topClick.toggleClass('active');
    //   $(topClick).off().on("keydown",function () {
    //     topClick.removeClass('active');
    //   });
    // });

    //Open menu mobile
    $(document).on('click','.mobile .top-menu > li > a', function(){
      const topClick = $(this);
      const subMenu = topClick.parent().find('.sub-menu').length;
      topClick.parent().find('.child-menu').off().on('click',function(){
        const secClick = $(this);
        secClick.toggleClass('active');
        secClick.find('.second-level').slideToggle();
      });
      topClick.parent().find('.sub-menu').slideToggle();
      topClick.parent().toggleClass('active');
      if(subMenu == 0){
        $(".header-main nav").removeClass("active");
        $("body").removeClass("open-menu");
      }
    });

    //Click to li close menu
    $(document).on('click','.mobile .top-menu > li .menu-list > li:not(.child-menu), .child-menu .second-level > li', function(){
      $(".header-main nav").removeClass("active");
      $("body").removeClass("open-menu");
    });


    //My Account Dropdown Click
    $(".top-bar").on('click', '.li_head_account .login_user',function(){
      const topClick = $(this);
      topClick.parent().find('.acc_dropdown').toggle();
      topClick.parent().find('.acc_dropdown').off().on("mouseleave",function () {
        $(this).hide();
      });
      topClick.parent().find('.acc_dropdown > li').off().on("click",function () {
        $(this).parent().hide();
      });
    })

    
    const accept_cookie = document.querySelector<HTMLElement>('.accept_cookie');
    if(accept_cookie){
      accept_cookie.addEventListener('click', function(){
        Cookies.set('accept_cookie', 'y', { expires : 365 })
      });
    }

    const chk_accept_cookie = Cookies.get('accept_cookie');
    if(typeof(chk_accept_cookie) === "undefined"){
      const div_cookies = document.querySelector<HTMLElement>('.cookies');
      if(div_cookies){
        div_cookies.style.display = "flex";  
      }
    }

  }, []);

  if (menu) {
    if(menu.menu.results[0]){
      var navbar  = menu.menu.results[0].data

      if(navbar.is_cart_enable == false){
        Cookies.set('isCart',"N",{expires:1});
      } else{
        Cookies.remove('isCart');
      }

      const locale_data = JSON.stringify(menu.locale_data)


      //Menu Level Set Start
      const return_id_data = (node:any,id:any, value:any) => {
        return node.map((data:any)=>{
          if(data.primary[id] == value){ return data; }
          else{ return null }
        })
      }
      const leave_1_2_menu  = filterResultsByTypename(navbar.body,'1_and_2_leave_menu');
      const leave_3_menu  = filterResultsByTypename(navbar.body,'3rd_level_menu');
      const products_list  = filterResultsByTypename(navbar.body,'products_list');
      
      //Level 1, 2 & 3 start
      let menu_obj:any = [];
      leave_1_2_menu.map((menu)=>{
        const id = menu.primary.level_id_1;
        const title = menu.primary.title;
        const link = menu.primary.link;
        const mega_menu = menu.primary.mega_menu;
        const items = menu.items;

        const level_1:any = { mega_menu:mega_menu, title:title, link:link }


        //Level 2-3 start
        const level_2_arr:any = [];
        items.map((menu:any)=>{
          const id = menu.level_id_2;
          const title = menu.title;
          const image = menu.image;
          const link = menu.link;
          const fb_link = menu.fb_link;
          const fb_icon_class = menu.fb_icon_class;
          const it_link = menu.it_link;
          const it_icon_class = menu.it_icon_class;
          const yt_link = menu.yt_link;
          const yt_icon_class = menu.yt_icon_class;
          const li_link = menu.li_link;
          const li_icon_class = menu.li_icon_class;
          const social_icon = menu.social_icon
          
          
          //Level 3 start
          const level_3_arr:any = [];
          if(id){
            const data_3 =return_id_data(leave_3_menu,'level_id_3',id)
            const filtered = data_3.filter((el:any) => {return el != null;});
            if(filtered.length > 0){
              filtered[0].items.map((menu:any)=>{
                const title = menu.title;
                const image = menu.image;
                const link = menu.link;
                const custom_url = menu.custom_url;
  
                const level_3:any = {
                  title:title,
                  image:image,
                  link:link,
                  custom_url:custom_url
                }
                level_3_arr.push(level_3);
              })
            }
          }
          //Level 3 end

          const level_2:any = { title:title, image:image, link:link, level_3:level_3_arr, fb_link:fb_link, fb_icon_class:fb_icon_class, it_link:it_link, it_icon_class:it_icon_class, yt_link:yt_link, yt_icon_class:yt_icon_class, li_link:li_link, li_icon_class:li_icon_class, social_icon:social_icon  }
          level_2_arr.push(level_2)
          
        })
        //Level 2-3 end

        if(mega_menu == true){
          const shop_by = return_id_data(products_list,'shop_by_mega_id',id)
          const filtered = shop_by.filter((el:any) => {return el != null;});
          level_1['shop_by'] = filtered;
          level_1['level_2'] = level_2_arr;
        }else{
          level_1['level_2'] = level_2_arr;
        }

        menu_obj.push(level_1);
      })
      //Level 1, 2 & 3 end

      return (
        <NavbarRoot>
          <Container>
            <header id='header'>
              <div className="page-header">
                <span className="sign_in_link" style={{display:'none'}}>{navbar.sign_in_link}</span>
                <div className="top-bar">
                  <div className="container">
                    <ul className="pencil_right">
                      <li>
                        <a href={navbar.pencil_bar_title_link_1.url} className="link" target="_blank" rel="noopener noreferrer follow">
                        {navbar.pencil_bar_title_1}
                        </a>
                      </li>
                      
                      <li className="li_head_account"> 
                        <a href="#" className="icon">
                          <span className="user-account" data-text={navbar.sign_out_text}>{navbar.sign_in_text}</span>
                        </a>
                        <ul className="acc_dropdown" style={{display:'none'}}>
                        {navbar.account_link_visible == true ?
                          <li className="my_acc">
                            <a href="#" className="my_acc_link">{navbar.account_link_title}</a>
                          </li> : ""}
                          {navbar.is_dropdown_2nd_link == true ? 
                          <li className="extra_link">
                            <a data-href={navbar.login_dropdown_link2.url} href={navbar.login_dropdown_link2.url}>{navbar.login_dropdown_link2_title}</a>
                          </li> : ""}
                          <li className='li_head_logout' style={{display:'none'}}>
                            <a href={cognito_urL+""+"logout?response_type=token&client_id="+cognito_client_id+"&logout_uri="+site_url+"de-de/ssologout"} className="icon">
                              {navbar.dropdown_sign_out_link_title}
                            </a>
                          </li>
                        </ul>
                      </li>
                      {navbar.is_cart_enable == true ? <li>
                        <span className="cart_icon">
                          <Link key='cart' href="/cart">
                          <span title="Cart"> 
                            <svg width="26" height="28" viewBox="0 0 26 28"><path d="M10 24c0 1.094-0.906 2-2 2s-2-0.906-2-2 0.906-2 2-2 2 0.906 2 2zM24 24c0 1.094-0.906 2-2 2s-2-0.906-2-2 0.906-2 2-2 2 0.906 2 2zM26 7v8c0 0.5-0.391 0.938-0.891 1l-16.312 1.906c0.078 0.359 0.203 0.719 0.203 1.094 0 0.359-0.219 0.688-0.375 1h14.375c0.547 0 1 0.453 1 1s-0.453 1-1 1h-16c-0.547 0-1-0.453-1-1 0-0.484 0.703-1.656 0.953-2.141l-2.766-12.859h-3.187c-0.547 0-1-0.453-1-1s0.453-1 1-1h4c1.047 0 1.078 1.25 1.234 2h18.766c0.547 0 1 0.453 1 1z"></path></svg>
                            <span className="cart_count" style={{display:'none'}}>0</span></span>
                          </Link>
                        </span>
                      </li> : "" }

                      <li>
                        <a
                          href={navbar.pencil_bar_title_link_3.url}
                          className="button-activate"
                        >
                          {navbar.pencil_bar_title_3}
                        </a>
                      </li>

                      <I18nWidget data_type="li_list" data_locale={locale_data} />

                    </ul>
                  </div>
                </div>
                <div className="header-main">
                  <div className="container header-inner">
                    <span className="mobile-menu"></span>
                    <div className="logo">
                      <Link key='logo' href="/"><img src={navbar.logo.url} alt={navbar.logo.alt} title={navbar.logo.alt} /></Link>
                    </div>
                    {navbar.is_cart_enable == true ? <div className='mobile-cart-icon'>
                          <span className="cart_icon">
                            <Link key='cart' href="/cart">
                            <span title="Cart">
                              <svg width="26" height="28" viewBox="0 0 26 28"><path d="M10 24c0 1.094-0.906 2-2 2s-2-0.906-2-2 0.906-2 2-2 2 0.906 2 2zM24 24c0 1.094-0.906 2-2 2s-2-0.906-2-2 0.906-2 2-2 2 0.906 2 2zM26 7v8c0 0.5-0.391 0.938-0.891 1l-16.312 1.906c0.078 0.359 0.203 0.719 0.203 1.094 0 0.359-0.219 0.688-0.375 1h14.375c0.547 0 1 0.453 1 1s-0.453 1-1 1h-16c-0.547 0-1-0.453-1-1 0-0.484 0.703-1.656 0.953-2.141l-2.766-12.859h-3.187c-0.547 0-1-0.453-1-1s0.453-1 1-1h4c1.047 0 1.078 1.25 1.234 2h18.766c0.547 0 1 0.453 1 1z"></path></svg>
                              <span className="cart_count" style={{display:'none'}}>0</span></span>
                            </Link>
                          </span>
                    </div> : ""}

                    <nav className='navBar_'>
                    
                    
                      <ul className="top-menu">

                        <I18nWidget data_type="mobile" data_locale={locale_data} />

                        {
                          menu_obj.map((item:any, i:number) => (
                            <li key={i} className={'menu-products '+(item.mega_menu == true ? "mega-menu":"single-menu")}>

                              {item.link.link_type != "Any" ? 
                                (<Link key={i} href={item.mega_menu == true ? "javascript:void(0);": (item.level_2.length == 0 ?"/"+item.link.uid:"javascript:void(0);")}>{item.title}</Link>)
                              : ""}

                              { item.mega_menu == true ? 
                                <>
                                  <span className="nav__top-menu-mobile-icon"></span>
                                  <div className="sub-menu">
                                    <ul className="menu-list mega-menu-list">
                                        {item.level_2.map((items:any, sm:any) => (
                                          (items.link.link_type != "Any" ? 
                                            (<li key={sm}>
                                              <span className="prod-img">
                                                <CustomLink href={items.link}>
                                                  <img src={items.image.url+"&q=60"} alt={items.image.alt} title={items.image.alt} loading="lazy" width="auto" />
                                                </CustomLink>
                                              </span>
                                              <span className="prod-title">
                                                  <CustomLink key={i} href={items.link}><strong>{items.title}</strong></CustomLink>
                                              </span>
                                              
                                              
                                                 { items.social_icon == true ?
                                                  <div key={i} className={'desktop_only '+ s.social_list}>
                                                  
                                                  <CustomLink href={items.fb_link}><i className={items.fb_icon_class}></i></CustomLink>
                                                  
                                                  <CustomLink href={items.it_link}><i className={items.it_icon_class}></i></CustomLink>
                                                  
                                                  <CustomLink href={items.yt_link}><i className={items.yt_icon_class}></i></CustomLink>
                                                  
                                                  <CustomLink href={items.li_link}><i className={items.li_icon_class}></i></CustomLink>
                                                  
                                                  </div>: ""}
                                                  
                                                  
                                            </li>)
                                          : "")
                                          ))}

                                        {item.shop_by.length > 0 ? 
                                        <li className="child-menu">
                                          <span className="prod-title"><a href="javascript:void(0);"><strong>{ RichText.asText(item.shop_by[0].primary.menu_title)}</strong></a></span>
                                          <span className="nav__top-menu-mobile-icon"></span>
                                          <ul className="second-level">
                                            {item.shop_by[0].items.map((itm:any, i:any) => (
                                              <li key={i}>
                                                {itm.title == null ? (itm.image.url != null ? (<img style={{width:'40px',height: '40px',objectFit:'contain',marginBottom: '10px'}} src={itm.image.url+"&w=40&q=40"} alt={itm.title} />) :"") : (<CustomLink href={itm.link}>{itm.title}</CustomLink>)}
                                              </li>
                                            ))}
                                          </ul>
                                        </li> : ""}


                                        {item.shop_by.length > 0 ? 
                                        <li className="menu_product_sec">
                                          <div className="menu_product">
                                            <RichText render={item.shop_by[0].primary.menu_title} serializeHyperlink={linkResolver} />
                                            <ul className="menu_product_list">
                                              {item.shop_by[0].items.map((itm:any, i:any) => (
                                                <li key={i}>
                                                  <CustomLink href={itm.link}>
                                                    {itm.image.url != null ? (<img src={itm.image.url+"&w=60&q=80"} alt={itm.title} />) :""}
                                                    <span>{itm.title}</span>
                                                  </CustomLink>
                                                </li>
                                              ))}
                                            </ul>
                                          </div>
                                        </li> : ""}

                                      </ul>
                                    
                                  </div>
                                </>
                              :
                                <>
                                {item.level_2 && item.level_2.length > 0 ? 
                                  <>
                                  <span className="nav__top-menu-mobile-icon"></span>
                                  <div className="sub-menu">
                                    <ul className="menu-list single-menu-list">
                                        {item.level_2.map((items:any, sm:any) => (
                                          (items.link.link_type != "Any" ? 
                                          (<li key={sm} className={ items.level_3 && items.level_3.length ? 'child-menu' : '' } >                   
                                            <span className="prod-title">
                                                <Link key={i} href={items.level_3 && items.level_3.length ? "javascript:void(0);" : "/"+items.link.uid}>{items.title}</Link>
                                            </span>
                                            {items.level_3 && items.level_3.length ? (
                                              <>
                                                <span className="nav__top-menu-mobile-icon"></span>
                                                <ul className="second-level">
                                                  {items.level_3.map(
                                                    (itemss:any, i:number) => (
                                                      <li key={i}>
                                                        <CustomLink key={i} href={itemss.link}>{itemss.title}</CustomLink>
                                                      </li>
                                                    )
                                                  )}
                                                </ul>
                                              </>
                                            ) : (
                                              ''
                                            )}
                                          </li>)
                                          : "")
                                        ))}
                                      </ul>
                                  </div>
                                  </>
                                :""}
                                </>
                              }



                            </li>
                          ))
                        }

                        {[...navbar.mobile_display_only].map((item, i) => (
                          <li key={i} className={"mobile-display-only li_mh_"+item.title.replace(/ /g,"_")}>
                            <CustomLink href={item.title_link}>
                              <span className={item.icon_class}></span>
                              {item.title}
                            </CustomLink>
                          </li>
                        ))}
                      </ul>
                    </nav>

                    <div className="mobile-account">
                      <UserNav data-href={navbar.pencil_bar_title_link_2.url} data-title={navbar.pencil_bar_title_2} />
                    </div>

                    <div className="where-buy">
                      <CustomLink href={navbar.button_link_right}>
                        <span className='button-buy'>{navbar.button_right}</span>
                      </CustomLink>
                    </div>
                    
                  </div>
                </div>
                { navbar.promo_visible == true ? 
                <div className="promo_text" style={{backgroundColor: navbar.promo_background}}>
                  <div className="container promo_content" style={{color: navbar.promo_text_color}}>
                    <p style={{color: navbar.promo_text_color}}>
                      {navbar.promo_text}  
                      <CustomLink href={navbar.promo_links}>
                        <span style={{color : navbar.promo_text_color}}>{navbar.promo_link_title}</span>
                      </CustomLink>
                    </p>
                  </div>
                </div>
                : "" }
              </div>
            </header>
            <div className="cookies" style={{display: "none"}} >
              <RichText render={navbar.cookies_text} serializeHyperlink={linkResolver} />
              <button className="accept_cookie">{navbar.cookie_button}</button>
            </div>
          </Container>
        </NavbarRoot>
      )
    } else {
      return <div>Navbar</div>
    }
  } else {
    return <div>Navbar</div>
  }
}

export default Navbar
