;(function($, undefined){

    "use strict";

    $.fn.wpfinclude = function(option){

        // Longest-common subsequence
        function LCS(stringX, stringY) {
            var matchfound = 0;
            var lcslen = stringX.length;
            var lcsos, re, temp, result;
            for (lcsi = 0; lcsi < stringX.length; lcsi++) {
                lcsos = 0;
                for (lcsj = 0; lcsj < lcsi + 1; lcsj++) {
                    re = new RegExp("(?:.{" + lcsos + "})(.{" + lcslen + "})", "i");
                    temp = re.test(stringX);

                    re = new RegExp("(" + RegExp.$1 + ")", "i");
                    if (re.test(stringY)) {
                        matchfound = 1;
                        result = RegExp.$1;
                        break;
                    }
                    lcsos = lcsos + 1;
                }
                if (matchfound == 1) {
                    return result;
                    // break;
                }
                lcslen = lcslen - 1;
            }
            result = '';
            return result;
        }

        this.each(function(){

            var $el = $(this);

            var thisUrl   = location.pathname;
            var targetUrl = $el.data('url');

            console.log('thisUrl: ' + thisUrl);
            console.log('targetUrl: ' + targetUrl);

            var thisPath   = thisUrl.replace(/[^\/]*$/, '');
            var targetPath = targetUrl.replace(/[^\/]*$/, '');

            console.log('thisPath: ' + thisPath);
            console.log('targetPath: ' + targetPath);

            var lcs  = LCS(thisPath, targetPath);

            console.log('lcs: ' + lcs);

            var targetRel = targetUrl.replace(lcs, '');

            console.log('targetRel: ' + targetRel);

            var thisRel   = thisPath.replace(lcs, '');
                thisRel   = thisRel.replace(/[^\/]*$/, '');
                thisRel   = thisRel.replace(/([^\/]+\/)/ig, '../');

            console.log('thisRel: ' + thisRel);

            var url = thisRel + targetRel;

            console.log('url: ' + url);

            $.ajax({
                url: url
            }).done(function(data){
                var html = $(data).find('#file').html();
                $el.append(html);

            }).fail(function(){
                console.log('Error!');

            }).always(function(){
                console.log('Complete!');
            });

        });

        return this;
    };

})(jQuery);
