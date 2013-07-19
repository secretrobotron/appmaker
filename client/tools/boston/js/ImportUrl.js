Boston.importUrl = function (url) {
  $.get('/nudgepad.import/' + url, {}, function (data) {
    Boston.page = new Page(data)
    Boston.stage.commit()
    Boston.stage.open(Boston.stage.activePage)
  })
}

Boston.importUrlPrompt = function () {
  
  var url = prompt('Enter a url to import', 'http://')
  if (!url)
    return false
  
  if (!url.match(/^https?\:\/\//))
    url = 'http://' + url
  Boston.importUrl(url)
  
}
