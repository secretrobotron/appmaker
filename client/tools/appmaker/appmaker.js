var AppMaker = new Tool('AppMaker')
AppMaker.set('color', 'rgba(71, 41, 54, 1)')
AppMaker.set('description', 'Make your project a FirefoxOS app.')
AppMaker.set('beta', 'true')

AppMaker.on('open', function () {
  AppMaker.install()
  $('#AppMakerManifestUrlLink').html('http://' + document.location.host + '/manifest.webapp')
  
  var options = {}
  options.drop = function( event, ui ) {
    var element = $('#' + $(ui.draggable).attr('value')).clone()
    $( this )
      .append(element)
    element.show()
  }
  
  $( '#AppMakerStage' ).html('<iframe src="/" width="100%" height="100%"></iframe>')
  
  $( "#AppMakerStage" ).droppable(options)
  $( '#AppMakerStage' ).selectable()
  $( ".DraggableThumb" ).draggable({ helper: "clone" })
  Events.shortcut.shortcuts = AppMaker.shortcuts
  $( '.AppMakerContainer' ).on('click', function () {
    $('.ui-selected').removeClass('ui-selected')
  })
})

AppMaker.on('close', function () {
  Events.shortcut.shortcuts = {}
})

AppMaker.install = function () {
  
  $.ajax({
    url: "/nudgepad/tools/appmaker/manifest.webapp",
    type: "get",
    dataType : 'text'
  }).done(function (response, textStatus, jqXHR){
    Explorer.create('manifest.webapp', response.toString(), function (data) {
      console.log(data)
      if (!data)
        Flasher.success('Manifest Created')
      else
        console.log(data)
    })
  })

  $.ajax({
    url: "/nudgepad/tools/appmaker/install.html",
    type: "get",
    dataType : 'text'
  }).done(function (response, textStatus, jqXHR){
    Explorer.create('install.html', response.toString(), function (data) {
      console.log(data)
      if (!data)
        Flasher.success('Install File Created')
      else
        console.log(data)
    })
  })
}

// http://stackoverflow.com/questions/1173194/select-all-div-text-with-single-mouse-click
AppMaker.selectText = function (containerid) {
    if (document.selection) {
        var range = document.body.createTextRange();
        range.moveToElementText(document.getElementById(containerid));
        range.select();
    } else if (window.getSelection) {
        var range = document.createRange();
        range.selectNode(document.getElementById(containerid));
        window.getSelection().addRange(range);
    }
}


//  (~ 4kb. Could save critical info + a link to more)
// also, when next gen qr codes come out (animated or higher res), could easily store
// 100x-1000x that amount.
AppMaker.qrCode = function (containerid) {
  
  var link = 'http://' + document.location.host + '/manifest.webapp'
  ImagePreview('<div id="qrCode"><div id="AppMakerManifestLink">' + link + '</div>')
  
  var qrcode = new QRCode("qrCode", {
      text: 'http://' + document.location.host + '/',
      width: 512,
      height: 512,
      colorDark : "#000000",
      colorLight : "#ffffff",
      correctLevel : QRCode.CorrectLevel.H
  })
}



