$('.scroll_link').on('click', function() {  
    $('html, body').animate({scrollTop: $(this.hash).offset().top - 150}, 700);
    return false;
});
