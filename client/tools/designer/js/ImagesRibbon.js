/**
 * @special Singleton
 */
Designer.images = {}

/**
 * given url(http://foobar.com/foob.png) returns foob.png
 *
 * @param {string} 
 * @return {string} 
 */
Designer.images.getFilename = function (url) {
  var file = Designer.images.parseBackgroundUrl(url).split(/\//)
  return file[file.length-1]
  
}

/**
 * @param {string} Image name to add
 * @param {bool} Whether to insert it via drag and drop.
 * @return {string} Scrap id
 */
Designer.images.insertImageScrap = function (filename, drag) {

  if (filename.match(/^url\(/))
    filename = Designer.images.parseBackgroundUrl(filename)
  
  // Easter Egg: allow swapping of images
  if (!drag && $('.selection').length > 0) {
    Designer.stage.selection.css('background-image url(' + filename + ')')
    Designer.stage.selection.css('background-repeat no-repeat')
    Designer.stage.selection.css('background-position center')
    return false
  }

  $('<img/>').attr("src", filename).load(function() {
     
    var space = new Space(
      "style" +
      "\n background-image " + 'url(' + filename + ')' +
      "\n background-repeat no-repeat" + 
      "\n background-color transparent" +
      "\n background-position center" +
      "\n background-size contain" +
      "\n width " + this.width + 'px' +
      "\n height " + this.height + 'px')
    var scraps = new Space().set('scrap', space)
    return Designer.stage.insert(scraps, drag)
  })
}

/**
 * Is it an image?
 *
 * @param {string}
 * @return {bool}
 */
Designer.images.isImage = function (filename) {
  return filename.match(/\.(png|jpg|jpeg|gif)$/i)
}

/**
 * given url(/foob.png) returns /foob.png
 *
 * @param {string} 
 * @return {string} 
 */
Designer.images.parseBackgroundUrl = function (url) {
  return url.split(/(\(|\))/).slice(2)[0]
}

Designer.images.updateList = function () {
  $('#DesignerImagesList').html('')
  $.get('/nudgepad.explorer.public', {}, function (space) {
    new Space(space).each(function (key, value) {
      // we add the &nbsp; to give it a line height
      // todo: use flex box to get vertical align
      if (Designer.images.isImage(key))
        $('#DesignerImagesList').append('<div class="Image">&nbsp;<img src="/'+ key +'">&nbsp;</div>')
    })
  })
}


Designer.on('open', function () {
  // When an image is uploaded
//  Project.on('uploadComplete', Designer.images.updateList)
  Project.on('file', Designer.images.updateList)
  
})

Designer.on('close', function () {
  // When an image is uploaded
//  Project.off('uploadComplete', Designer.images.updateList)
  Project.off('file', Designer.images.updateList)
})

Designer.on('firstOpen', function () {
  
  $('#DesignerImagesList').on('tap', '.Image img', function() {
    var imageY = ($('#DesignerStage').height() / 2) - 130
    var imageX = 100
    Designer.stage.insert('images\n style\n  position absolute\n  top ' + imageY +'\n  left ' + imageX + '\n tag img\n src ' + $(this).attr('src'))
  })
  
  $('#DesignerImagesList').on('slidestart', '.Image img', function() {
    Designer.stage.dragAndDrop('images\n style\n  position absolute\n  top 0px\n  left 0px\n tag img\n src ' + $(this).attr('src'))
    mixpanel.track('I dropped an image component')
  })
  
  $('#DesignerImagesRibbon').on('mousedown slide slidestart', function (event) {
    event.stopPropagation()
  })
  
  
})

Designer.on('firstOpen', Designer.images.updateList)
