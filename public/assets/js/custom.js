

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

/* header */
// if ($(window).width() >= 992) {
//   $(".top-menu .menu-products > a").click(function(){
//       $(".top-menu .menu-products").toggleClass('active');
//     });
//   $(document).on("mouseleave",".top-menu .menu-products",function () {
//     $(".top-menu .menu-products").removeClass('active');
//   });
//   $(".top-menu .menu-products .sub-menu a").click(function(){
//       $(".top-menu .menu-products").removeClass('active');
//     });
//   $(document).on("click",".page-header .top-bar .li_head_account .icon.login_user",function(){
//       $(".page-header .top-bar .li_head_account .acc_dropdown").toggle();
//     });
//   $(".page-header .top-bar .li_head_account .acc_dropdown li").click(function(){
//       $(".page-header .top-bar .li_head_account .acc_dropdown").hide();
//     });
//   $(document).on("mouseleave",".page-header .top-bar .li_head_account .acc_dropdown",function () {
//     $(".page-header .top-bar .li_head_account .acc_dropdown").hide();
//   });
// }
// if ($(window).width() <= 991) {
//   $(".header-main .mobile-menu").click(function () {
//     $(".header-main nav").toggleClass("active");
//     $("body").toggleClass("open-menu");
//   });
//   $(".top-menu li:not(.menu-products), .sub-menu .menu-list .second-level li a").click(function(){
//       $(".header-main nav").toggleClass("active");
//       $("body").toggleClass("open-menu");
//   });
//   $(".header-main .menu-products > a, .header-main .menu-products > .nav__top-menu-mobile-icon").click(function () {
//     $(this).parent().toggleClass("active");
//     $(this).siblings(".sub-menu").slideToggle();
//   });
//   $(".header-main .menu-products .child-menu .prod-title").click(function () {
//     $(".header-main .menu-products .child-menu").toggleClass("active");
//     $(".sub-menu .menu-list .second-level").slideToggle();
//     $(".header-main nav").toggleClass("active");
//     $("body").toggleClass("open-menu");
//   });
//   $(".header-main .menu-products .child-menu .nav__top-menu-mobile-icon").click(function () {
//     $(".header-main .menu-products .child-menu").toggleClass("active");
//     $(".sub-menu .menu-list .second-level").slideToggle();
//     $(".header-main nav").toggleClass("active");
//     $("body").toggleClass("open-menu");
//   });
// }

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

$(document).on('click','.mobile .footer-links .link-title', function(){
  $(this).siblings().slideToggle();
  $(this).parent().toggleClass("active");
});

/* cookie msg */
$(".cookies .accept_cookie").click(function(){
  $(".cookies").hide();
});
