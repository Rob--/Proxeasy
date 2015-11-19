var http = require('http')
var https = require('https')
var express = require('express')
var app = express()
var URL = require('url');

app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'))
})

app.get('/', function(req, res){
  res.end()
})

app.get("/*", function(req, res){
  var ip = req.header('x-forwarded-for') || req.ip
  var url = URL.parse(req.url.substr(1))
  var host = url.host
  var path = url.path
  var port = path.indexOf('https') == -1 ? 80 : 443

  console.log(ip, 'requested (' + port + ')', host + path, '\n', path)

  var config = {
    hostname: host,
    port: port,
    path: path,
    method: 'GET'
  }

  var req_cb = function(proxy_res){
    proxy_res.on('data', function(chunk){
      res.write(chunk, 'binary')
    })

    proxy_res.on('end', function(){
      res.end();
    })
  }

  var proxy = config.port == 443 ? https.request(config, req_cb) : http.request(config, req_cb);

  proxy.on('error', function(error) {
    console.log('an error occured', error)
  });

  // res.on('data', function(chunk){
  //   proxy.write(chunk, 'binary');
  // })

  // res.on('end', function(){
  //   proxy.end()
  // })

  proxy.end();
})

// var http = require('http');
// var express = require('express')
// var app = express()
//
// app.set('port', (process.env.PORT || 5000))
//
// app.listen(app.get('port'), function() {
//   console.log('Node app is running on port', app.get('port'))
// })
//
// app.get('/*', function(req, res) {
//   console.log(req.url)
//
//   var proxy = http.request({host: 'google.com'}, function(pres){
//     pres.on('data', function(chunk){
//       res.write(chunk, 'binary');
//     })
//
//     pres.on('end', function(){
//       res.end()
//     })
//
//     res.writeHead(pres.statusCode, pres.headers);
//   })
//
//   res.on('data', function(chunk){
//     proxy.write(chunk, 'binary');
//   })
//
//   res.on('end', function(){
//     proxy.end()
//   })
// })

// var http = require('http');
//
// http.createServer(function(req, res) {
//   var options = {
//     port: 80,
//     hostname: req.headers.host,
//     method: req.method,
//     headers: req.headers
//   }
//
//   var proxy = http.request(options, function(pres){
//     pres.on('data', function(chunk){
//       res.write(chunk, 'binary');
//     })
//
//     pres.on('end', function(){
//       res.end()
//     })
//
//     res.writeHead(pres.statusCode, pres.headers);
//   })
//
//   res.on('data', function(chunk){
//     proxy.write(chunk, 'binary');
//   })
//
//   res.on('end', function(){
//     proxy.end()
//   })
// }).listen(8083);

/*http.createServer(function (client_req, client_res) {
  client_req.url = client_req.url.substr(1);
  console.log('serve: ' + client_req.url);
console.log("a: " + client_req.url.split("/")[2]);
console.log("\nb: " + client_req.url.substr(client_req.url.indexOf(client_req.url.split("/")[2]) + client_req.url.split("/")[2].length));
  var options = {
    hostname: client_req.url.split("/")[2],
    port: 80,
    path: client_req.url.substr(client_req.url.indexOf(client_req.url.split("/")[2]) + client_req.url.split("/")[2].length),
    method: 'GET'
  };

  var proxy = http.request(options, function (res) {
    res.pipe(client_res, {
      end: true
    });
  });

  client_req.pipe(proxy, {
    end: true
  });
}).listen(9000);*/

/*var http = require('http')
var express = require('express')
var app = express()

app.set('port', (process.env.PORT || 5000))

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'))
})

app.get("/*", function(req, res){
  var url = req.url.substr(1)
  var path = '';

  // if it's a resource file (e.g. /images)
  // if not, get the host (e.g. www.google.com)
  if(url.substr(0, 'http'.length) != 'http'){
    // add the referer to the front of the url so it becomes (e.g.) www.google.com/images
    if(req.headers.referer){
      url = req.headers.referer + "/" + url
      path = url;
    } else {
      res.status(400).send('Error 400: Bad Request, malformed URL: ' + url)
    }
  } else {
    var host = url.split('/')[2];
    path = url.substr(url.indexOf(host) + host.length);
  }

  console.log('---\nserving\n', url, '\n', req.headers.referer, '\n---\n');

  var config = {
    hostname: host,
    port: 80,
    path: path,
    method: 'GET'
  }

  var proxy = http.request(config, function(proxy_res){
    var body = "";

    proxy_res.on('data', function(chunk){
      body += chunk;
    })

    proxy_res.on('end', function(){
      body = body.replace(new RegExp('http', 'gi'), 'http://localhost:5000/http/');
      body = body.replace(new RegExp('href="', 'gi'), 'href="http://localhost:5000/' + url)
      body = body.replace(new RegExp('href=\'', 'gi'), 'href=\'http://localhost:5000/' + url)
      res.writeHead(res.statusCode, res.headers);
      res.end(body);
    })

    //proxy_res.pipe(res, {end: true});
  })

  proxy.end();

  //req.pipe(proxy, {end: true});
})*/
