(function($) {
	$(document).on('click', '.collapse-toggle', function() {
		$(this).next('.collapse').collapse('toggle');
	});

  $('.if').wpfcheckbox();
})(jQuery);