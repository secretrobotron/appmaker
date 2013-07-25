Chopsticks.relativeToAbsolute = function (string, url) {
  
  url = url.replace(/\/$/, '') + '/'
  var scraps = new Space(string)
  scraps.each(function (id, scrap) {
    if (scrap.get('href') && !scrap.get('href').match(/^https?\:/i))
      scrap.set('href', url + scrap.get('href'))
    if (scrap.get('src') && !scrap.get('src').match(/^https?\:/i))
      scrap.set('src', url + scrap.get('src'))
    if (scrap.get('scraps'))
      scrap.set('scraps', Chopsticks.relativeToAbsolute(scrap.get('scraps'), url))
  })
  
  return scraps
}
