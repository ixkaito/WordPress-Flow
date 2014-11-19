(function($) {
  $(document).on('click', '.collapse-toggle', function() {
    $(this).next('.collapse').collapse('toggle');
  });

  $('.require, .require_once, .include, .include_once, .function, .class').wpfload();
  $('.if').wpfcheckbox();
  $('.nav-tabs > li').wpftab();

})(jQuery);