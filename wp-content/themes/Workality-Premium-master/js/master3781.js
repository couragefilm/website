(function($) {
	
		
	/// VARS
	var loaded = false;
	
	/// DETECT MOBILE
	var $doc = $(document),
	Modernizr = window.Modernizr;

	/// BACK BUTTONS ACTIVE
	$(window).bind('popstate', function(event) {
		var dlink = document.URL;
		dlink = dlink.split('#');
		if (!Modernizr.touch) {
			if(!loaded) {
				loaded = true;
				return;	
			}else{
				if(dlink[1]=='undefined') {
					window.location =location.pathname;
				}
			}
		}
	});
	
	
	var bid = 1;
	
	function updatelinks(m) {
		if(history.pushState && history.replaceState) {
			bid++;
			history.pushState({"id":bid}, '', m);
		}
	}
	
	/// LOAD SOCIAL SHARING PLUGINS
	function socialRevive() {
		$.ajax({ url: 'http://platform.twitter.com/widgets.js', dataType: 'script', cache:true});
		$.ajax({ url: 'http://platform.tumblr.com/v1/share.js', dataType: 'script', cache:true});
		$.ajax({ url: 'http://assets.pinterest.com/js/pinit.js', dataType: 'script', cache:true}); 
		$.ajax({ url: 'https://apis.google.com/js/plusone.js', dataType: 'script', cache:true}); 
	}
	
	
	Galleria.loadTheme(mdajaxurl.themeurl + '/js/galleria/galleria.classic.js');
	
	/// SLIDERS
	function reviveSliders() { 
		$('.flexslider').fitVids().flexslider({
			animation: mdajaxurl.flexanimation,
			slideshowSpeed: mdajaxurl.flex
		});
		
	   var galtiming = parseInt(mdajaxurl.gallery_slideshow_speed);
		
	   Galleria.run('.galleria', {
			autoplay:galtiming,
			transition: mdajaxurl.gallery_transition,
			transitionSpeed : mdajaxurl.gallery_transition_speed,
			debug:false,
			youtube:{
				modestbranding: 1,
				autohide: 1,
				color: 'white',
				hd: 1,
				rel: 0,
				showinfo: 0
			},
			vimeo:{
				title: 0,
				byline: 0,
				portrait: 0,
				color: 'aaaaaa'
			},
			extend: function() {
				var gallery = this; // "this" is the gallery instance
				$('.gallery_fullscreen').click(function() {
					gallery.toggleFullscreen(); // call the play method
				});
			},
			imageCrop: mdajaxurl.gallery_crop
		});
	}
			
			
			
	/// SCROLL TO
	function goToByScroll(id){
     	$('html,body').animate({scrollTop: $("#"+id).offset().top},'slow');
	}
	
	/// CLOSE MOBILE MENU 
	var menuclosed = true;
	function closeMobileMenu() { 
		$('.mobilemenu').animate({ left: '-75%' }, 0 );
	    $('a.navbarbutton').find('i').removeClass('menu-remove');
	    $('a.navbarbutton').find('i').addClass('menu-icon');
		menuclosed = true;
	}
	
	/// RESPONSIVE IMG
	function responsiveIMG() {
			$('#post-list img').each(function() { 
				var smalls = $(this).attr('data-small');
				var large = $(this).attr('data-large');
				if($(window).width() < 767) {
					$(this).attr('src',large);
				}else{
					$(this).attr('src',smalls);
				}
			});
	}
	
	
	/// POST COMMENT AJAX
	function postCommentAjax() {
	var commentform=$('#commentform'); // find the comment form
	$('<div class="statusmsg alert hidden" style="width:90%"><a href="#" class="closealert"><i class="icon-remove"></i></a><span></span></div>').insertBefore('#commentform p.form-submit'); // add info panel before the form to provide feedback or errors
	var statusdivmain=$('#commentform .statusmsg');
	var statusdiv=$('#commentform .statusmsg span'); // define the infopanel
	statusdivmain.hide();
	
	commentform.submit(function(){
	//serialize and store form data in a variable
	var formdata=commentform.serialize();
	//Add a status message
	statusdivmain.fadeIn();
	statusdiv.html('Processing...');
	//Extract action URL from commentform
	var formurl=commentform.attr('action');
	//Post Form with data
		$.ajax({
		type: 'post',
		url: formurl,
		data: formdata,
		error: function(XMLHttpRequest, textStatus, errorThrown){
		statusdiv.html('You might have left one of the fields blank, or be posting too quickly');
		statusdivmain.removeClass('alert-green');
		statusdivmain.addClass('alert-red');
		},
			success: function(data, textStatus){
				if(data=="success") {
					statusdiv.html('Thanks for your comment. We appreciate your response.');
					statusdivmain.removeClass('alert-red');
					statusdivmain.addClass('alert-green');
					setTimeout('location.reload(true)',2200);
				}else{
					statusdiv.html('Please wait a while before posting your next comment');
					statusdivmain.removeClass('alert-green');
					statusdivmain.addClass('alert-red');
				}
			}
		});
	return false;
	
	});
	}
	
	
	
$(function() { 	
       
	    /// CATEGORY LIST
		$('.fullnav.dropdown .menuwrapper').live({
			mouseenter:
			   function()
			   {
					$('ul',this).show();
			   },
			mouseleave:
			   function()
			   {
					$('ul',this).hide();
			   }
		   }
		);
		
			
		$('.fullnav.dropdown .menuwrapper a').live('click',function() { 
			$(this).parent().parent().hide();
		});
		/// TRIGGER RESPONSIVE IMG ONLOAD
		responsiveIMG() 
		
		/// RESIZE EVENTS
		var wwidth = $(window).width();
		$(window).resize(function() {
			if(wwidth != $(window).width()) {
				closeMobileMenu();
				responsiveIMG();
				wwidth = $(window).width();
			}
		});
		
		/// CLOSE ALERT
		$('.closealert').live('click', function(e) { 
			$(this).parent().slideUp(); 
			e.preventDefault();
		})
		 
		///	BACK TO TOP
		$(window).scroll(function() {
			if($(this).scrollTop() > 800) {
				if (!Modernizr.touch) {
					$('a.backtotop').fadeIn();
				}
			} else {
				if (!Modernizr.touch) {
				$('a.backtotop').fadeOut();
				}
			}
		});
		$('a.backtotop').live('click',function(e) { 
			$('html, body').animate({scrollTop:0}, 1000, "easeInOutExpo"); 
			e.preventDefault(); 
		});
		
		/// QUICKSLIDE
		$('a[href^="#quickslide_"]').live('click',function(e) {
			var pname = $(this).attr('href').replace('#quickslide_','');
			var ptitle = $(this).html();
			$('.ajaxloader').fadeIn();
		
				$.post(mdajaxurl.ajax,{action:'md_quickslide',ptitle:ptitle,pname:pname},function(data) {
					if(data!=0) { 
						$('.header_contact').html(data).slideDown('slow');
						closeMobileMenu();
						$(".fitvids").fitVids();
					}
				});
			
			$('.ajaxloader').fadeOut();	
			e.preventDefault();
		});
		
		
		/// WORKS ROLLOVER EFFECT  
		$('#post-list .project-item .imgdiv a').hover(function() { 
			$('span',this).stop().animate({"opacity": .4}); 
		},function() { 
			$('span',this).stop().animate({"opacity": 0}); 
		});   
	
	
	
	
		if(mdajaxurl.withajax==1) {
			
		
			/// GET POSTS
			$('a.getworks, .navigation-bottom-ajax a').live('click',function(e) { 
				var id = $(this).attr('data-id');
				var token = $(this).attr('data-token');
				var murl = $(this).attr('href');
				var type = $(this).attr('data-type');
				
				$('html, body').animate({scrollTop:0}, 'slow', "easeInOutExpo");
				
				$('.ajaxloader').fadeIn();
				$('.sliderdiv').slideUp();
				
				$.post(murl,function(data) { 
				
					$('#loadintothis').fadeOut('normal',function() { 
						
						var div = $('#loadintothis', $(data)).html();
							
						$('#loadintothis').html(div).fadeIn('normal',function() { 
						
							updatelinks(murl);
							$(".fitvids").fitVids();
							$('.ajaxloader').fadeOut(); 
							socialRevive(); 
							reviveSliders();
							
							if(type=='blog') {
								postCommentAjax();  
							}
						});
						
					});
					
			 	 });
			
				e.preventDefault();
			});
			
			
			
			$('a.getworks-showmsg').live({
				mouseenter:function() { 
				var title = $(this).attr('title');
					if($(window).width() > 500) {
						$(this).parent().find('span.pname').html(title);
					}
				},mouseleave:function() { 
				$(this).parent().find('span.pname').html('');
			}});
			
			
			
		
			/// POST FILTER
			$('.portfolio-cats-regular a').live('click',function(e) { 
				var cat = $(this).attr('data-rel');
				var murl = $(this).attr('href');
				var titles = $(this).attr('title');
				var th = $(this).attr('data-th');
				var rthis = $(this); 
				
				$('.ajaxloader').fadeIn();
				$('br.rowseperator').remove();
				$('#portfolio-cats a').removeClass('selected');
				$('#post-list div.project-item').stop(true, true).hide();
				
				
				if(cat=="all") {
					var wh = 'project-item';
				}else{
					var wh = cat;
				}
				
				if(murl=='') {  murl = document.URL+'#showall';}
				
				$('#mainworkscontainer').load(murl+' #post-list',function() { 
				
					$('#post-list div.'+wh).hide();
					$('.ajaxloader').fadeOut();
					
						var s=1;
						if (Modernizr.touch) {
						$('#post-list div.'+wh).show();
						}else{
						$('#post-list div.'+wh).each(function(index) {
							$(this).delay(250*index).fadeIn(300);
							if(s==th) {
							$('<br class="clear rowseperator" />').insertAfter(this);	
							s=0;
							}
							s++;
						});
						}	
						
						var uppertitle = titles.toUpperCase()

						$('.categoriesdd strong').html(' : ' + uppertitle);
						rthis.addClass('selected');
						if(murl) {
						  updatelinks(murl);
						}
				});
			
				e.preventDefault();
				return false;
			});
			
			$('select.reschangeblog').live('change',function(e) {
				window.location= $(this).val();
			});	
			
			$('select.reschange-regular').live('change',function(e) { 
				var murl = $(this).val();
				var cat = murl.split('/');
				cat = cat[cat.length-1]
				var th = 0
				
				$('.ajaxloader').fadeIn();
				$('#post-list div.project-item').stop(true, true).hide();
				
				
				if(cat=="all") {
					var wh = 'project-item';
				}else{
					var wh = cat;
				}
				
				
				if(murl=='') {  murl = document.URL+'#showall';}
				
				$('#mainworkscontainer').load(murl+' #post-list',function() { 
				
					$('#post-list div.project-item').hide();
					$('.ajaxloader').fadeOut();
						
						var s=1;
						if (Modernizr.touch) {
						$('#post-list div.project-item').show();
						}else{
						$('#post-list div.project-item').each(function(index) {
							$(this).delay(250*index).fadeIn(300);
							if(s==th) {
							$('<br class="clear rowseperator" />').insertAfter(this);	
							s=0;
							}
							s++;
						});
						}	
						
						responsiveIMG();
						
						if(murl) {
						//updatelinks(murl);
						}
				});
				
				e.preventDefault();
				return false;
			});
			
			
			/// POST FILTER ON FLY
			$('.portfolio-cats-ajax a').live('click',function(e) { 
				var cat = $(this).attr('data-rel');
				var murl = $(this).attr('href');
				var th = $(this).attr('data-th');
				
				$('br.rowseperator').remove();
				$('#portfolio-cats a').removeClass('selected');
				$('#post-list div.project-item').stop(true, true).hide();
					if(cat=="all") {
						var wh = 'project-item';
					}else{
						var wh = cat;
					}
						var s=1;
						if (Modernizr.touch) {
						$('#post-list div.'+wh).show();
						}else{
						$('#post-list div.'+wh).each(function(index) {
							$(this).delay(250*index).fadeIn(300);
							if(s==th) {
							$('<br class="clear rowseperator" />').insertAfter(this);	
							s=0;
							}
							s++;
						});
						}	
						
				$(this).addClass('selected');
				if(murl) {
				updatelinks(murl);
				}
				e.preventDefault();
				return false;
			});
			
			$('select.reschangeblog').live('change',function(e) {
				window.location= $(this).val();
			});	
			
			$('select.reschange-ajax').live('change',function(e) { 
				var cat = $(this).val();
				var th = 0
				
				$('br.rowseperator').remove();
				$('#portfolio-cats a').removeClass('selected');
				$('#post-list div.project-item').stop(true, true).hide();
					if(cat=="all") {
						var wh = 'project-item';
					}else{
						var wh = cat;
					}
						var s=1;
						if (Modernizr.touch) {
						$('#post-list div.'+wh).show();
						}else{
						$('#post-list div.'+wh).each(function(index) {
							$(this).delay(250*index).fadeIn(300);
							if(s==th) {
							$('<br class="clear rowseperator" />').insertAfter(this);	
							s=0;
							}
							s++;
						});
						}	
						
				e.preventDefault();
				return false;
			});
		
		
		
		
			
			
			/// POST COMMENT
			postCommentAjax();
			
		}
		
		
		/// FLEXSLIDER 
		reviveSliders()
		
		
		/// RESPONSIVE VIDEO
		$(".fitvids").fitVids();
		
		
		/// MOBILE MENU
		$(document).foundationTabs();
		
		$('a.navbarbutton').live('click',
		function(e) { 
		   if(menuclosed) {
		   $('.mobilemenu').css('left','0');
		   $(this).find('i').removeClass('menu-icon');
		   $(this).find('i').addClass('menu-remove');
		   menuclosed = false;
		   }else{
		   $('.mobilemenu').css('left','-75%');
		   $(this).find('i').removeClass('menu-remove');
		   $(this).find('i').addClass('menu-icon');
		   menuclosed = true;
		   }
		   e.preventDefault();
		});
	

	})

})(jQuery)


// Hide address bar on mobile devices
/*
	var $doc = $(document),
	Modernizr = window.Modernizr;

 if (Modernizr.touch) {
    $(window).load(function () {
      setTimeout(function () {
        window.scrollTo(0, 1);
      }, 0);
    });
  }
*/ 