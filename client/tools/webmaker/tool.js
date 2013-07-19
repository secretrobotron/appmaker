var WebMaker = new Tool('WebMaker')
WebMaker.set('color', 'rgba(26, 134, 214, 1)')
WebMaker.set('description', 'Remix WebMaker templates in your project.')
WebMaker.set('beta', true)


WebMaker.fetch = function () {
  $.support.cors = true
  $.ajax({
      url: "https://makeapi.webmaker.org/api/makes/search?s=%7B%22query%22%3A%7B%22filtered%22%3A%7B%22filter%22%3A%7B%22and%22%3A%5B%7B%22missing%22%3A%7B%22field%22%3A%22deletedAt%22%2C%22null_value%22%3Atrue%7D%7D%2C%7B%22terms%22%3A%7B%22tags%22%3A%5B%22webmaker%3Atemplate%22%5D%2C%22execution%22%3A%22and%22%7D%7D%5D%7D%2C%22query%22%3A%7B%22match_all%22%3A%7B%7D%7D%7D%7D%2C%22size%22%3A9%2C%22from%22%3A0%2C%22sort%22%3A%5B%7B%22createdAt%22%3A%22desc%22%7D%5D%7D",
//      data: { },
      type: "GET",
      timeout: 3000,
      dataType: "text", // "xml", "json"
      success: function(data) {
          // show text reply as-is (debug)
          var makes = new Space(JSON.parse(data))
   //       console.log(makes.toString())
          makes = makes.get('makes')
          makes.each(function (key, value) {
            var template = $('#MakeTemplate').clone()
      //      template.text(value.get('title'))
      
            template.css({
              'background-image' : 'url(' + value.get('thumbnail') + ')'
            })
            template.on('click', function () {
              var url = value.get('url').replace('https://webmaker.makes.org/', 'https://s3.amazonaws.com/makes.org/webmaker/') + '_'
              console.log(url)
//              https://s3.amazonaws.com/makes.org/webmaker/thimble/postcard-for-a-friend_
// https://webmaker.makes.org/
              Launcher.open('Boston')
              Boston.menu.create()
              Boston.import(url)
            })
            $('#Makes').append(template)
            
            template.show()
          })
          // show xml field values (debug)
          //alert( $(data).find("title").text() );

          // loop JSON array (debug)
          //var str="";
          //$.each(data.items, function(i,item) {
          //  str += item.title + "\n";
          //});
          //alert(str);
      },
      error: function(jqXHR, textStatus, ex) {
          alert(textStatus + "," + ex + "," + jqXHR.responseText);
      }
  });
}

WebMaker.on('open' , function () {
  if ($('.MakeTemplate').length < 2)
    WebMaker.fetch()
})

