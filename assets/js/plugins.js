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

            var $el = $(this);
            $el.addClass('including');

            var parentAbs = $el.parents('.including').data('abs');
            console.log('parentAbs: ' + parentAbs);

            var thisUrl  = parentAbs ? parentAbs : location.pathname;
            console.log('thisUrl: ' + thisUrl);

            // trim the file name
            var thisPath = thisUrl.replace(/[^\/]*$/, '');
            console.log('thisPath: ' + thisPath);

            // trim './'
            var targetUrl = $el.data('url').replace(/^\.\//, '');
            console.log('targetUrl: ' + targetUrl);

            // number of '../'
            var parentLevel = targetUrl.match(/\.\.\//g);
                parentLevel = parentLevel ? parentLevel.length : 0;
            console.log('parentLevel: ' + parentLevel);

            // trim all '../'
            var targetPath = targetUrl.replace(/\.\.\//g, '');
            console.log('targetPath: ' + targetPath);

            // var lcs  = LCS(thisPath, targetPath);
            // console.log('lcs: ' + lcs);

            // trim dir from the back * parentLevel
            var re           = new RegExp('([^\/]+\/){' + parentLevel + '}$');
            var targetParent = thisPath.replace(re, '');
            console.log('targetParent: ' + targetParent);

            var url = targetParent + targetPath;

            $el.attr('data-abs', url);

            // var targetRel = targetUrl.replace(lcs, '');

            // console.log('targetRel: ' + targetRel);

            // var thisRel   = thisPath.replace(lcs, '');
            //     thisRel   = thisRel.replace(/[^\/]*$/, '');
            //     thisRel   = thisRel.replace(/([^\/]+\/)/ig, '../');

            // console.log('thisRel: ' + thisRel);

            // var url = thisRel + targetRel;

            console.log('url: ' + url);

            $.ajax({
                url: url
            }).done(function(data){
                var html = $(data).find('#file').html();
                $el.append(html);
                $('.if').wpfcheckbox();

            }).fail(function(){
                console.log('Error!');

            }).always(function(){
                console.log('Complete!');
            });

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
            console.log('parentAbs: ' + parentAbs);

            var thisUrl  = parentAbs ? parentAbs : location.pathname;
            console.log('thisUrl: ' + thisUrl);

            // trim the file name
            var thisPath = thisUrl.replace(/[^\/]*$/, '');
            console.log('thisPath: ' + thisPath);

            // trim './'
            var targetUrl = $el.attr('href').replace(/^\.\//, '');
            console.log('targetUrl: ' + targetUrl);

            // number of '../'
            var parentLevel = targetUrl.match(/\.\.\//g);
                parentLevel = parentLevel ? parentLevel.length : 0;
            console.log('parentLevel: ' + parentLevel);

            // trim all '../'
            var targetPath = targetUrl.replace(/\.\.\//g, '');
            console.log('targetPath: ' + targetPath);

            // trim dir from the back * parentLevel
            var re           = new RegExp('([^\/]+\/){' + parentLevel + '}$');
            var targetParent = thisPath.replace(re, '');
            console.log('targetParent: ' + targetParent);

            var url = targetParent + targetPath;
            console.log('url: ' + url);

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
            var $el = $(this);

            $el.addClass('wpfcheckbox');

            check();

            $el.on('click', function() {
                check();
            });

            function check() {

                var href = $el.data('href');
                var rel  = $el.attr('rel');
                var n    = 0;

                $('.wpfcheckbox').each(function() {
                    if ($(this).data('href') === href && $(this).is(':checked')) {
                        n++;
                    }
                });

                if (n > 0) {
                    $('.' + rel).removeClass('in');
                    $(href).addClass('in');
                } else {
                    $('.' + rel).addClass('in');
                    $(href).removeClass('in');
                }

            }
        });
    };

})(jQuery);
