/**
 * @special Singleton
 */
Boston.images = {}

/**
 * given url(http://foobar.com/foob.png) returns foob.png
 *
 * @param {string} 
 * @return {string} 
 */
Boston.images.getFilename = function (url) {
  var file = Boston.images.parseBackgroundUrl(url).split(/\//)
  return file[file.length-1]
  
}

/**
 * @param {string} Image name to add
 * @param {bool} Whether to insert it via drag and drop.
 * @return {string} Scrap id
 */
Boston.images.insertImageScrap = function (filename, drag) {

  if (filename.match(/^url\(/))
    filename = Boston.images.parseBackgroundUrl(filename)
  
  // Easter Egg: allow swapping of images
  if (!drag && $('.selection').length > 0) {
    Boston.stage.selection.css('background-image url(' + filename + ')')
    Boston.stage.selection.css('background-repeat no-repeat')
    Boston.stage.selection.css('background-position center')
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
    return Boston.stage.insert(scraps, drag)
  })
}

/**
 * Is it an image?
 *
 * @param {string}
 * @return {bool}
 */
Boston.images.isImage = function (filename) {
  return filename.match(/\.(png|jpg|jpeg|gif)$/i)
}

/**
 * given url(/foob.png) returns /foob.png
 *
 * @param {string} 
 * @return {string} 
 */
Boston.images.parseBackgroundUrl = function (url) {
  return url.split(/(\(|\))/).slice(2)[0]
}

Boston.images.updateList = function () {
  $('#BostonImagesList').html('')
  $.get('/nudgepad.explorer.public', {}, function (space) {
    new Space(space).each(function (key, value) {
      // we add the &nbsp; to give it a line height
      // todo: use flex box to get vertical align
      if (Boston.images.isImage(key))
        $('#BostonImagesList').append('<div class="Image">&nbsp;<img src="/'+ key +'">&nbsp;</div>')
    })
  })
}


Boston.on('open', function () {
  // When an image is uploaded
//  Project.on('uploadComplete', Boston.images.updateList)
  Project.on('file', Boston.images.updateList)
  
})

Boston.on('close', function () {
  // When an image is uploaded
//  Project.off('uploadComplete', Boston.images.updateList)
  Project.off('file', Boston.images.updateList)
})

Boston.on('firstOpen', function () {
  
  $('#BostonImagesList').on('tap', '.Image img', function() {
    var imageY = ($('#BostonStage').height() / 2) - 130
    var imageX = 100
    Boston.stage.insert('images\n style\n  position absolute\n  top ' + imageY +'\n  left ' + imageX + '\n tag img\n src ' + $(this).attr('src'))
  })
  
  $('#BostonImagesList').on('slidestart', '.Image img', function() {
    Boston.stage.dragAndDrop('images\n style\n  position absolute\n  top 0px\n  left 0px\n tag img\n src ' + $(this).attr('src'))
    mixpanel.track('I dropped an image component')
  })
  
  $('#BostonImagesRibbon').on('mousedown slide slidestart', function (event) {
    event.stopPropagation()
  })
  
  
})

Boston.on('firstOpen', Boston.images.updateList)
