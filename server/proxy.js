var request = require('request')

module.exports = function (app) {
  
  app.post(app.pathPrefix + 'proxy', app.checkId, function(req, res, next) {
    
    var url = req.body.url
    request.get(url, function (error, response) {
      if (error)
        return res.send(error, 400)
      return res.send(response.body)
    })
  })
  
}

