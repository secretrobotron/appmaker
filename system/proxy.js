/**
 * Allows hosting of multiple projects on one server.
 */
var httpProxy = require('http-proxy'),
    exec = require('child_process').exec,
    fs = require('fs')

process.title = 'nudgepadProxy'
var errorPage = fs.readFileSync(__dirname + '/error.html', 'utf8')
var startingPage = fs.readFileSync(__dirname + '/starting.html', 'utf8')
var starting = {}
var dataPath = '/nudgepad/'
var logsPath = dataPath + 'logs/'
var projectsPath = dataPath + 'projects/'
var runningPath = dataPath + 'running/'
var portsPath = dataPath + 'ports/'
var port = process.argv[2] || 80

var startProject = function (domain) {
  starting[domain] = true
  console.log('starting sleeping project: %s', domain)
  exec(__dirname + '/nudgepad.sh start ' + domain, function (err){
    if (err)
      console.log('Start project error %s', err)
  })
}

var notFoundHandler = function (req, res) {
  var domain = req.headers.host.split(/\:/)[0]
  // todo: this could cause some bad edge cases
  if (domain.match(/^www\./)) {
    res.writeHead(302, { 'Location': 'http://' + domain.substr(4) + req.url })
    console.log('www_redirect: %s', domain)
    res.end()
  } else {
    // todo: this may cause some bad edge cases.
    fs.exists(projectsPath + domain, function (exists) {
      if (!exists) {
        console.log('unknown_host: %s', domain)
        res.writeHead(404)
        return res.end()
      } else {
        // Only start a project once
        if (starting[domain]) {
          res.writeHead(500)
          return res.end(errorPage)
        }
        startProject(domain)
        res.writeHead(200)
        return res.end(startingPage)
        
        
      }
    })
    
    
    
    
    
  }
}

var errorHandler = function (err, req, res) {
//  console.log(err)
//  console.log('proxy error')
  if (req && req.headers)
    console.log('error: %s %s%s', req.method, req.headers.host, req.url)
  res.writeHead(500)
  res.end(errorPage)
}

var server = httpProxy.createServer({
  hostnameOnly: true,
  router: {}
})

server.proxy.on('notFound', notFoundHandler)
server.proxy.on('proxyError', errorHandler)

server.listen(port)


var updatePorts = function () {
  var projects = server.proxy.proxyTable.router
  var files = fs.readdirSync(runningPath)
  for (var i in files) {
    var domain = files[i]
    if (domain.match(/^\./))
      continue
    var port = fs.readFileSync(runningPath + domain, 'utf8')
    projects[domain] = '127.0.0.1:' + port
    console.log('%s on port %s', domain, port)
  }
}

updatePorts()

fs.watch(runningPath, function (event, domain) {
  
  // Mac os x
  if (!domain)
    return updatePorts()
  
  var projects = server.proxy.proxyTable.router
  // Trigger public changed event
  console.log('event on %s', domain)
  var domain = domain.toLowerCase()
  if (domain.match(/^\./))
    return null
  if (fs.existsSync(runningPath + domain)) {
    var port = fs.readFileSync(runningPath + domain, 'utf8')
    projects[domain] = '127.0.0.1:' + port
    console.log('%s on port %s', domain, port)
  } else {
    console.log('deleting %s', projects[domain])
    delete projects[domain]
  }
})

