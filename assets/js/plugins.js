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

    this.each(function() {

      if (!$(this).hasClass('including')) {

        var $el = $(this);
        $el.addClass('including');

        var parentAbs = $el.parents('.including').data('abs');
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

    return this;
  };

  /*
  ================================================================================
    wpfredirect
  ================================================================================
  */
  $.fn.wpfredirect = function(option) {

    this.each(function(){

      var $el = $(this);

      var parentAbs = $el.parents('.including').data('abs');
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

    });

    return this;
  };

  /*
  ================================================================================
    wpfcheckbox
  ================================================================================
  */
  $.fn.wpfcheckbox = function(option) {

    this.each(function() {
      var $el       = $(this);
      var condition = $el.data('condition');
      var $block    = $el.parent('label').parent('.checkbox').parent('.if-block');

      check();

      $el.on('click', function() {
        check();
      });

      function check() {

        if (condition) {

          if ($el.is(':checked')) {
            $('.' + condition + '.isFalse').removeClass('in');
            $('.' + condition + '.isTrue').addClass('in');
          } else {
            $('.' + condition + '.isTrue').removeClass('in');
            $('.' + condition + '.isFalse').addClass('in');
          }

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
    });
  };

})(jQuery);
