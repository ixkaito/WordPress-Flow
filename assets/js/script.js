var wpfloadClass = '.require, .require_once, .include, .include_once, .function, .class';

function wpfinit() {
  $(wpfloadClass).wpfinitload();
}

(function($) {

  $(document).on('click', '.collapse-toggle', function() {

    var $collapse = $(this).next('.collapse');

    $collapse.collapse('toggle');

    /**
     * Toggle "out" class
     */
    if ($collapse.hasClass('out')) {
      $collapse.removeClass('out').find(wpfloadClass).wpfload();
    } else if (!$collapse.hasClass('in')) {
      $collapse.addClass('out');
    }

  });

  wpfinit();

})(jQuery);