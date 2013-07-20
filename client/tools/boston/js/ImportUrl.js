Boston.importUrl = function (url) {
  $.post('/nudgepad.proxy', { url : url}, function (data) {
    
    var space = $.htmlToScraps(data)
    Boston.menu.create(null, space.toString())
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
