;(function($, undefined){

  "use strict";

  /*
  ================================================================================
    wpfload
  ================================================================================
  */
  $.fn.wpfload = function(option) {

    // Longest-common subsequence
    // function LCS(stringX, stringY) {
    //     var matchfound = 0;
    //     var lcslen = stringX.length;
    //     var lcsos, re, temp, result;
    //     for (lcsi = 0; lcsi < stringX.length; lcsi++) {
    //         lcsos = 0;
    //         for (lcsj = 0; lcsj < lcsi + 1; lcsj++) {
    //             re = new RegExp("(?:.{" + lcsos + "})(.{" + lcslen + "})", "i");
    //             temp = re.test(stringX);

    //             re = new RegExp("(" + RegExp.$1 + ")", "i");
    //             if (re.test(stringY)) {
    //                 matchfound = 1;
    //                 result = RegExp.$1;
    //                 break;
    //             }
    //             lcsos = lcsos + 1;
    //         }
    //         if (matchfound == 1) {
    //             return result;
    //             // break;
    //         }
    //         lcslen = lcslen - 1;
    //     }
    //     result = '';
    //     return result;
    // }

    return this.each(function() {

      var $el = $(this);
      if (!$el.hasClass('wpfloading')) {

        $el.addClass('wpfloading');

        var parentAbs = $el.parents('.wpfloading').data('abs');
        // console.log('parentAbs: ' + parentAbs);

        var thisUrl  = parentAbs ? parentAbs : location.pathname;
        // console.log('thisUrl: ' + thisUrl);

        // trim the file name
        var thisPath = thisUrl.replace(/[^\/]*$/, '');
        // console.log('thisPath: ' + thisPath);

        // trim './'
        var targetUrl = $el.data('url').replace(/^\.\//, '');
        // console.log('targetUrl: ' + targetUrl);

        // number of '../'
        var parentLevel = targetUrl.match(/\.\.\//g);
          parentLevel = parentLevel ? parentLevel.length : 0;
        // console.log('parentLevel: ' + parentLevel);

        // trim all '../'
        var targetPath = targetUrl.replace(/\.\.\//g, '');
        // console.log('targetPath: ' + targetPath);

        // var lcs  = LCS(thisPath, targetPath);
        // console.log('lcs: ' + lcs);

        // trim dir from the back * parentLevel
        var re           = new RegExp('([^\/]+\/){' + parentLevel + '}$');
        var targetParent = thisPath.replace(re, '');
        // console.log('targetParent: ' + targetParent);

        var url = targetParent + targetPath;

        $el.attr('data-abs', url);

        // var targetRel = targetUrl.replace(lcs, '');

        // console.log('targetRel: ' + targetRel);

        // var thisRel   = thisPath.replace(lcs, '');
        //     thisRel   = thisRel.replace(/[^\/]*$/, '');
        //     thisRel   = thisRel.replace(/([^\/]+\/)/ig, '../');

        // console.log('thisRel: ' + thisRel);

        // var url = thisRel + targetRel;

        // console.log('url: ' + url);

        var filters = ['apply_filters', 'add_filter', 'do_action', 'add_action'];

        var targetEl      = 'file';
        var isHook        = ($.inArray($el.data('function'), filters) > -1) ? true : false;
        var isFunction    = $el.data('function');
        var isClass       = $el.data('class');
        var hasArrayFirst = $el.data('array-first');
        var hasParams     = $el.data('params');
        var hasMethod     = $el.data('method');

        if (isFunction) {
          targetEl = $el.data('function');
        } else if (isClass && hasMethod) {
          targetEl = $el.data('class') + '-' + $el.data('method');
        } else if (isClass) {
          targetEl = $el.data('class');
        }

        $.ajax({
          url: url
        }).done(function(data){
          var html     = $(data).find('#' + targetEl).html();

          if (html) {

            $el.append(html);

            if (isFunction || isClass) {
              // Show which file the function or class exists
              var $funcname = isFunction ? $el.find('.function-name') : $el.find('.class-name');
              var filename  = data.match(/<title.*>(.*)<\/title>/);
                  filename  = filename[1];
              var variable, params, funcname;
              // $funcname.append(' <span class="at">' + filename + '</span>');
              $funcname.find('code').attr('title', filename);

              if (isFunction && (hasParams || isHook)) {
                funcname = $funcname.find('code').text();

                if (hasParams) {
                  params   = $el.data('params');
                  $funcname.find('code').text(funcname.replace('()', '')).append('( ' + params + ' )');
                } else {
                  $funcname.find('code').text(funcname.replace('()', ''));
                  var tag        = $el.data('tag');
                  var callback   = $el.data('callback');
                  var arrayFirst = $el.data('array-first');
                  if (tag && callback) {
                    params  = '( <span class="yellow">\'' + tag + '\'</span>, ';
                    params += hasArrayFirst ? '<span class="blue">array</span>( ' + arrayFirst +  ', ' : '';
                    params += '<span class="yellow">\'' + callback + '\'</span> )';
                    params += hasArrayFirst ? ' )' : '';
                  } else if (tag) {
                    params = '( <span class="yellow">\'' + tag + '\'</span> )';
                  } else {
                    params = '()';
                  }
                  $funcname.find('code').append(params);
                }
              }

              if (isClass) {
                variable = $el.data('var');

                if (hasMethod) {
                  variable = variable ? variable + '<span class="red">-&gt;</span>' : '';
                  $funcname.find('code').prepend(variable);

                } else {
                  variable = variable ? variable + '<span class="red"> = </span>' : '';
                  params   = $el.data('params');
                  params   = params ? '( ' + params + ' )' : '()';
                  $funcname.find('code').prepend(variable).append(params);
                }

              }

            }

            $('.function-name code').tooltip({
              placement: 'right'
            });
            $('.class-name code').tooltip({
              placement: 'right'
            });

            // recall necessary methods;
            $('.if').wpfcheckbox();
            $('.nav-tabs > li').wpftab();
            $('.redirect_to').wpfredirect();

          } else {
            if (isFunction) {
              $el.append('Fatal error: Call to undefined function ' + targetEl + '()');
            }
          } // end if (html)

        }).fail(function(){
          $el.append('Warning: require(' + url + '): failed to open stream: No such file or directory.');
          // console.log('Error!');

        }).always(function(){
          // console.log('Complete!');
        });

      }

    });
  };

  /*
  ================================================================================
    wpfredirect
  ================================================================================
  */
  $.fn.wpfredirect = function(option) {

    return this.each(function(){

      var $el = $(this);

      if (!$el.hasClass('wpfredirect_ok')) {

        var parentAbs = $el.parents('.wpfloading').data('abs');
        // console.log('parentAbs: ' + parentAbs);

        var thisUrl  = parentAbs ? parentAbs : location.pathname;
        // console.log('thisUrl: ' + thisUrl);

        // trim the file name
        var thisPath = thisUrl.replace(/[^\/]*$/, '');
        // console.log('thisPath: ' + thisPath);

        // trim './'
        var targetUrl = $el.attr('href').replace(/^\.\//, '');
        // console.log('targetUrl: ' + targetUrl);

        // number of '../'
        var parentLevel = targetUrl.match(/\.\.\//g);
            parentLevel = parentLevel ? parentLevel.length : 0;
        // console.log('parentLevel: ' + parentLevel);

        // trim all '../'
        var targetPath = targetUrl.replace(/\.\.\//g, '');
        // console.log('targetPath: ' + targetPath);

        // trim dir from the back * parentLevel
        var re           = new RegExp('([^\/]+\/){' + parentLevel + '}$');
        var targetParent = thisPath.replace(re, '');
        // console.log('targetParent: ' + targetParent);

        var url = targetParent + targetPath;
        // console.log('url: ' + url);

        $el.attr('href', url);
        // console.log($el.attr('href'));

        $el.addClass('wpfredirect_ok');

      }
    });
  };

  /*
  ================================================================================
    wpfcheckbox
  ================================================================================
  */
  $.fn.wpfcheckbox = function(option) {

    $el = $(this);

    return this.each(function() {

      var $el       = $(this);
      // var condition = $el.data('condition');
      // var $block    = $el.parent('label').parent('.checkbox').parent('.if-block');

      // var wpfchkbx = {
      //   $el : $(this)
      // };
      // wpfchkbx.condition = wpfchkbx.$el.data('condition');
      // wpfchkbx.$block    = wpfchkbx.$el.parent('label').parent('.checkbox').parent('.if-block');

      // $el.addClass('wpfcheckbox');

      check($el);

      // add class "wpfcheckbox_ok" after initial check
      $el.addClass('wpfcheckbox_ok');

      $el.on('click', function() {
        check($el);
      });

    });

    function check(el) {

      // var $el       = wpfchkbx.$el;
      // var condition = wpfchkbx.condition;
      // var $block    = wpfchkbx.$block;

      var $el       = el;
      var condition = $el.data('condition');
      var $block    = $el.parent('label').parent('.checkbox').parent('.if-block');

      // n = 0;

      if (condition) { // To control contents out of the function or file

        var $isTrue    = $('.' + condition + '_isTrue');
        var $isFalse   = $('.' + condition + '_isFalse');
        var isTrueVisibility  = $isTrue.data('visibility');
            isTrueVisibility  = isTrueVisibility ? isTrueVisibility : 0;
        var isFalseVisibility = $isFalse.data('visibility');
            isFalseVisibility = isFalseVisibility ? isFalseVisibility : 0;

        console.log(condition + '_isTrue (before): ' + isTrueVisibility);
        console.log(condition + '_isFalse (before): ' + isFalseVisibility);

        if ($el.hasClass('wpfcheckbox_ok')) {
          if ($el.is(':checked')) {
            isTrueVisibility++;
            isFalseVisibility = isFalseVisibility > 0 ? isFalseVisibility -1 : 0;
          } else {
            isFalseVisibility++;
            isTrueVisibility = isTrueVisibility > 0 ? isTrueVisibility - 1 : 0;
          }
        } else { // initial check
          if ($el.is(':checked')) {
            isTrueVisibility++;
          } else {
            isFalseVisibility++;
          }
        }

        $isTrue.data('visibility', isTrueVisibility);
        $isFalse.data('visibility', isFalseVisibility);

        console.log(condition + '_isTrue (after): ' + $isTrue.data('visibility'));
        console.log(condition + '_isFalse (after): ' + $isFalse.data('visibility'));

        if ($isTrue.data('visibility') > 0) {
          $isTrue.addClass('in');
        } else {
          $isTrue.removeClass('in');
        }

        if ($isFalse.data('visibility') > 0) {
          $isFalse.addClass('in');
        } else {
          $isFalse.removeClass('in');
        }
        // $('.wpfcheckbox').each(function() {
        //   if ($(this).data('condition') === condition && $(this).is(':checked')) {
        //     n++;
        //   }
        // });

        // if (n > 0) {
        //   $('.' + condition + '_isFalse').removeClass('in');
        //   $('.' + condition + '_isTrue').addClass('in');
        // } else {
        //   $('.' + condition + '_isTrue').removeClass('in');
        //   $('.' + condition + '_isFalse').addClass('in');
        // }

        // if ($el.is(':checked')) {
        //   $('.' + condition + '.isFalse').removeClass('in');
        //   $('.' + condition + '.isTrue').addClass('in');
        // } else {
        //   $('.' + condition + '.isTrue').removeClass('in');
        //   $('.' + condition + '.isFalse').addClass('in');
        // }

      } else if ($block) {

        if ($el.is(':checked')) {
          $block.children('.isFalse').removeClass('in');
          $block.children('.isTrue').addClass('in');
        } else {
          $block.children('.isTrue').removeClass('in');
          $block.children('.isFalse').addClass('in');
        }

      }
    }
  };

  /*
  ================================================================================
    wpftab
  ================================================================================
  */
  $.fn.wpftab = function (option) {

    return this.each(function() {
      var $el      = $(this);
      var index    = $el.index();
      var href     = $el.attr('href');
      var target   = $el.attr('target');
      var $tabs    = $el.parent('.nav-tabs');
      var $block   = $tabs.parent('.tab-block');
      var $tabPane = $tabs.next('.tab-content').children('.tab-pane');

      if (href || target) {
        $el.tab('show');
      } else if ($block) {
        $el.on('click', function() {
          $tabs.children().removeClass('active');
          $el.addClass('active');
          $tabPane.removeClass('in').removeClass('active');
          $tabPane.eq(index).addClass('in').addClass('active');
        });
      }
    });
  };

})(jQuery);
