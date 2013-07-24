var WebMaker = new Tool('WebMaker')
WebMaker.set('color', 'rgba(26, 134, 214, 1)')
WebMaker.set('description', 'Remix WebMaker templates in your project.')
WebMaker.set('beta', true)

WebMaker.fetch = function () {
  
  // without auth - Search only
  var makeapi = new Make({
    apiURL: "https://makeapi.webmaker.org"
  })
  
  makeapi
    .contentType( "application/x-thimble" )
    .then(function( err, data ) {
      if ( err ) {
        // handle error case
      }
      
      console.log(data)
      /*
      _.each(data, function (value, key) {
        var template = $('#MakeTemplate').clone()
        template.css({
          'background-image' : 'url(' + value.get('thumbnail') + ')'
        })
        template.on('click', function () {
          var url = value.get('url').replace('https://webmaker.makes.org/', 'https://s3.amazonaws.com/makes.org/webmaker/') + '_'
          Launcher.open('Designer')
          Designer.menu.create()
          Designer.import(url)
        })
        $('#Makes').append(template)
        template.show()  
      })
      */
      
    })

}

WebMaker.on('open' , function () {
  if ($('.MakeTemplate').length < 2)
    WebMaker.fetch()
})

