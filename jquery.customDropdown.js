/**
 * jQuery customDropdown plugin
 * 
 * usage html
 * this plugin must be applied to a div containing a list item
 * <div class="customDropdown"><ul></ul></div>
 * 
 * usage javascript
 *	$(".customDropdown").customDropdown({
 *		debug: true,
 *		width: "300px",
 *		height: "300px",
 *	});
 *	
 * @name customDropdown
 * @author Antonio GIULIANA <a.giuliana@antoniogiuliana.it>
 */

(function($) {
	$.fn.extend({
        customDropdown: function(options) {
			var defaults = {
				debug: false,
				pathDefaultCss: "jquery.customDropdown.css",
				truncateText: false,
				textMaxLength: 100,			// only if truncate is true
				inputName: "customDropdown",
				titleDropdown: "",
				data: new Array(),
				selected: ""	// selected item
			};
			
			var options = $.extend(defaults, options),
				$cdBox, $cdTitle, $cdList, $cdItem,
				$allCdList = $(".cd-fake_dropdown ul"),
				$inputHidden = $('<input type="hidden" id="'+defaults.inputName+'" name="'+defaults.inputName+'" />');
			
			return this.each(function() {
				$cdBox = $(this);
				$cdTitle = $(".cdDescr", this);
				$cdList = $("ul", this);
				$cdItem = $("ul li", this);
				
				init($cdBox);
			});
			
			/**
			 * constructor
			 */
			function init(el) {
				if (options.debug) { console.log("customDropdown plugin init"); }
				
				// attach stylesheet
				if (options.pathDefaultCss != "") {
					var css = $("<link>");
					if (defaults.debug) { var ts = new Date().getTime(); options.pathDefaultCss = options.pathDefaultCss+"?"+ts; }
					css.attr({
						rel:  "stylesheet",
						type: "text/css",
						href: options.pathDefaultCss
					});
					$("head").append(css);
				}
				
				if (options.data.length !== 0) {populateCd();}
				
				// set the title of the dropdown
				if (options.titleDropdown != "") {
					$cdTitle.text(options.titleDropdown);
				} else {
					onClick($cdItem.first());		// get the first element of the list
				}
				$cdList.hide();
				if (el.find("input[id="+defaults.inputName+"]").length < 1) el.append($inputHidden);
				enableKeyNav();
				
				// events
				destroy();
				if (options.selected != "") { onClick($("li[rel='"+options.selected+"']")); }		// auto selecting option
				$cdTitle.click(function(e) { onOpen(); e.stopPropagation(); });					// open dropdown
				$cdItem.live("click", function(e) { onClick($(this)); e.stopPropagation(); });	// click option
				$(document).click(function(e) { onClose($(this)); e.stopPropagation(); });				// click outside to close
			}
			
			/**
			 * opening of fake select
			 */
			function onOpen() {
				if ($cdList.is(":visible")) {
					if (options.debug) { console.log("closing dropdown"); }
					$cdList.slideUp();
				} else {
					if (options.debug) { console.log("opening dropdown"); }
					$allCdList.hide();
					$cdList.slideDown();
					$cdList.focus();
				}
			}
			
			/**
			 * select the item
			 */
			function onSelect(el) {
				if (options.debug) { console.log("selecting option "+el.attr("rel")); }
				//$(strCdBox+" ul li").removeClass('selected');
				$("ul li", $cdBox).removeClass('selected');
				el.addClass("selected");
			}
			
			/**
			 * click on fake option
			 * 
			 * @param el clicked object
			 */
			function onClick(el) {
				if (options.debug) { console.log("clicking option "+el.attr("rel")); }
				onSelect(el);
				$cdTitle.html(el.html());		// replace the label with selected option
				$inputHidden.val(el.attr("rel")).change();
				if (options.debug) { console.log("new input value "+$inputHidden.val()); }
				$cdList.slideUp();
				if (typeof options.clickCallback == 'function') options.clickCallback.call(this);
				return false;
			}
			
			function onClose(e) {
				if (!$(e.target).parents().andSelf().is(e) && $cdList.is(":visible")) {
					if (options.debug) { console.log("clicking outside"); }
					$cdList.hide();
				}
			}
			
			/**
			 * enable navigation with keyboard
			 */
			function enableKeyNav() {
				$(document).keyup(function (e) {
					if ($cdList.is(":visible")) {
						var keynum;
						if(window.e) { keynum = e.keyCode; }  // IE
						else if(e.which) { keynum = e.which; }    // Others

						var objSelectedItem = $(".selected", $cdBox),
							objNextItem = objSelectedItem.next().attr("rel") == undefined ? $cdItem.last() : objSelectedItem.next(),
							objPrevItem = objSelectedItem.prev().attr("rel") == undefined ? $cdItem.first() : objSelectedItem.prev();

						if(keynum === 38) { onSelect(objPrevItem); }		// up
						if(keynum === 40) {	onSelect(objNextItem); }		// down
						if(keynum === 13) { onClick(objSelectedItem); }		// enter
						if(keynum === 27) { onClose(e); }			// esc

						if (options.debug) {
							console.log("objSelectedItem: "+objSelectedItem.attr("rel")+" - objNextItem: "+objNextItem.attr("rel")+" - objPrevItem: "+objPrevItem.attr("rel")+" - pressed: " + keynum);
						}
					}
					e.stopPropagation();
				});
			}
			
			/**
			 * populate the dropdown with passed data
			 * (doesn't work if there are already items)
			 */
			function populateCd() {
				if (options.debug) { console.log("populating dropdown"); }
				
				$.each(options.data, function (index, item) {
                    if (item.selected) onClick($("li rel['"+item.id+"']"));
					
					// truncate
					if (options.truncate && item.text.length > options.textMaxLength) {
						item.text = item.text.slice(0, options.textMaxLength)+"...";
					}
					
                    $cdList.append('<li class="fake_option" rel="'+item.id+'">'+item.text+'</li>');
                });
			}
			
			/**
			 * destroy events
			 */
			function destroy() {
				if (options.debug) { console.log("destroing events"); }
				$cdTitle.unbind("click");
				$cdItem.unbind("click");
			}
        }
    });
})(jQuery);
