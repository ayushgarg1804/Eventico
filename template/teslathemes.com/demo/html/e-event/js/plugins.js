(function ( $ ) {

	"use strict";

	$.tesla_responsive = function( options ) {

		var $window;

		var length;

		var index;

		var previous;

		var resize;

		if ($.isArray(options)) {

		    $window = $(window);

		    length = options.length;

		    if(length){

		    	options.sort(function(a, b){

		    		return b.width - a.width;

		    	});

		    	resize = function () {

		    	    var width = $window.width();

		    	    var i = 0;

		    	    while(i < length && width < options[i].width){

		    	    	i++;

		    	    }

		    	    index = i < length ? i : undefined;

		    	    if (previous !== index) {

		    	        previous = index;

		    	        if(undefined !== index){

		    	        	options[index].action();

		    	        }

		    	    }

		    	};

		    	$window.resize(resize);

		    	resize();

		    }

		}

		return resize;

	};
	
	$.fn.tesla_slider = function( options ) {

		return this.each(function(i, e){

			var $e = $(e);

			var settings = $.extend({

				item: '.item',
				next: '.next',
				prev: '.prev',
				container: $e,
				autoplay: true,
				autoplaySpeed: 4000,
				autoplayResume: 4000,
				bullets: '[data-tesla-plugin="bullets"]',
				//active: 'active' //class for current slide - to be implemented

			},options,{

				item: $e.attr('data-tesla-item'),
				next: $e.attr('data-tesla-next'),
				prev: $e.attr('data-tesla-prev'),
				container: $e.attr('data-tesla-container'),
				autoplay: $e.attr('data-tesla-autoplay')!=="false",
				autoplaySpeed: $e.attr('data-tesla-autoplay-speed') ? parseInt($e.attr('data-tesla-autoplay-speed'), 10) : $e.attr('data-tesla-autoplay-speed'),
				autoplayResume: $e.attr('data-tesla-autoplay-resume') ? parseInt($e.attr('data-tesla-autoplay-resume'), 10) : this.autoplaySpeed,
				bullets: $e.attr('data-tesla-bullets'),
				active: $e.attr('data-tesla-active')

			});

			var container = settings.container instanceof jQuery ? settings.container : $e.find(settings.container);

			var items = container.find(settings.item);

			var bullets = $e.find(settings.bullets);

			var next = $e.find(settings.next);

			var prev = $e.find(settings.prev);

			var max = items.length - 1;

			var index = 0;

			var prev_action;

			var next_action;

			var goto_action;

			var process;

			var process_first;

			var autoplay_interval;

			var autoplay_timeout;

			var autoplay_play;

			var autoplay_stop;

			var autoplay_resume;

			var imagesLoaded_object;

			var imagesLoaded_progress;

			if(max <= 0) return;

			tesla_set_option($e, 'slider', 'tesla_remove', 'removed', false);

			prev_action = function(){

				var index_old = index;
				var index_new;

				index--;

				if( index < 0 )
					index = max;

				index_new = index;

				container.css({
					height: Math.max(items.eq(index_old).outerHeight(true), items.eq(index_new).outerHeight(true))
				});

				items.eq(index_old).stop(true, true).fadeOut(1000, function(){
					
				});
				items.eq(index).stop(true, true).fadeIn(1000, function(){
					container.css({
						height: items.eq(index_new).outerHeight(true)
					});
				});

				bullets.trigger('teslaSliderChange', {'index': index});

			};

			next_action = function(){

				var index_old = index;
				var index_new;

				index++;

				if( index > max )
					index = 0;

				index_new = index;

				container.css({
					height: Math.max(items.eq(index_old).outerHeight(true), items.eq(index_new).outerHeight(true))
				});

				items.eq(index_old).stop(true, true).fadeOut(1000, function(){

				});
				items.eq(index).stop(true, true).fadeIn(1000, function(){
					container.css({
						height: items.eq(index_new).outerHeight(true)
					});
				});

				bullets.trigger('teslaSliderChange', {'index': index});

			};

			goto_action = function(goto_index){

				if(goto_index === index) return;

				var index_old = index;
				var index_new;

				index = goto_index;

				if( index > max )
					index = 0;

				if( index < 0 )
					index = max;

				index_new = index;

				container.css({
					height: Math.max(items.eq(index_old).outerHeight(true), items.eq(index_new).outerHeight(true))
				});

				items.eq(index_old).stop(true, true).fadeOut(1000, function(){

				});
				items.eq(index).stop(true, true).fadeIn(1000, function(){
					container.css({
						height: items.eq(index_new).outerHeight(true)
					});
				});

				bullets.trigger('teslaSliderChange', {'index': index});

			};

			process_first = function(){

				container.css({
					position: 'relative',
					height: items.eq(index).outerHeight(true)
				});
				items.css({
					position: 'absolute',
					top: 0,
					left: 0,
					right: 0
				});
				items.filter(':gt(0)').css({
					display: 'none'
				});

				$(window).resize(function(){

					container.css({
						height: items.eq(index).outerHeight(true)
					});

				});

			};

			process = function(){

				process_first();

				prev.click(function(ev){

					autoplay_stop();
					prev_action();
					autoplay_resume();

					if(ev.preventDefault)
						ev.preventDefault();
					else
						return false;

				});
				tesla_set_option($e, 'slider', 'prev', 'event', prev);

				next.click(function(ev){

					autoplay_stop();
					next_action();
					autoplay_resume();

					if(ev.preventDefault)
						ev.preventDefault();
					else
						return false;

				});
				tesla_set_option($e, 'slider', 'next', 'event', next);

				bullets.on('teslaBulletsClick', function(ev, data){

					autoplay_stop();
					goto_action(data.index);
					autoplay_resume();

					if(ev.preventDefault)
						ev.preventDefault();
					else
						return false;

				});
				tesla_set_option($e, 'slider', 'bullets', 'bullets', bullets);

				items.hover(function(){

					autoplay_stop();

				},function(){

					autoplay_stop();
					autoplay_resume();

				});

				autoplay_play = function(){

					if(!settings.autoplay) return;

					autoplay_interval = setInterval(next_action, settings.autoplaySpeed);

					tesla_set_option($e, 'slider', 'autoplay_interval', 'interval', autoplay_interval);

				};

				autoplay_stop = function(){

					if(!settings.autoplay) return;

					clearInterval(autoplay_interval);
					clearTimeout(autoplay_timeout);

				};

				autoplay_resume = function(){

					if(!settings.autoplay) return;

					autoplay_timeout = setTimeout(autoplay_play, settings.autoplayResume);

					tesla_set_option($e, 'slider', 'autoplay_timeout', 'timeout', autoplay_timeout);

				};

				autoplay_play();

			};

			// process_first();

			if(imagesLoaded){

				imagesLoaded(container[0], function(){

					if(!tesla_get_option($e, 'slider', 'tesla_remove').value)
						process();

				});

			}else{

				process();

			}

		});

	};

	$.fn.tesla_masonry = function( options ) {

		return this.each(function(i, e){

			var $e = $(e);

			var settings = $.extend({

				filters: '[data-tesla-plugin="filters"]'

			},options,{

				filters: $e.attr('data-tesla-filters')

			});

			var filters = $(settings.filters);

			var items = $e.children();

			var process;

			tesla_set_option($e, 'masonry', 'tesla_remove', 'removed', false);

			process = function(){

				$e.masonry();

				if(filters.length){

					filters.on('teslaFiltersChange', function(ev, data){

						var i;

						var n = data.categories.length;

						var selector = '';

						var masonry_object = $e.data('masonry');

						for(i=0; i<n; i++){

							if(i)
								selector += ', ';

							selector += '.' + data.categories[i];

						}

						if(''===selector){

							masonry_object.options.itemSelector = undefined;

							items.stop(true, true).fadeIn(400);

						}else{

							masonry_object.options.itemSelector = selector;

							items.stop(true, true);

							items.filter(selector).fadeIn(400);

							items.not(selector).fadeOut(400);

						}

						masonry_object.reloadItems();

						masonry_object.layout();

					});
					tesla_set_option($e, 'masonry', 'filters', 'filters', filters);

				}

			};

			if($.fn.masonry){

				if(imagesLoaded){

					imagesLoaded(e, function(){

						if(!tesla_get_option($e, 'masonry', 'tesla_remove').value)
							process();

					});

				}else{

					process();

				}

			}

		});

	};

	$.fn.tesla_filters = function( options ) {

		return this.each(function(i, e){

			var $e = $(e);

			var settings = $.extend({

				categories: '[data-category]'

			},options,{

				categories: $e.attr('data-tesla-category')

			});

			var categories = $e.find(settings.categories);

			categories.click(function(ev){

				var t = $(this);

				var cat_array;

				if(t.hasClass('active')){

					if(''===t.attr('data-category')){

						categories.filter('[data-category=""]').removeClass('active');

						categories.filter('[data-category!=""]').addClass('active');

					}else{

						categories.filter(t).removeClass('active');

						if(!categories.filter('.active').length)
							categories.filter('[data-category=""]').addClass('active');
						
					}

				}else{

					if(''===t.attr('data-category')){

						categories.filter('[data-category=""]').addClass('active');

						categories.filter('[data-category!=""]').removeClass('active');

					}else{

						categories.filter('[data-category=""]').removeClass('active');

						categories.filter(t).addClass('active');
						
					}

				}

				cat_array = categories.filter('.active[data-category!=""]').map(function(){

					return $(this).attr('data-category');

				}).get();

				$e.trigger('teslaFiltersChange', {'categories': cat_array});

				if(ev.preventDefault)
					ev.preventDefault();
				else
					return false;

			});
			tesla_set_option($e, 'filters', 'categories', 'event', categories);

		});

	};

	$.fn.tesla_bullets = function( options ) {

		return this.each(function(i, e){

			var $e = $(e);

			var settings = $.extend({

				bullets: '>*',
				hover: false

			},options,{

				bullets: $e.attr('data-tesla-selector'),
				hover: $e.attr('data-tesla-hover')

			});

			var bullets = $e.find(settings.bullets);

			var hover = '0' === settings.hover || ( 'string' === typeof(settings.hover) && 'false' === settings.hover.toLowerCase() ) ? false : Boolean(settings.hover);

			var action = function(ev){

				$e.trigger('teslaBulletsClick', {'index': bullets.index(this)});

			};

			bullets.eq(0).addClass('active');

			bullets.click(action);
			tesla_set_option($e, 'bullets', 'bullets', 'event', bullets);

			if(hover) bullets.mouseover(action);

			$e.on('teslaSliderChange', function(ev, data){

				bullets.filter('.active').removeClass('active');

				bullets.eq(data.index).addClass('active');

			});
			tesla_set_option($e, 'bullets', 'e', 'event', $e);

		});

	};

	$.fn.tesla_carousel = function( options ) {

		return this.each(function(i, e){

			var $e = $(e);

			var settings = $.extend({

				item: '.item',
				next: '.next',
				prev: '.prev',
				container: $e,
				rotate: true,
				autoplay: true,
				hideEffect: true,
				autoplaySpeed: 4000,
				autoplayResume: 4000

			},options,{

				item: $e.attr('data-tesla-item'),
				next: $e.attr('data-tesla-next'),
				prev: $e.attr('data-tesla-prev'),
				container: $e.attr('data-tesla-container'),
				rotate: $e.attr('data-tesla-rotate'),
				autoplay: $e.attr('data-tesla-autoplay'),
				hideEffect: $e.attr('data-tesla-hide-effect'),
				autoplaySpeed: $e.attr('data-tesla-autoplay-speed') ? parseInt($e.attr('data-tesla-autoplay-speed'), 10) : $e.attr('data-tesla-autoplay-speed'),
				autoplayResume: $e.attr('data-tesla-autoplay-resume') ? parseInt($e.attr('data-tesla-autoplay-resume'), 10) : this.autoplaySpeed,

			});

			var container = settings.container instanceof jQuery ? settings.container : $e.find(settings.container);

			var items = container.find(settings.item);

			var next = $e.find(settings.next);

			var prev = $e.find(settings.prev);

			var max;

			var visible;

			var index = 0;

			var prev_action, prev_action_move;

			var next_action, next_action_move;

			var action_0, action_768, action_992, action_1200, action_responsive, action_adjust;

			var process;

			var responsive;

			var item_width;

			var item_height;

			var rotate = '0' === settings.rotate || ( 'string' === typeof(settings.rotate) && 'false' === settings.rotate.toLowerCase() ) ? false : Boolean(settings.rotate);

			var rotate_interval;

			var autoplay = '0' === settings.autoplay || ( 'string' === typeof(settings.autoplay) && 'false' === settings.autoplay.toLowerCase() ) ? false : Boolean(settings.autoplay);

			var hide_effect = '0' === settings.hideEffect || ( 'string' === typeof(settings.hideEffect) && 'false' === settings.hideEffect.toLowerCase() ) ? false : Boolean(settings.hideEffect);

			var autoplay_interval, autoplay_timeout;

			var autoplay_start, autoplay_stop, autoplay_resume;

			var responsive_resize;

			tesla_set_option($e, 'carousel', 'tesla_remove', 'removed', false);

			container = container.wrapInner('<div>').children();

			tesla_set_option($e, 'carousel', 'container', 'wrapper', container);

			autoplay_start = function(){

				if(!autoplay) return;

				autoplay_stop();

				if(undefined !== rotate_interval)
					autoplay_interval = 0;
				else{
					autoplay_interval = setInterval(next_action, settings.autoplaySpeed);
					tesla_set_option($e, 'carousel', 'autoplay_interval', 'interval', autoplay_interval);
				}

			};

			autoplay_stop = function(){

				if(!autoplay) return;

				clearInterval(autoplay_interval);
				autoplay_interval = undefined;

				clearTimeout(autoplay_timeout);
				autoplay_timeout = undefined;

			};

			autoplay_resume = function(){

				if(!autoplay) return;

				autoplay_stop();

				if(undefined !== rotate_interval)
					autoplay_timeout = 0;
				else{
					autoplay_timeout = setTimeout(autoplay_start, settings.autoplayResume);
					tesla_set_option($e, 'carousel', 'autoplay_timeout', 'timeout', autoplay_timeout);
				}

			};

			prev_action_move = function(){

				if(index > 0){

					if(hide_effect)
						items.eq(index + visible - 1).css({

							'-webkit-transform': 'scale(0)',
							'-moz-transform': 'scale(0)',
							'-ms-transform': 'scale(0)',
							'-o-transform': 'scale(0)',
							'transform': 'scale(0)'

						});

					if(!autoplay && index === max){

						next.removeClass('disabled');

					}

					index--;

					if(!autoplay && index === 0){

						prev.addClass('disabled');

					}

					if(hide_effect)
						items.eq(index).css({

							'-webkit-transform': 'scale(1)',
							'-moz-transform': 'scale(1)',
							'-ms-transform': 'scale(1)',
							'-o-transform': 'scale(1)',
							'transform': 'scale(1)'

						});

					container.css({ left: String( - index * 100 / visible ) + '%'  });

					return true;

				}else return false;

			};

			prev_action = function(){

				if(undefined !== rotate_interval) return;

				if(prev_action_move()){

					// good

				}else{

					if(rotate && index < max){

						clearInterval(rotate_interval);

						rotate_interval = setInterval(function(){

							if(!next_action_move()){

								clearInterval(rotate_interval);
								rotate_interval = undefined;

							}

						}, 200);
						tesla_set_option($e, 'carousel', 'rotate_interval', 'interval', rotate_interval);

					}

				}

			};

			next_action_move = function(){

				if(index < max){

					if(hide_effect)
						items.eq(index).css({

							'-webkit-transform': 'scale(0)',
							'-moz-transform': 'scale(0)',
							'-ms-transform': 'scale(0)',
							'-o-transform': 'scale(0)',
							'transform': 'scale(0)'

						});

					if(!autoplay && index === 0){

						prev.removeClass('disabled');

					}

					index++;

					if(!autoplay && index === max){

						next.addClass('disabled');

					}

					if(hide_effect)
						items.eq(index + visible - 1).css({

							'-webkit-transform': 'scale(1)',
							'-moz-transform': 'scale(1)',
							'-ms-transform': 'scale(1)',
							'-o-transform': 'scale(1)',
							'transform': 'scale(1)'

						});

					container.css({ left: String( - index * 100 / visible ) + '%'  });

					return true;

				}else return false;

			};

			next_action = function(){

				if(undefined !== rotate_interval) return;

				if(next_action_move()){

					// good

				}else{

					if(rotate && index > 0){

						clearInterval(rotate_interval);

						clearInterval(autoplay_interval);
						clearTimeout(autoplay_timeout);

						rotate_interval = setInterval(function(){

							if(!prev_action_move()){

								clearInterval(rotate_interval);
								rotate_interval = undefined;

								if(undefined !== autoplay_interval) autoplay_start();
								if(undefined !== autoplay_timeout) autoplay_resume();

							}

						}, 200);
						tesla_set_option($e, 'carousel', 'rotate_interval', 'interval', rotate_interval);

					}

				}

			};

			action_0 = function(){

				// console.log('0-767');

			    action_responsive();

			};

			action_768 = function(){

				// console.log('768-991');

			    action_responsive();

			};

			action_992 = function(){

				// console.log('992-1199');

			    action_responsive();

			};

			action_1200 = function(){

				// console.log('1200+');

			    action_responsive();

			};

			action_responsive = function(){

				item_height = Math.max.apply(null, items.map(function(){

					return $(this).outerHeight(true);

				}).get());

			    item_width = items.outerWidth(true);

			    visible = Math.round( container.width() / item_width );

			    max = Math.max(items.length - visible, 0);

			    index = Math.min(index, max);

			    if(!max){

			    	prev.addClass('disabled');
			    	next.addClass('disabled');

			    }else{

			    	if(!autoplay && index === 0)
			    		prev.addClass('disabled');
			    	else
			    		prev.removeClass('disabled');

			    	if(!autoplay && index === max)
			    		next.addClass('disabled');
			    	else
			    		next.removeClass('disabled');

			    }

				container.css({

					position: 'relative',
					height: item_height,
					'-webkit-transition': 'left 0.4s ease-out',
					'-moz-transition': 'left 0.4s ease-out',
					'-ms-transition': 'left 0.4s ease-out',
					'-o-transition': 'left 0.4s ease-out',
					'transition': 'left 0.4s ease-out',
					left: String( - index * 100 / visible ) + '%'

				});

				items.css({

					position: 'absolute',
					top: 0,
					'-webkit-transition': '-webkit-transform 0.4s ease-out',
					'-moz-transition': '-webkit-transform 0.4s ease-out',
					'-ms-transition': '-webkit-transform 0.4s ease-out',
					'-o-transition': '-webkit-transform 0.4s ease-out',
					'transition': '-webkit-transform 0.4s ease-out'

				}).each(function(i){

					$(this).css({ left: String( i * 100 / visible ) + '%'  });

				});

				action_adjust();

			};

			action_adjust = function(){

				if(hide_effect){

					items.filter(':gt('+String(visible)+'),:eq('+String(visible)+'),:lt('+String(index)+')').css({
						'-webkit-transform': 'scale(0)',
						'-moz-transform': 'scale(0)',
						'-ms-transform': 'scale(0)',
						'-o-transform': 'scale(0)',
						'transform': 'scale(0)'
					});

					items.filter(':gt('+String(index)+'):lt('+String(visible)+'),:eq('+String(index)+')').css({
						'-webkit-transform': 'scale(1)',
						'-moz-transform': 'scale(1)',
						'-ms-transform': 'scale(1)',
						'-o-transform': 'scale(1)',
						'transform': 'scale(1)'
					});

				}

			};

			responsive = [ { width: 0, action: action_0 }, { width: 768, action: action_768 }, { width: 992, action: action_992 }, { width: 1200, action: action_1200 } ];

			process = function(){

				responsive_resize = $.tesla_responsive(responsive);
				tesla_set_option($e, 'carousel', 'responsive_resize', 'responsive', responsive_resize);

				prev.click(function(ev){

					autoplay_stop();
					autoplay_resume();

					prev_action();

					if(ev.preventDefault)
						ev.preventDefault();
					else
						return false;

				});
				tesla_set_option($e, 'carousel', 'prev', 'event', prev);

				next.click(function(ev){

					autoplay_stop();
					autoplay_resume();

					next_action();

					if(ev.preventDefault)
						ev.preventDefault();
					else
						return false;

				});
				tesla_set_option($e, 'carousel', 'next', 'event', next);

				items.click(function(ev){

					autoplay_stop();
					autoplay_resume();

				});

				items.hover(function(ev){

					autoplay_stop();

				},function(ev){

					autoplay_stop();
					autoplay_resume();

				});
				tesla_set_option($e, 'carousel', 'items', 'event', items);

				autoplay_start();

			};

			if(imagesLoaded){

				imagesLoaded(container[0], function(){

					if(!tesla_get_option($e, 'carousel', 'tesla_remove').value)
						process();

				});

			}else{

				process();

			}

		});

	};

	$.fn.tesla_news_ticker = function( options ) {

		return this.each(function(i, e){

			var $e = $(e);

			var settings = $.extend({

				speed: 20,
				item: '.item',
				container: $e

			},options,{

				speed: $e.attr('data-tesla-speed'),
				item: $e.attr('data-tesla-item'),
				container: $e.attr('data-tesla-container')

			});

			var container = settings.container instanceof jQuery ? settings.container : $e.find(settings.container);

			var items = container.find(settings.item);

			var process;

			if(!items.length) return;

			process = function(){

				var items_width;

				var items_clone;

				var aloz;

				container.css({
					overflow: 'hidden'
				});

				container = items.wrapAll('<div>').parent().addClass('no-style');

				container.css({
					overflow: 'hidden'
				});

				items_clone = items.eq(0).clone();

				items.last().after(items_clone);

				items = items.add(items_clone);

				items = items.wrap('<div>').parent().addClass('no-style');

				items.css({
					float: 'left',
					overflow: 'hidden'
				});

				items_width = 0;

				items.each(function(i, e){
					items_width += $(e).width();
				});

				items_width += items.length;

				container.css({
					width: items_width
				});

				aloz = function(){

					var item_current;
					var item_current_width;

					var wei = function(){

						item_current = items.parent().children().first();
						item_current_width = item_current.width();

					};

					var dara = function(){

						var item_current_margin = parseInt(item_current.css('margin-left'), 10) || 0;
						var item_current_distance = item_current_width+item_current_margin;

						item_current.animate({
							marginLeft: -item_current_width
						},{
							duration: item_current_distance*settings.speed,
							easing: 'linear',
							queue: false,
							start: function(){
								tesla_set_option($e, 'news_ticker', 'item_current', 'animation', item_current);
							},
							done: function(){
								item_current.css({
									display: 'none',
									marginLeft: 0
								}).appendTo(item_current.parent()).css({
									display: 'block'
								});
								wei();
								dara();
							}
						});

					};

					wei();
					dara();

					items.hover(function(){
						item_current.stop();
					},function(){
						dara();
					});

				};

				setTimeout(aloz, 1000);

			};

			process();

		});

	};
	
	$.fn.tesla_remove = function() {

		return this.each(function(i, e){

			var $e = $(e);

			var options = tesla_get_options($e);

			var plugin, key;

			if(undefined!==options){

				for(plugin in options){

					if(undefined!==options[plugin]){

						tesla_set_option($e, plugin, 'tesla_remove', 'removed', true);

						for(key in options[plugin]){

							switch(options[plugin][key].type){

								case 'interval':
									clearInterval(options[plugin][key].value);
									break;

								case 'timeout':
									clearTimeout(options[plugin][key].value);
									break;

								case 'event':
									$(options[plugin][key].value).unbind().off();
									break;

								case 'bullets':
									$(options[plugin][key].value).unbind().off().tesla_remove();
									break;

								case 'filters':
									$(options[plugin][key].value).unbind().off().tesla_remove();
									break;

								case 'responsive':
									$(window).unbind('resize', options[plugin][key].value);
									break;

								case 'wrapper':
									$(options[plugin][key].value).contents().unwrap();
									break;

								case 'animation':
									$(options[plugin][key].value).stop();
									break;

								default:

							}

						}

					}

				}

			}

		});

	};

	$(function(){

		$('[data-tesla-plugin="slider"]').tesla_slider();

		$('[data-tesla-plugin="carousel"]').tesla_carousel();

		$('[data-tesla-plugin="masonry"]').tesla_masonry();

		$('[data-tesla-plugin="filters"]').tesla_filters();

		$('[data-tesla-plugin="bullets"]').tesla_bullets();

		$('[data-tesla-plugin="news_ticker"]').tesla_news_ticker();

	});

	function tesla_get_options($e){

		return $($e).data('tesla_themes');

	}

	function tesla_get_option($e, $plugin, $key){

		var $data = $($e).data('tesla_themes');

		var $result = undefined;

		if(undefined!==$data && undefined!==$data[$plugin] && undefined!==$data[$plugin][$key]){

			$result = $data[$plugin][$key];

		}

		return $result;

	}

	function tesla_set_option($e, $plugin, $key, $type, $value){

		var $data;
		$e = $($e);
		$data = $e.data('tesla_themes');

		if(undefined===$data){

			$data = {};

			$data[$plugin] = {};

			$data[$plugin][$key] = {'type': $type, 'value': $value};

		}else{

			if(undefined===$data[$plugin]){

				$data[$plugin] = {};

				$data[$plugin][$key] = {'type': $type, 'value': $value};

			}else{

				$data[$plugin][$key] = {'type': $type, 'value': $value};

			}

		}

		$e.data('tesla_themes', $data);
		
	}

}( jQuery ));