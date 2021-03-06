let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/assets/js/app.js', 'public/js')
   .sass('resources/assets/sass/app.scss', 'public/css');
mix.js('resources/assets/js/encounter-creator.js', 'public/js')
mix.js('resources/assets/js/bootstrap.js', 'public/js')
  // .sass('resources/assets/sass/bootstrap.scss');
mix.sass('resources/assets/sass/monsters/monster.scss','public/css/monsters');
mix.sass('resources/assets/sass/monsters/monster-card-sm.scss','public/css/monsters');
mix.sass('resources/assets/sass/monsters/encounter-creator-main.scss','public/css/monsters');
