'use strict';

var app        = require('express')(),
server         = require('http').Server(app),
io             = require('socket.io')(server),
bodyParser     = require('body-parser'),
methodOverride = require('method-override'),
browserify     = require('browserify'),
literalify     = require('literalify'),
React          = require('react'),
MyApp          = React.createFactory(require('./myApp')),
games          = [],
players        = [];

/**
 * CONFIGURING EXPRESS
 */

app.use( bodyParser.urlencoded( { extended: true, limit: '50mb' } ) );
app.use( bodyParser.json( { limit: '50mb' } ) );
app.use( methodOverride() );

server.listen(3003, function(){
  console.log('Server started at http://localhost:3003');
});

/**
 * ROUTES
 */

app.get('/', function(req, res, next){
  var props = {
    turn : "X",
    score : { X: 0, O: 0 },
    moves : 0,
    tiles: {
      1: '',
      2: '',
      4: '',
      8: '',
      16: '',
      32: '',
      64: '',
      128: '',
      256: ''
    },
    wins : [7, 56, 448, 73, 146, 292, 273, 84]
  };

  // Now that we've got our data, we can perform the server-side rendering by
  // passing it in as `props` to our React component - and returning an HTML
  // string to be sent to the browser
  var myAppHtml = React.renderToString(MyApp(props));

  res.setHeader('Content-Type', 'text/html');

  // Now send our page content - this could obviously be constructed in
  // another template engine, or even as a top-level React component itself -
  // but easier here just to construct on the fly
  res.end(
    // <html>, <head> and <body> are for wusses

    // Include our static React-rendered HTML in our content div. This is
    // the same div we render the component to on the client side, and by
    // using the same initial data, we can ensure that the contents are the
    // same (React is smart enough to ensure no rendering will actually occur
    // on page load)
    '<script src="/socket.io/socket.io.js"></script>'+
    '<script>'+
      'var socket = io.connect(\'http://localhost:3003\');'+
      'socket.on(\'news\', function (data) {'+
        'console.log(data);'+
        'socket.emit(\'my other event\', { my: \'data\' });'+
      '});'+
    '</script>'+
    '<div id=content>' + myAppHtml + '</div>' +

    // We'll load React from a CDN - you don't have to do this,
    // you can bundle it up or serve it locally if you like
    '<script src=//fb.me/react-0.12.2.js></script>' +

    // Then the browser will fetch the browserified bundle, which we serve
    // from the endpoint further down. This exposes our component so it can be
    // referenced from the next script block
    '<script src=/bundle.js></script>' +

    // This script renders the component in the browser, referencing it
    // from the browserified bundle, using the same props we used to render
    // server-side. We could have used a window-level variable, or even a
    // JSON-typed script tag, but this option is safe from namespacing and
    // injection issues, and doesn't require parsing
    '<script>' +
      'var MyApp = React.createFactory(require("myApp"));' +
      'React.render(MyApp(' + JSON.stringify(props) + '), document.getElementById("content"))' +
    '</script>'
  );
});

app.get('/bundle.js', function(req, res, next){
  res.setHeader('Content-Type', 'text/javascript')

  // Here we invoke browserify to package up our component.
  // DON'T do it on the fly like this in production - it's very costly -
  // either compile the bundle ahead of time, or use some smarter middleware
  // (eg browserify-middleware).
  // We also use literalify to transform our `require` statements for React
  // so that it uses the global variable (from the CDN JS file) instead of
  // bundling it up with everything else
  browserify()
    .require('./myApp.js', {expose: 'myApp'})
    .transform({global: true}, literalify.configure({react: 'window.React'}))
    .bundle()
    .pipe(res)
});

io.on('connection', function (socket){
  console.log('************* CONNECTED ***************');
  console.log(socket.id);
  console.log('***************************************');

  socket.emit('news', { hello: 'world' });
  socket.on('my other event', function (data) {
    console.log(data);
  });
});