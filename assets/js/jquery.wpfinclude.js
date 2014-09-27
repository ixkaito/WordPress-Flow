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

            var path = '/a/b/c/d/e/f/test1.php'; // location.pathname;
            var url  = '/a/b/test2.php'; // $el.data('url');

            var lcs  = LCS(path, url);
            console.log(path);
            console.log(url);
            console.log(lcs);

            var rel = path.replace(lcs, '');
            rel = rel.replace(/([^\/]+\/)+(.*)$/i, '../$2');

            console.log(rel);


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
