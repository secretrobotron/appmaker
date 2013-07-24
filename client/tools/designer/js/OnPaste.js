/**
 */
Designer.onpaste = function(event) {

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
    Designer.pasteScraps(pastedText)
  
  else if (type === 'html')
    Designer.pasteScraps($.htmlToScraps(pastedText))
  
  else if (type === 'css')
    Designer.pasteCss(pastedText)
  
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
      if (Designer.isScraps(event.target.result))
        Designer.pasteScraps()
    }
    reader.readAsDataURL(blob)
  }
  */
  
  mixpanel.track('I pasted something')
}

Designer.pasteScraps = function(pastedText) {

  Designer.stage.insert(pastedText)
  Designer.stage.selection.save()
  Designer.stage.open(Designer.stage.activePage)
  Designer.stage.selection.restore()
}

