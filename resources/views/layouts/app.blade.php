<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>@yield('title')</title>

    <link rel="stylesheet" href="/css/app.css">
    @yield('style')
    @yield('pre-js')
  </head>
  <body>
      @yield('content')
      <script type="text/javascript" src="/js/app.js"> </script>
      @yield('post-js')
  </body>

</html>
