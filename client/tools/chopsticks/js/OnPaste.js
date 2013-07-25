/**
 */
Chopsticks.onpaste = function(event) {

  // Return true if maker is editing an input
  if ($('input:focus, div:focus, textarea:focus, a:focus').length)
    return true
  
  var pastedText = undefined
  
  if (event.clipboardData && event.clipboardData.getData)
    pastedText = event.clipboardData.getData('text/plain')
  
  var type = 'scraps'
  if (pastedText.match(/^\s*\</))
    type = 'html'
  
  if (type === 'scraps')
    Chopsticks.pasteScraps(pastedText)
  
  else if (type === 'html')
    Chopsticks.pasteHtml(pastedText)
  
//  else if (type === 'css')
//    Chopsticks.pasteCss(pastedText)
  
  // paste image
  
  /*
  var items = event.clipboardData.items
  console.log(JSON.stringify(items)) // will give you the mime types
  for (var i in items) {
    debugger
    var blob = items[0].getAsFile()
    var reader = new FileReader()
    reader.onload = function(event){
      console.log(event.target.result)
      if (Chopsticks.isScraps(event.target.result))
        Chopsticks.pasteScraps()
    }
    reader.readAsDataURL(blob)
  }
  */
  
  mixpanel.track('I pasted something')
}

Chopsticks.pasteHtml = function(html) {
  Chopsticks.pasteScraps($.htmlToScraps(html))
}

Chopsticks.pasteScraps = function(pastedText) {

  Chopsticks.stage.insert(pastedText)
  Chopsticks.stage.selection.save()
  Chopsticks.stage.open(Chopsticks.stage.activePage)
  Chopsticks.stage.selection.restore()
}

