/**
 * Main.js Template file
 */
$(function() {
	$(document).ready(function() {
		$('#carousel-example-generic').carousel();

		$(".carousel img").cover();

		if ($("#instagram-container").length) {

			var feed = new Instafeed({
				get: 'tagged',
				tagName: 'commonwealthcrew',
				clientId: '00c5ad736e464e20bd242a1c3b410abe',
				target: 'instagram-container',
				sortBy: 'most-recent',
				limit: 20,
				template: '<li class="ig-image"><a  href="{{link}}"><img class="ig" src="{{image}}" /></a></li>',
				resolution: 'low_resolution',
				after: initScroller
			});
			feed.run();
		}
	});

	function initScroller(){
		$("#instagram-container").simplyScroll();
	}

});