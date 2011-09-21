/************************************
 *
 * Automatically tag links for Google Analytics to
 * simplify tracking across domains. 
 *
 * Peter McKenna
 * peter.mckenna@iqcontent.com
 * 
 * v1. Initial script
 *
 ************************************/

// Config Variables.
var domains_to_track = 
	[
	 'www.iqcontent.com'
	];

// Get all the links on the page (could be slow for pages with lots of links)
var links = document.getElementsByTagName("a");
// Loop through links
for(i=0;i<links.length;i++) {
	// Get the target for link
	var link_target = links[i].host;
	// Loop through domains to track
	for (j=0;j<domains_to_track.length;j++) {
		var wildcard_domain = -1;
		// Check for wildcard domain (e.g. *.somedomain.com)
		if (domains_to_track[j].substr(0,1)=='*') {
			wildcard_domain = domains_to_track[j].substr(2,(domains_to_track[j].length-1));
		}
		// Checks if domain should be tracked
		if(link_target==domains_to_track[j]||
		   link_target==domains_to_track[j]+':80'||
		   link_target.indexOf(wildcard_domain)>=0) {
           links[i].onclick = 
				function() {
					// Run tagLink function when link is clicked
					return tagLink(this.href);
				}
		}
	}
}

// This function is called when a tracked link is clicked
function tagLink(link_href) {
	// Check if pageTracker or urchinTracker are present
	if (typeof pageTracker != 'undefined') {
		pageTracker._link(link_href);
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