customDropdown Jquery Plugin
============================

##Author##
Antonio GIULIANA<br />
www.antoniogiuliana.it<br />
a.giuliana@antoniogiuliana.it

----------

## How it works ##

This plugin permit to generate a fake dropdown, where you can have options with html inside.

### HTML ###

	<div class="cd-fake_dropdown">
		<p clas="cdDescr"></p>
		<ul></ul>
	</div>
 
### Javascript ###
 
 	$(".customDropdown").customDropdown({
		debug: true,
		inputName: "input_name",
		titleDropdown: "Select...",
		pathDefaultCss: "/js/jquery.customDropdown/jquery.customDropdown.css",
		clickCallback: function() {
			ownFunction();
		}
 	});
