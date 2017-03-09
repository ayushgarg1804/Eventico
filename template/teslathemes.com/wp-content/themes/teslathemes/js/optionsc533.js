/*appear*/
(function(c){function e(){h=!1;for(var a=0;a<k.length;a++){var b=c(k[a]).filter(function(){return c(this).is(":appeared")});b.trigger("appear",[b]);if(l){var d=l.not(b);d.trigger("disappear",[d])}l=b}}var k=[],m=!1,h=!1,n={interval:250,force_process:!1},g=c(window),l;c.expr[":"].appeared=function(a){a=c(a);if(!a.is(":visible"))return!1;var b=g.scrollLeft(),d=g.scrollTop(),f=a.offset(),e=f.left,f=f.top;return f+a.height()>=d&&f-(a.data("appear-top-offset")||0)<=d+g.height()&&e+a.width()>=b&&e-(a.data("appear-left-offset")||0)<=b+g.width()?!0:!1};c.fn.extend({appear:function(a){var b=c.extend({},n,a||{});a=this.selector||this;if(!m){var d=function(){h||(h=!0,setTimeout(e,b.interval))};c(window).scroll(d).resize(d);d();m=!0}b.force_process&&setTimeout(e,b.interval);k.push(a);return c(a)}});c.extend({force_appear:function(){return m?(e(),!0):!1}})})(jQuery);

(function ($) {

	$(document).ready(function () {
		"use strict";
		// Header dropdowns
		$('html').click(function (e) {
			if (!$(e.target).is(".tesla-cart *, .tesla-register *, .tesla-login *, .tesla-user *")) {
				$(".toggle-box").hide();
				$('.tesla-cart .actived, .tesla-register .actived, .tesla-login .actived').removeClass('actived');
			}
		});

		$( '.login-box' ).on( 'click', function( e ) {
			if( $( e.target ).is( '.login-box .login-box-wrapper *' ) ) return;

			$( '.toggle-box' ).hide();
			$( '.tesla-login .actived' ).removeClass( 'actived' );
		});

		$('.toggle-button').click(function(e){
			if(!$(this).hasClass('actived')){
				$('.tesla-secure-area .actived').removeClass('actived');
				$(".tesla-secure-area .toggle-box").hide();
				$(this).addClass('actived');
				$(this).next('.toggle-box').show();
				$(this).children('.toggle-box').show();
			}else{
				$('.tesla-secure-area .actived').removeClass('actived');
				$(".tesla-secure-area .toggle-box").hide();
			}
		});

		$('body').on('click','.gototop',function() {
		    $('body,html').animate({
		        scrollTop: 0
		    }, 1200, 'swing');
		    return false;
		});

		$(".responsive-menu").click(function (e) {
			$(".main-menu>ul").toggle();
			e.stopPropagation();
			if (e.preventDefault)
				e.preventDefault();
			return false;
		});
		$("body").click(function() {
			$(".main-menu>ul").css({display: "none"});
		});

		$('.forgot-pass-form').hide();
		$('.forgot-pass h3').click(function(){
			$('.forgot-pass-form').slideToggle();
		})

		if (!Array.prototype.indexOf) {
			Array.prototype.indexOf = function (obj, start) {
				for (var i = (start || 0), j = this.length; i < j; i++) {
					if (this[i] === obj) {
						return i;
					}
				}
				return -1;
			};
		}

		//======== Add extra products to cart =====================

		$('body').on('click', '.widget-recommand .theme-upsale .upsell-option',function() {
			var itemLabel = $(this),
				container = $(this).closest('.theme-upsale'),
				selectedItems = container.find('span.checkbox'),
				subtotalPriceContainer = container.find('h5 span'),
				//Price
				price = itemLabel.data( 'price' ),
				total = $( '.upsell-total' ),
				totalAmount = Number( total.attr( 'data-upsell-amount' ) ),
				//Products IDs					
				index = $('.widget-recommand .theme-upsale .upsell-option').index(this),
				productId = itemLabel.data( 'product' ),
				buyNowButton = jQuery('.theme-sidebar-buy,.theme-top-buy,.theme-bottom-buy'),
				allProductsIds = JSON.parse(buyNowButton.attr( 'data-upsell-products' ));
				
				index = index > 2 ? index - 3 : index;
				allProductsIds[index] = itemLabel.hasClass( 'click' ) ? 0 : productId;

			itemLabel.toggleClass( 'click' );
			total.attr( 'data-upsell-amount', totalAmount + (itemLabel.hasClass( 'click' ) ? price : -price) );			
			buyNowButton.attr( 'data-upsell-products',  JSON.stringify(allProductsIds));
		});

		$('.tesla-services-tabs .nav-tabs li span').on('click', function() {
			var choosedItem = $(this),
				productId = choosedItem.attr('data-product-id');
			if(!choosedItem.hasClass('added')) {
				choosedItem.addClass('added');				
				cart.add(this,productId);
				console.log(productId);
				setTimeout(function(){
					location.reload();
					console.log('reload');
				}, 500)
			}
		})

		//======== Lab Page Contact ===============================
		$('.lab-form').submit(function(event){
			event.preventDefault();
			if(grecaptcha.getResponse(recaptcha_lab) == ""){
				$('.lab-submit').val('Please validate reCaptcha');
				setTimeout(function(){$('.lab-submit').val('Submit')},3000)
				return false;
			}else{
				$('.lab-submit').val('Sending ...').attr('disabled','disabled');
			}
			$.ajax({
				url: ajaxurl,
				method: "POST",
				data: $(this).serialize() + "&action=lab_page_contact",
				success: function(result){
					$('.lab-submit').val(result).attr('disabled','disabled');
					setTimeout(function(){$('.lab-submit').val('Submit').removeAttr('disabled')},5000)
				},
				complete: function(xhr,status){
					setTimeout(function(){$('.lab-submit').val('Submit').removeAttr('disabled')},5000);
				}
			});
			return false;
		});
		//=======Contact Page COntact================================
		$('.tesla-contact-form').submit(function(event){
			event.preventDefault();
			if(grecaptcha.getResponse(recaptcha_contact) == ""){
				$('.contact-submit').val('Please validate reCaptcha');
				setTimeout(function(){$('.contact-submit').val('Submit')},3000)
				return false;
			}else{
				$('.contact-submit').val('Sending...').attr('disabled','disabled');
			}

			$.ajax({
				url: ajaxurl,
				method: "POST",
				data: $(this).serialize() + "&action=contact_page_contact",
				success: function(result){
					$('.contact-submit').val(result).attr('disabled','disabled');
					setTimeout(function(){$('.contact-submit').val('Submit').removeAttr('disabled')},5000);
				},
				complete: function(xhr,status){
					setTimeout(function(){$('.contact-submit').val('Submit').removeAttr('disabled')},5000);
				}
			});
			return false;
		});

		//Footer subscription ===================================
		$('footer .newsletter-form').tt_subscription({
			success : function(result,config,form){
				$(form).addClass('success');
				setTimeout(function(){$(form).removeClass('success');},config.result_timeout); //hiding results after a certain time
			},    //callback for success subscription
			error:function(error,config,form){
				$(form).addClass('error');
				setTimeout(function(){$(form).removeClass('error');},config.result_timeout); //hiding results after a certain time
			},         //callback for some error action while subscribing
			required:function(config,form){
				$(form).addClass('error required_error');
				setTimeout(function(){$(form).removeClass('error required_error');},config.result_timeout); //hiding results after a certain time
			},            //callback for required inputs not being filled
			invalid_email:function(config,form){
				$(form).addClass('error invalid_error');
				setTimeout(function(){$(form).removeClass('error invalid_error');},config.result_timeout); //hiding results after a certain time
			}      //callback for an invalid email inserted in input with data-tt-subscription-type="email"
		});

		//Floating pricing box===================
		setTimeout(function(){
			//if( $('.theme-icons-description').length )
			//	console.log($(document).height() - $('.theme-icons-description').offset().top + 383,$('.theme-icons-description').offset().top - $('.widget-theme-price.floating').offset().top)
			if($('.theme-icons-description').length && $('.theme-icons-description').offset().top - $('.widget-theme-price.floating').offset().top > 700){
				$('.widget-theme-price.floating').affix({
					offset: {
						top: function(){
							return (this.top = $('.widget-theme-price.floating').offset().top - 20);
						},
						bottom: function(){
							//console.log($(document).height() - $('.theme-icons-description').offset().top + 280)
							if($('.theme-icons-description').length)
								return (this.bottom = $(document).height() - $('.theme-icons-description').offset().top + 383);
							return (this.bottom = $('footer').height() + 170);
						}
					}
				});
			}else{
				$('.widget-theme-price.floating').addClass('hidden hidden-ever')
			}
		},800);
		/*$(window).scroll(function(){
			console.log($(window).scrollTop());
		});*/
		$('[aria-controls=themefeatures2]').click(function(){
			$('.widget-theme-price.floating').addClass('hidden');
		});
		$('[aria-controls=themefeatures1]').click(function(){
			if(!$('.widget-theme-price.floating').hasClass('hidden-ever'))
				$('.widget-theme-price.floating').removeClass('hidden');
		});
		//Sticky single theme bar================
		$('.theme-price-line').sticky({topSpacing:0});
		$('.underbox-text').affix({
			offset: {
				top: 200,
				bottom: function () {
			    	return (this.bottom = $('footer').outerHeight(true))
				}
			}
		});
		//Documentation page filters
		if($('.doc-container, .post-type-archive-testimonials .testimonialpage-section .row').length){
			var $isotope_container = $('.doc-container, .post-type-archive-testimonials .testimonialpage-section .row');
			$isotope_container.isotope();
			$('.doc-select').change(function(){
				$isotope_container.isotope({ filter: $(this).val() });
			});
		}

		//Reviews==============================
		$('.modal .rate-theme-box i').click(function(){
			var rate_box	= $(this).parent().parent();
			var parameter	= rate_box.data('rate-param');
			var rate_value	= 5 - $(this).parent().children('i').index($(this));
			var theme_id	= rate_box.parent().data('theme-id');
			var status_icon	= rate_box.find('.rate-result i');
			status_icon.addClass('fa-circle-o-notch fa-spin');
			$.ajax({
				type: "POST",
				url: ajaxurl,
				data: { 
					action:'theme_review',
					param:parameter ,
					value:rate_value,
					theme_id:theme_id
				},
				dataType: 'html'
			})
			.done(function( result ) {
				console.log(result)
				status_icon.removeClass('fa-circle-o-notch fa-spin');
				if(result != 1 && result != ''){
					status_icon.addClass('fa-exclamation-triangle');
				}else{
					status_icon.addClass('fa-check').css('color','green');
					var width = rate_value * 100/5;
					rate_box.find('span.rate-bg').css('width',width + '%');
				}
			})
			.fail(function( jqXHR, textStatus ) {
				console.log( "Request failed: " + textStatus , jqXHR);
			});
		});
		
		//Deals page
		$('.page-section.deals-page').on('click',function(e){
			$('.moveable-box').addClass('deals-to-right');
		});
		$('.deals-box').on('click',function(e){
			$('.moveable-box').removeClass('deals-to-right');
			e.stopPropagation();
		});
		$(window).scroll(function(){
			$('.moveable-box').removeClass('deals-to-right');
		});
	});

})(jQuery);
/*==================================Analytics===============================*/
function ProductUpSell(handler) {
	productIds = JSON.parse($(handler).attr('data-upsell-products'));
	productIds = productIds.filter(function(value) {
	  return value != 0;
	});
	productIds = productIds.reverse();
	cart.addBasketExternal(handler,productIds);
}
function onProductClick(ev,product_json) {
	ga('ec:addProduct', product_json);
	ga('ec:setAction', 'click', {list: product_json.list});

	// Send click with an event, then send user to product page.
	ga('send', 'event', 'Themes', 'click', product_json.list);
}

function onProductLiveClick(ev,product_json) {
	if(typeof product_json.list !== 'undefined'){
		ga('ec:addProduct', product_json);
		ga('ec:setAction', 'click', {list: product_json.list});
	}

	// Send click with an event.
	ga('send', 'event', 'Themes', 'Live Demo', product_json.name);
	return true;
}

function ProductBuyNow(product_json){
	ga('ec:addProduct', product_json);
	ga('ec:setAction', 'add');
	var event_category = product_json.category == 'WordPress Theme' ? 'Themes' : 'Subscription';
	ga('send', 'event', event_category, 'Buy click', product_json.name);
}

function ProductDownload(product_json){
	ga('ec:addProduct', product_json);
	ga('ec:setAction', 'add');
	var event_category = product_json.category == 'WordPress Theme' ? 'Themes' : 'Subscription';
	ga('send', 'event', event_category, 'click', 'download');
}

jQuery(document).ready(function($){
	$('input[name=paysys_id]').change(function(){
		ga('ec:setAction','checkout_option', {
			'step': 2,
			'option':$(this).val()
		});
		ga('send', 'event', 'Checkout', 'Choose Pay Sys', $(this).val());
	});
	$('.am-cart-checkout-buttons-checkout').click(function(){
		ga('send', 'event', 'Checkout', 'click', 'Proceed to checkout');
		if($('input[name=paysys_id]:checked').val() == 'paypal'){
			ga('ec:setAction','checkout', {
				'step': 3,
			});
			ga('send', 'event', 'Checkout', 'click', 'Sent to Paypal');
		}
	});
});

function archive_themes_cta(event,cta_position){
	ga('send', 'event', 'Themes', 'click', 'Archive CTA', cta_position);
}

//Recaptcha===================================================
var recaptcha_lab;
var recaptcha_contact;

var recaptcha_init = function(){
	jQuery(document).ready(function($){

		var recaptcha_header_register;
		var recaptcha_amember_signup;
		
		var recaptchasitekey = '6LdLKfoSAAAAAAI_pa1Ox0LDvWyIeQqTYLKA_PT3';
		if($('#recaptcha-header-register').length)
			recaptcha_header_register = grecaptcha.render('recaptcha-header-register', {
					'sitekey'	:	recaptchasitekey,
				});
		if($('#recaptcha-amember-signup').length)
			recaptcha_amember_signup = grecaptcha.render('recaptcha-amember-signup', {
					'sitekey'	:	recaptchasitekey,
				});
		if($('#recaptcha-lab').length)
			recaptcha_lab = grecaptcha.render('recaptcha-lab', {
					'sitekey'	:	recaptchasitekey,
				});
		if($('#recaptcha-contact').length)
			recaptcha_contact = grecaptcha.render('recaptcha-contact', {
					'sitekey'	:	recaptchasitekey,
				});
	
		//header register recaptcha check
		/*$('.header-register').submit(function(event){
			if(grecaptcha.getResponse(recaptcha_header_register) == ""){
				var button = $(this).find('input[type=submit]');
				var button_init = button.val();
				button.val('Please validate reCaptcha');
				setTimeout(function(){button.val(button_init)},3000)
				event.preventDefault();
				return false;
			}else
				return true;
			event.preventDefault();
			return false;
		});
		//amember register recaptcha

		$('.am-signup-form input[type=submit]').on('click',function(event){
			console.log('submit click')
			var form = $(this).parents('form');
			if(!form.has('#recaptcha-amember-signup').length > 0)
				return true;
			if(grecaptcha.getResponse(recaptcha_amember_signup) == ""){
				var button = $(this);
				var button_init = button.val();
				button.val('Please validate reCaptcha');
				setTimeout(function(){button.val('Next')},3000)
				console.log('grecaptcha false')
			}else{
				console.log('grecaptcha true')
				return true;
			}
			event.preventDefault();
			return false;
		});*/

	});	//jQuery(document).ready end
}	//recaptcha_init end

/*============Create account social===========================*/
function login_fb_user(){
	var href = LoginUrl;
	var queryString = window.location.pathname;
	if( queryString && queryString.indexOf('amember_redirect_url') == -1 ){
		href = LoginUrl + '?fb_login=1&amember_redirect_url=' + queryString;
	}else{
		if ( href.indexOf('?') < 0 )
			href += '?fb_login=1';
		else
			href += '&fb_login=1';
	}
	window.location.href=href;
}
function create_social_account(social_data,button){
	var add_product = button.data('add-product');
	jQuery.ajax({
		url: ajaxurl,
		type: 'POST',
		data: {action:'create_account_fb',social_data : social_data, add_product:add_product},
		dataType: 'json',
		success: function(response) {
			console.log(response)
			login_fb_user()
		},
		error: function(jqXHR, textStatus, errorThrown){
			console.log(jqXHR, textStatus, errorThrown);
		}
	});
}

jQuery(document).ready(function($){
	/*$('.forum-sidebar li.sidebar-data a').on('click',function(event){
		event.preventDefault();
		var forumId = jQuery(this).attr('data-forum-id'),
			page = jQuery(this).attr('data-forum-page');
		$.ajax({
			url: ajaxurl,
			type: "POST",			
			data: { action: 'topics_load',
				    forum_id: forumId,
				    page: page },				
			success: function(result){
				if(result) {
					$('.forum-sidebar li.bbp-body').append(result);
					jQuery('.sidebar-data a').attr('data-forum-page', page + 1);
				} else {
					jQuery('li.sidebar-data').remove();
				}
				
			},
			error: function(jqXHR, textStatus, errorThrown){
				console.log(jqXHR, textStatus, errorThrown);
			}
		});
		return false;
	});*/

	var forumId = $( '.forum-sidebar.ajax-load > .bbp-topics [data-forum-id]' ).attr( 'data-forum-id' ),
		page = parseInt( $( '.forum-sidebar.ajax-load > .bbp-topics [data-forum-page]' ).attr( 'data-forum-page' ) ) + 1;

	$( '.forum-sidebar.ajax-load > .bbp-topics' ).on( 'scroll', function() {
		var scrollArea = $( '.forum-sidebar.ajax-load > .bbp-topics' );

		if( scrollArea.scrollTop() + scrollArea.innerHeight() >= scrollArea[0].scrollHeight ) {
            $.ajax({
				url: ajaxurl,
				type: "POST",			
				data: {
					action: 'topics_load',
					forum_id: forumId,
					page: page
				},				
				success: function( result ) {
					if( result ) {
						$( '.forum-sidebar.ajax-load > .bbp-topics > .bbp-body' ).append( result );
						page ++;
					}
				},
				error: function( jqXHR, textStatus, errorThrown ){
					console.log( jqXHR, textStatus, errorThrown );
				}
			});
        }
	});

	$('body').on('click','.fb-log-btn',function(e){
		e.preventDefault();
		var button = $(this)
		var button_init_val = $(this).text()
		FB.login(function(response) {
			console.log(response)
			if (response.status === 'connected') {
				// Logged into your app and Facebook.
				button.text('Fetching information...');
				FB.api('/me', function(response) {
					//console.log(response);
					if(typeof response.email == 'undefined'){
						alert('We need your email in order to create an account. Please allow email for the TeslaThemes application in FB dialog.')
						button.text('Try Again');
						FB.login(function(response) {
							//console.log(response)
							if (response.status === 'connected') {
								// Logged into your app and Facebook.
								button.text('Fetching information...');
								FB.api('/me', function(response) {
									//console.log(response);
									if(typeof response.email == 'undefined'){
										alert('We need your email in order to create an account. Please allow email for the TeslaThemes application in FB dialog.')
									}else{
										create_social_account(response,button);
									}
									button.text(button_init_val);
								})
							}
						},{auth_type: 'rerequest',scope:'email'})
					}else
						create_social_account(response,button);
				});
			} else if (response.status === 'not_authorized') {
				// The person is logged into Facebook, but not your app.
				document.getElementById('status').innerHTML = 'Please log ' +
				'into this app.';
			} else {
				// The person is not logged into Facebook, so we're not sure if
				// they are logged into this app or not.
				console.log('please log to fb')
			}
			
		},{scope: 'public_profile,email'});
		return false;
	});

	/*============Create account social end===========================*/

	/* ==================wordpress-themes infinite scroll ===================*/
	/*var theme_section = $('.themes-section.infinite');
	if(theme_section.length > 0){
		var post_type = !theme_section.data('post-type') ? 'theme' : theme_section.data('post-type');
		window.infinite_end = false;
		$('footer').hide();
		var theme_section_offset = theme_section.offset();
		var page = 2;
		var category = theme_section.data('category');
		var infinite_locked = false;
		$(window).scroll(function(){
			if( !infinite_locked && theme_section_offset.top + theme_section.innerHeight() - 700 <= $(document).scrollTop() + $(window).height()){
				infinite_locked = true;
				$.ajax({
					type: "POST",
					url: ajaxurl,
					data: { action:'wp_themes_infinite_scroll', page:page , category:category , post_type: post_type},
					dataType: 'html'
				})
				  .done(function( html ) {
					page++;
					$(html).appendTo(theme_section).hide().fadeIn(300,function(){
						if(window.infinite_end){
							$('footer').fadeIn(300);
						}else{
							infinite_locked = false;
						}
					});
					if(post_type == 'theme')
						ga('send', 'event', 'Themes', 'WP Themes', 'Infinite Scroll');
				})
				  .fail(function( jqXHR, textStatus ) {
					console.log( "Request failed: " + textStatus , jqXHR);
				});
			}
		});
	}*/
	//* wordpress-themes infinite scroll end */
	
	//* wordpress-themes lazzy load */
	$('.row[data-page]').appear();
	$('body').on('appear', '.row[data-page]' , function(e, $affected) {
		if(!$(this).data('first_appear')){
			$(this).data('first_appear',true);
			$(this).find('[src-img]').each(function(index,img){
				$(this).attr('src',$(this).attr('src-img'));
			});
		}
	});
	/* wordpress-themes lazzy load end */

	//ongoing themes===================================

	$('.ongoing-line-loading').appear();
	$('body').on('appear', '.ongoing-line-loading' , function(e, $affected) {
		if(!$(this).data('first_appear')){
			$(this).data('first_appear',true);
			var bar = $(this);
			var progress = bar.data('width-to');
			var progress_inversed = 100 - progress;
			var nr_holder = bar.find('.ongoing-procent i');
			var nr = 0;
			bar.width(progress_inversed + '%');
			setTimeout(function(){
				bar.addClass('tt-animated');
				setTimeout(function(){bar.find('span').css('transform','scale(1) translate(0)')},100);	
			},2500);
			var timer = setInterval(function(){
				if(nr <= progress){
					nr++;
					nr_holder.text(nr + '%');
				}else{
					clearInterval(timer)
				}
			},2500/progress);
		}
	});

	$('.dashboard-menu .tt-am-tabs #menu-content-category-2').click(function(){
		window.location.href = 'https://teslathemes.com/amember/content/WordPress+Themes.3';
	});

	//======================Countdow=====================
	if($('.giveaway-counter').length > 0){
		var cd_duedate = $('.giveaway-counter').data('end-date');
		var cd_start = new Date().getTime();
		var cd_end = new Date(cd_duedate).getTime();
		$('.giveaway-counter ul').countdown(cd_duedate, function(event) {
			$(this).html(event.strftime('<li>%D<span>Day%!d</span></li>'
										+ '<li>%H<span>Hour%!H</span></li>'
										+ '<li>%M<span>min</span></li>'
										+ '<li>%S<span>sec</span></li>'));
		});
	}

	$(document).ready(function(){
		setTimeout(function(){
			$('.pricing-section .row').animate({'opacity':'1'},200);
		},500);
	})

	//20 things you should know
	if($('body').hasClass('page-template-20things')){
		if(localStorage.getItem('20-things') || window.location.href.indexOf("unlocked") > -1){
			$('.things-closed')
				.removeClass('things-closed')
				.children('a').attr('data-toggle','tab');
		}
		$('.things-form').tt_subscription({
			success : function(result,config,form){
				$('.things-closed')
					.removeClass('things-closed')
					.children('a').attr('data-toggle','tab');
				localStorage.setItem('20-things',true);
			},
		});
	}

	//top bar subscribe
	if($('.tt-popup-bar').length){
		if(!localStorage.getItem('20-things')){
			$('.tt-popup-bar').removeClass('tt-up-up');
		}
		$('.tt-popup-bar-form').tt_subscription({
			success : function(result,config,form){
				localStorage.setItem('20-things',true);
				window.location.href = 'http://teslathemes.com/20-things/';
			},
		});
		$('.tt-popup-bar').on('click',function(e){
			$(this).toggleClass('tt-up-up');
			localStorage.setItem('20-things',true);
		});
		$('.tt-popup-bar *').click(function(e){
			e.stopPropagation();
		})
	}

	//Test Room
	$('.test-room-form').submit(function(e){
		var $but = $('.test-room-form .btn'),
			result_box = $('#test-room-result');
		e.preventDefault();
		console.log(tt_test_nonce);
		if($('#test_user_email').val()){
			$but
				.button('loading')
				.prop('disabled', true);
			
			result_box
				.fadeIn()
				.html('<p>Setting up test environment... <i class="fa fa-circle-o-notch fa-spin"></i></p>')
				.removeClass('alert-success alert-warning alert-danger alert-info')
				.addClass('alert-info');
			$.ajax({
				url: ajaxurl,
				method: "POST",
				dataType: "json",
				data: {
					action: 'create_test_site',
					email: $('#test_user_email').val(),
					template: tt_test_template,
					tt_test_site_nonce: tt_test_nonce,
					tt_source: tt_source,
				},
				success: function(result){
					console.log(result);
					$but.prop('disabled', false).button('reset');
					result_box.html("<p>"+result.message+"</p>").removeClass('alert-info').addClass('alert-' + result.result).fadeIn();
					if(result.result == 'success'){
						result_box.append('<p><b>Keep this tab open:</b> While you already can access the test site, please allow it a few more minutes to import media library. More info about import status in the dashboard right after you login.</p><p>After you test our theme please <a class="alert-link" href="https://insights.hotjar.com/s?siteId=46008&surveyId=6613" target="_blank">Send Feedback</a></p>')
						import_ajax("http://test.teslathemes.com/" + result.username +"/wp-admin/admin-ajax.php")
					}
				},
				error: function(error,message,jqXHR){
					console.error(error,message,jqXHR);
					$but.prop('disabled', false).button('reset');
					result_box.html('<p>Error</p>').addClass('alert-danger').fadeIn();
				}
			});
		}else{
			result_box.html('Please insert your email').addClass('alert-warning').fadeIn();
		}
	});

	function import_ajax(url){
		$.ajax({
			url: url,
			method: "POST",
			dataType: "jsonp",
			data: {
				action: 'tt_test_import_demo'
			},
			success: function(res){
				console.log(res);
				if(res.indexOf("This is required to enable file writing for js_composer") > -1 || res.indexOf("Welcome to the world of WooCommerce!") > -1
					|| res.indexOf("Call to undefined function is_plugin_active_for_network") > -1)  //if plugin pages redirecting ajax or VC error
					import_ajax(url)
			},
			error: function(error,message,jqXHR){
				console.error(error,message,jqXHR);
				if(jqXHR.indexOf('Gateway Time-out') > -1)
					import_ajax(url);
			}
		});
	}

	if( self == top ) {
	    console.log('Tesla is not in iframe');
	} else {
	    jQuery('body').addClass('tesla-iframe');
	}
});
function twitterLoaded(){
	twttr.ready(function(twttr) {
		twttr.events.bind('tweet', function (event) {
			setTimeout(function(){
				jQuery('.fb-hidden').slideDown('slow');
			},5000);
		});
	});
};

if(jQuery('.widget.widget-theme-price').length) {
	$( window ).on( 'scroll', function () {
		var widgetPos = $( '.widget.floating' )[0].getBoundingClientRect(),
			widget = $('.widget.widget-recommand');
		if( widgetPos.top > 30 ) {
			if( $( '#floating-box' ).hasClass( 'pin' ) ) {
				$( '#floating-box' ).removeClass( 'pin' );
				$( '#top-upsell' ).html( $( '#floating-box' ).html() );
			}
		} else {
			if( !$( '#floating-box' ).hasClass( 'pin' ) ) {
				$( '#floating-box' ).html( $( '#top-upsell' ).html() );
				$( '#floating-box' ).addClass( 'pin' );
			}
		}
	} )
}

// Sned URL to WPMatic
parent.postMessage( {"teslaURL": window.location.href}, '*' );