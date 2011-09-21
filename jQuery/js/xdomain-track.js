/************************************
 *
 * Automatically tag links for Google Analytics to
 * simplify tracking across domains. 
 *
 * Peter McKenna
 * peter.mckenna@iqcontent.com
 * 
 * v1.00 
 *	- Initial script
 * v1.10
 *	- Allow tracking variables to be passed via # tag
 *	- Fixed tiny bug with wildcard domains
 *	- Added form tracking
 *
 ************************************/

// Config Variables.
var domains_to_track = 
	[
	 '*.iqcontent.com'
	];
var useHash = false;

// Get all the links on the page (could be slow for pages with lots of links)
var links = document.getElementsByTagName("a");
// Loop through links
for(i=0;i<links.length;i++) {
	// Get the target for link
	var link_target = links[i].host;
	// Check if link needs to be tracked
	checkLink(links[i],link_target,false);
}

// Get all the forms on the page
var forms = document.getElementsByTagName("form");
// Loop through forms
for(i=0;i<forms.length;i++) {
	// Get the form action
	var form_action = forms[i].action;
	// Check to see if the form needs to be tracked
	checkLink(forms[i],form_action,true);
}

function checkLink(object,url,form)
{
	for (j=0;j<domains_to_track.length;j++) {
		var wildcard_domain = -1;
		// Check for wildcard domain (e.g. *.somedomain.com)
		if (domains_to_track[j].substr(0,1)=='*') {
			wildcard_domain = domains_to_track[j].substr(1,(domains_to_track[j].length-1));
		}
		// Checks if domain should be tracked
		if(url==domains_to_track[j]||
		   url==domains_to_track[j]+':80'||
		   url.indexOf(wildcard_domain)>=0) {
			// Check if the object is a form or not
			if(!form) {
				object.onclick = 
					function() {
						// Run tagLink function when link is clicked
						return tagLink(this.href);
					}
			}
			else {
				object.onsubmit =
					function() {
						return tagForm(object);
					}
			}
		}
	}
}

// This function is called when a tracked link is clicked
function tagLink(link_href) {
	// Check if pageTracker or urchinTracker are present
	if (typeof pageTracker != 'undefined') {
		pageTracker._link(link_href, useHash);
		return false;
	}
	else if (typeof urchinTracker != 'undefined') {
		__utmLinker(link_href);
		return false;
	}
	else {
		return true;
	}
}

// This function is called when a form is submitted
function tagForm(form) {
	// Check if pageTracker or urchinTracker are present
	if (typeof pageTracker != 'undefined') {
		pageTracker._linkByPost(form, useHash);
	}
	else if (typeof urchinTracker != 'undefined') {
		
	}
	else {
		return true;
	}
}