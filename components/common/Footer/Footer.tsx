import { linkResolver } from 'prismic-configuration'
import { FC, useEffect } from 'react'
import { RichText } from 'prismic-reactjs'
import { Container } from '@components/ui'
import s from './Footer.module.css'
import Link from '@components/ui/Link'
import $ from 'jquery'
import CustomLink from '../CustomLink'

interface Props { footer: any }

const Footer: FC<Props> = ({ footer }) => {

  useEffect(function(){
    /* back to top */
    window.onscroll = function() {scrollFunction()};
    function scrollFunction() {
      if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        $('#upArrow').show();
      } else {
        $('#upArrow').hide();
      }
    }
    $('#upArrow').on('click', function() {  
        $("html, body").animate({ scrollTop: 0 }, 600);
        return false;
    });

    /* footer */
    $(".footer_social_connect .newsletter label .lightbox").click(function(){
      $(".footer_social_connect .newsletter .privacy_popup_back").css('display', 'flex');
      $("body").addClass("open_popup");
    });

    $(".footer_social_connect .newsletter .privacy_popup_back .close_popup").click(function(){
      $(".footer_social_connect .newsletter .privacy_popup_back").hide();
      $("body").removeClass("open_popup");
    });

    $(".footer_social_connect .newsletter .privacy_popup_back a").click(function(){
      $(".footer_social_connect .newsletter .privacy_popup_back").hide();
      $("body").removeClass("open_popup");
    });

    // $(document).on('click','.mobile .footer-links .link-title', function(){
    //   $(this).siblings().slideToggle();
    //   $(this).parent().toggleClass("active");
    //   return false;
    // });

    $('.mobile .footer-links .link-title').off().on('click', function(e){
      $(this).parent().find('li:not(.link_title)').slideToggle()
      $(this).parent().toggleClass("active");
    })
    $(document).on('click','.mobile .footer_links li:not(.link-title)', function(){
      $('.mobile .footer_links').removeClass('active')
      $('.mobile .footer_links li:not(.link_title)').hide();
    });

    /* cookie msg */
    $(".cookies .accept_cookie").click(function(){
      $(".cookies").hide();
    });
  })

  if (footer) {
    if (footer.results[0]) {
      var footerData = footer.results[0].data
      return (
        <footer className={s.footer}>
          <Container>
            <div className={s.before_footer}>
              <div className="container">
                <ul className={s.support_link}>
                  {[...footerData.before_footer].map((data, bfi) => (
                    <li key={bfi}>
                      <CustomLink key={bfi} href={data.title_link}><i className={data.icon_class}></i>{data.title}</CustomLink>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className={s.footer_main}>
              <div className={' container ' + s.footer_inner}>
                <div className={s.footer_left}>

                  { footerData.quick_link_menu_1 != null ? 
                    (<ul className={s.footer_links + ' footer-links footer_links'}>
                      <li className={s.link_title + ' link-title link_title'}>
                        <strong>{footerData.quick_link_menu_1}</strong>
                      </li>
                      {[...footerData.quick_link_submenu_1].map((data, i) => (
                        <li key={i} className={"li_ftr_"+data.title.replace(/ /g,"_")}>
                          <CustomLink key={i} href={data.title_link}>{data.title}</CustomLink>
                        </li>
                      ))}
                    </ul>)
                  : "" }


                  { footerData.quick_link_menu_2 != null ? 
                    (<ul className={s.footer_links + ' footer-links footer_links'}>
                      <li className={s.link_title + ' link-title link_title'}>
                        <strong>{footerData.quick_link_menu_2}</strong>
                      </li>
                      {[...footerData.quick_link_submenu_2].map((data, i) => (
                        <li key={i} className={"li_ftr_"+data.title.replace(/ /g,"_")}>
                          <CustomLink key={i} href={data.title_link}>{data.title}</CustomLink>
                        </li>
                      ))}
                    </ul>)
                  : ""}


                  { footerData.quick_link_menu_3 != null ? 
                  (<ul className={s.footer_links + ' footer-links footer_links'}>
                    <li className={s.link_title + ' link-title link_title'}>
                      <strong>{footerData.quick_link_menu_3}</strong>
                    </li>
                    {[...footerData.quick_link_submenu_3].map((data, i) => (
                      <li key={i} className={"li_ftr_"+data.title.replace(/ /g,"_")}>
                        <CustomLink key={i} href={data.title_link}>{data.title}</CustomLink>
                      </li>
                    ))}
                  </ul>)
                  : ""}

                  { footerData.quick_link_menu_4 != null ? 
                    (<ul className={s.footer_links + ' footer-links footer_links'}>
                      <li className={s.link_title + ' link-title link_title'}>
                        <strong>{footerData.quick_link_menu_4}</strong>
                      </li>
                      {[...footerData.quick_link_submenu_4].map((data, i) => (
                        <li key={i} className={"li_ftr_"+data.title.replace(/ /g,"_")}>
                          <CustomLink key={i} href={data.title_link}>{data.title}</CustomLink>
                        </li>
                      ))}
                    </ul>)
                  :""}

                </div>
                <div className={s.footer_social_connect+' footer_social_connect'}>
                  <div className={s.newsletter+' newsletter'}>
                    <label>
                      {footerData.newsletter_title}
                      <span className={s.lightbox+' lightbox'}>
                        <i className="icon-bubble-question"></i>
                      </span>
                    </label>
                    <div id="mc_embed_signup">
                      <form action={footerData.newsletter_form_action} method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" className="validate" target="_blank">
                      <div id="mc_embed_signup_scroll" className={s.newletter_form}>
                        <input type="email" name="EMAIL" className="email" id="mce-EMAIL" placeholder="email address" required />
                        <div style={{position: 'absolute', left: '-5000px'}} aria-hidden="true">
                          <input type="text" name={footerData.newsletter_form_id} />
                        </div>
                        <input type="submit" value={footerData.newsletter_button_title} name="subscribe" id="mc-embedded-subscribe" className="button" />
                      </div>
                      </form>
                    </div>
                    
                    <div className={s.privacy_popup_back+' privacy_popup_back'}>
                      <div className="container">
                        <div className={s.privacy_popup}>
                          <span className={s.close_popup+' close_popup'}>
                            <i className="icon-cross2"></i></span>
                          <p><strong>{footerData.privacy_popup_title}</strong></p>
                          <RichText render={footerData.privacy_popup_desc} serializeHyperlink={linkResolver} />
                        </div>
                      </div>
                    </div>
                  </div>
                  {footerData.is_second_social_link == true ?
                  <p className={s.social_title}>{footerData.social_link_title1}</p>
                  : ""}
                  <ul className={s.footer_social}>
                    {[...footerData.social].map((data, i) => (
                      data.link.link_type != "Any" ? 
                      (<li key={i}>
                        <a title={data.title} href={data.link.url} target="_blank" rel="noopener noreferrer follow">
                        {data.icon_class == "icon-youtube" ? (<><svg height="30" width="28" viewBox="0 0 32 32">
                            <path d="M31.7,9.6c0,0-0.3-2.2-1.3-3.2c-1.2-1.3-2.6-1.3-3.2-1.4C22.7,4.7,16,4.7,16,4.7h0c0,0-6.7,0-11.2,0.3
                            c-0.6,0.1-2,0.1-3.2,1.4c-1,1-1.3,3.2-1.3,3.2S0,12.2,0,14.8v2.4c0,2.6,0.3,5.2,0.3,5.2s0.3,2.2,1.3,3.2c1.2,1.3,2.8,1.2,3.5,1.4
                            C7.7,27.2,16,27.2,16,27.2s6.7,0,11.2-0.3c0.6-0.1,2-0.1,3.2-1.4c1-1,1.3-3.2,1.3-3.2s0.3-2.6,0.3-5.2v-2.4
                            C32,12.2,31.7,9.6,31.7,9.6L31.7,9.6z M12.7,20.1v-9l8.6,4.5C21.3,15.7,12.7,20.1,12.7,20.1z"/>
                          </svg></>) 
                          : <i className={data.icon_class}></i>}
                        </a>
                      </li>) : ""
                    ))}
                  </ul>
                  {footerData.is_second_social_link == true ?
                  <p className={s.social_title+' '+s.second}>{footerData.social_link_title2}</p>
                  : ""}
                  {footerData.is_second_social_link == true ?
                  <ul className={s.footer_social}>
                    {[...footerData.social2].map((data, i) => (
                      data.link.link_type != "Any" ? 
                      (<li key={i}>
                        <a title={data.title} href={data.link.url} target="_blank" rel="noopener noreferrer follow">
                        {data.icon_class == "icon-youtube" ? (<><svg height="30" width="28" viewBox="0 0 32 32">
                            <path d="M31.7,9.6c0,0-0.3-2.2-1.3-3.2c-1.2-1.3-2.6-1.3-3.2-1.4C22.7,4.7,16,4.7,16,4.7h0c0,0-6.7,0-11.2,0.3
                            c-0.6,0.1-2,0.1-3.2,1.4c-1,1-1.3,3.2-1.3,3.2S0,12.2,0,14.8v2.4c0,2.6,0.3,5.2,0.3,5.2s0.3,2.2,1.3,3.2c1.2,1.3,2.8,1.2,3.5,1.4
                            C7.7,27.2,16,27.2,16,27.2s6.7,0,11.2-0.3c0.6-0.1,2-0.1,3.2-1.4c1-1,1.3-3.2,1.3-3.2s0.3-2.6,0.3-5.2v-2.4
                            C32,12.2,31.7,9.6,31.7,9.6L31.7,9.6z M12.7,20.1v-9l8.6,4.5C21.3,15.7,12.7,20.1,12.7,20.1z"/>
                          </svg></>) 
                          : <i className={data.icon_class}></i>}
                        </a>
                      </li>) : ""
                    ))}
                  </ul>
                  : ""}
                  { footerData.partner_section == true ?
                    <div className={s.partners}>
                      <p>{footerData.partner_title}
                      <a href={footerData.partner_link.url} title={footerData.partner_logo.alt} target="_blank"
                          rel="noopener noreferrer follow">
                        <img src={footerData.partner_logo.url} alt={footerData.partner_logo.alt} />
                      </a></p>
                    </div>
                  : ""}
                </div>
              </div>
            </div>
            <div className={s.copyright}>
              <div className="container">
                <ul className={s.footer_bottom_links}>
                  {[...footerData.copyright_links].map( (items, i) => (
                      <li key={i}>
                      <CustomLink key={i} href={items.title_link}>{items.title}</CustomLink>
                      </li>
                  ))}
                </ul>
                <small>
                  <span>
                    Copyright © {new Date().getFullYear()} ZOLEO Inc. All rights
                    reserved.
                  </span>
                </small>
              </div>
            </div>
          </Container>
          <div className="back-to-top" id="upArrow">
            <span className="icon-chevron-up"></span>
          </div>
        </footer>
      )
    } else {
      return <div>Footer</div>
    }
  } else {
    return <div>Footer</div>
  }
}

export default Footer
