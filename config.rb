# run `$ compass compile -e production --force` to force compile for production

require 'bootstrap-sass'

http_path = "/"
preferred_syntax = :scss
css_dir = "assets/css"
sass_dir = "assets/sass"
images_dir = "assets/images"
javascripts_dir = "assets/js"
output_style = ( environment == :production ) ? :compressed : :expanded # :expanded, :nested, :compact or :compressed
line_comments = ( environment == :production ) ? false : true
