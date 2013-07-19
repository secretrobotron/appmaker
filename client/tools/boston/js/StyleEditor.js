Boston.styleEditor = {}
Boston.styleEditor.livePreviewScrap = false
Boston.styleEditor.livePreviewTimeout = false
Boston.styleEditor.livePreviewStart = function () {
  clearTimeout(Boston.styleEditor.livePreviewTimeout)
  Boston.styleEditor.livePreviewTimeout = setTimeout('Boston.styleEditor.livePreview()', 500)
}
Boston.styleEditor.livePreview = function () {
  var text_area = $('#BostonStyleEditorCssEditor')
  var scrap = Boston.styleEditor.livePreviewScrap
  scrap.set('style', new Space(text_area.val()))
  scrap.element().attr('style', '').css(scrap.get('style').values)
}

Boston.styleEditor.edit = function (scrap) {
  
  $('.handle').remove()
  
  // Insert Modal
  var modal_screen = $('<div id="BostonStyleEditorModal"/>')
  modal_screen.on('tap mousedown click slide slidestart slideend mouseup', function (event) {
    event.stopPropagation()
  })
  modal_screen.on('click', function () {
    save_button.trigger('click')
  })
  $('body').append(modal_screen)
  
  var element = scrap.element()
  
  // Create styleEditor div
  // width 295px
  // height 320px
  var styleEditor = $('<div id="BostonStyleEditor"></div>')
  
  styleEditor.css({
    "left" : element.offset().left + 2 + "px",
    "top" : element.offset().top + element.outerHeight() + 4 + "px"
  })
  
  // Insert top bar
  var top_edit_bar = $('<div id="BostonStyleEditorTopBar"></div>')
  styleEditor.append(top_edit_bar)
  
  // Style tool
  var styleTool = $('<div class="editorOption selectedEditorOption">Block</div>')
  styleTool.on('tap', function () {
    $('div').removeClass('selectedEditorOption')
    $(this).addClass('selectedEditorOption')
    text_area.hide()
    textEditorContainer.hide()
    styleEditorContainer.show()
    return false
  })
  top_edit_bar.append(styleTool)
  
  // Text tool
  var textTool = $('<div class="editorOption">Text</div>')
  textTool.on('tap', function () {
    $('div').removeClass('selectedEditorOption')
    $(this).addClass('selectedEditorOption')
    styleEditorContainer.hide()
    text_area.hide()
    if (scrap.get('style'))
      text_area.val(scrap.get('style'))
    textEditorContainer.show()
    return false
  })
  top_edit_bar.append(textTool)
  
  // Code tool
  var codeTool = $('<div class="editorOption">Code</div>')
  codeTool.on('tap', function () {
    $('div').removeClass('selectedEditorOption')
    $(this).addClass('selectedEditorOption')
    styleEditorContainer.hide()
    textEditorContainer.hide()
    if (scrap.get('style'))
      text_area.val(scrap.get('style'))
    text_area.show()
    return false
  })
  top_edit_bar.append(codeTool)
  
  // Style Editor Container
  var styleEditorContainer = $('<div id="blockContainer"></div>')
  styleEditor.append(styleEditorContainer)
  
  /*
   * Color Options
   */
   
   var currentColor = $('.selection').css('background-color');
   
   // Picker - Background Color
   var colorPicker = $('<div class="colorBackground"><input type="text" class="colorPicker"></div>')
   styleEditorContainer.append(colorPicker)
   
   // Duplicate
   var duplicate = $('<div class="editorButton"><img src="/nudgepad/public/images/dup_lt.png"></div>')
   duplicate.on("click", function(){
     Boston.stage.selection.duplicate();
   })
   styleEditorContainer.append(duplicate)
   
   // Lock tool
   var lock = $('<div class="editorButton"><img src="/nudgepad/public/images/lock_lt.png"></div>')
   lock.on('tap', function () {
     Boston.stage.selection.patch('locked true')
     save_button.trigger('click')
     return false
   })
   styleEditorContainer.append(lock)
   
   // Link Select/Dropdown
   var linkOptions = $('<select id="nudgepadLinkSelect"></select>')
   
   // Remove link or cancel
   var noLink = $('<option>No link</option>')
   noLink.on('click', function () {
     Boston.stage.selection.patch('href ')
   })
   linkOptions.append(noLink)
   
   // Create a link to existing page
   _.each(Project.values.pages.values, function (value, name) {
     var link = $('<option value="' + name + '">' + ToProperCase(name) + '</option>')
     link.on('click', function () {
       Boston.stage.selection.patch('tag a\nhref ' + $(this).attr('value'))
     })
     linkOptions.append(link)
   })
   
   // Create a link to a new page that doesnt exist
   var newPageLink = $('<option>New Page</option>')
   newPageLink.on('click', function () {
     var linkUrl = prompt('Enter the name of your new page', Boston.nextName(Boston.stage.activePage))
     if (linkUrl) {
       linkUrl = Permalink(linkUrl)
       Boston.stage.selection.patch('tag a\nhref ' + linkUrl)
       save_button.trigger('click')
       var currentPage = Boston.stage.activePage
       Boston.duplicatePage(null, linkUrl, true)
       Boston.stage.open(currentPage)
     }
   })
   linkOptions.append(newPageLink)
  
   // Create a link to an external url
   var externalLink = $('<option>External Link</option>')
   externalLink.on('click', function () {
     var linkUrl = prompt('Enter the url to link to', 'http://')
     if (linkUrl)
       Boston.stage.selection.patch('tag a\nhref ' + linkUrl)
   })
   linkOptions.append(externalLink)
   
   linkOptions.css({
      'display' : 'none',
      'position' : 'absolute',
      'z-index' : '100000'  
   })
   linkOptions.attr('size', linkOptions.find('option').length)
   linkOptions.on('click', function () {
     linkOptions.hide()
     return false
   })
   styleEditorContainer.append(linkOptions)

   // Link tool
   var link = $('<div class="editorButton"><img src="/nudgepad/public/images/link_lt.png"></div>')
   link.on('tap', function () {
     linkOptions.css({
       'left' : $(this).position().left,
       'top' : $(this).position().top
     })
     linkOptions.show()
     return false
   })
   styleEditorContainer.append(link)
   
   // Moveup tool
   var moveUp = $('<div class="editorButton"><img src="/nudgepad/public/images/up_lt.png" title="Increase z-index"></div>')
   moveUp.on('tap', function () {
     $('.selection').each(function () {
        $(this).scrap().moveUp()  
      })
     text_area.val(scrap.get('style'))
     return false
   })
   styleEditorContainer.append(moveUp)
   
   // Movedown tool
   var moveDown = $('<div class="editorButton"><img src="/nudgepad/public/images/down_lt.png" title="Decrease z-index"></div>')
   moveDown.on('tap', function () {
     $('.selection').each(function () {
       $(this).scrap().moveDown()  
     })
     text_area.val(scrap.get('style'))
     return false
   })
   styleEditorContainer.append(moveDown)
   
   // Clear
   var clear = $('<div class="clear"></div>')
   styleEditorContainer.append(clear)
  
  // Column - Left
  var columnLeft = $('<div class="columnLeft"></div>')
  styleEditorContainer.append(columnLeft)
  
  // Header - Roundness
  var headerRoundness = $('<div class="editorHeader">Curve</div>')
  columnLeft.append(headerRoundness)
  
  // Button - Roundness1
  var buttonRoundness1 = $('<div id="roundessOne" class="toolButton toolButtonOne">0</div>')
  buttonRoundness1.on('click', function () {
    Boston.stage.selection.cssPreview('border-radius 0px 0px 0px 0px')
    Boston.stage.commit()
    $('.handle').trigger('update')
    return false
  })
  columnLeft.append(buttonRoundness1)
  
  // Button - Roundness2
  var buttonRoundness2 = $('<div id="roundessTwo" class="toolButton toolButtonTwo">4</div>')
  buttonRoundness2.on('tap', function () {
    Boston.stage.selection.cssPreview('border-radius 4px 4px 4px 4px')
    Boston.stage.commit()
    $('.handle').trigger('update')
    return false
  })
  columnLeft.append(buttonRoundness2)
  
  // Button - Roundness2
  var buttonRoundness3 = $('<div class="toolButton toolButtonTwo">10</div>')
  buttonRoundness3.on('tap', function () {
    Boston.stage.selection.cssPreview('border-radius 10px 10px 10px 10px')
    Boston.stage.commit()
    $('.handle').trigger('update')
    return false
  })
  columnLeft.append(buttonRoundness3)
  
  // Button - Roundness3
  var buttonRoundness4 = $('<div class="toolButton toolButtonThree">50</div>')
  buttonRoundness4.on('tap', function () {
    Boston.stage.selection.cssPreview('border-radius 50px 50px 50px 50px')
    Boston.stage.commit()
    $('.handle').trigger('update')
    return false
  })
  columnLeft.append(buttonRoundness4)
  
  // Clear
  var clear = $('<div class="clear"></div>')
  columnLeft.append(clear)
  
  // Header - Border
  var headerBorder = $('<div class="editorHeader">Border</div>')
  columnLeft.append(headerBorder)
  
  // Button - BorderColor
  var currentBorderColor = $('.selection').css('border-color');
  
  // Picker - Border Color
  var colorBorderPicker = $('<div class="colorBorder"><input type="text" class="colorBorderPicker toolButton toolButtonOne"></div>')
  columnLeft.append(colorBorderPicker)
  
  // Button - Border
  var buttonBorder2 = $('<div class="toolButton toolButtonTwo">0</div>')
  buttonBorder2.on('tap', function () {
    Boston.stage.selection.cssPreview('border none')
    Boston.stage.commit()
    $('.handle').trigger('update')
    return false
  })
  columnLeft.append(buttonBorder2)
  
  // Button - Border
  var buttonBorder3 = $('<div class="toolButton toolButtonTwo">1</div>')
  buttonBorder3.on('tap', function () {
    Boston.stage.selection.cssPreview('border 1px solid ' + currentBorderColor)
    Boston.stage.commit()
    $('.handle').trigger('update')
    return false
  })
  columnLeft.append(buttonBorder3)
  
  // Button - Border
  var buttonBorder4 = $('<div class="toolButton toolButtonThree">5</div>')
  buttonBorder4.on('tap', function () {
    Boston.stage.selection.cssPreview('border 5px solid ' + currentBorderColor)
    Boston.stage.commit()
    $('.handle').trigger('update')
    return false
  })
  columnLeft.append(buttonBorder4)
  
  // Column - Right
  var columnRight = $('<div class="columnRight"></div>')
  styleEditorContainer.append(columnRight)
  
  // Header - Opacity
  var headerOpacity = $('<div class="editorHeader">Opacity</div>')
  columnRight.append(headerOpacity)
  
  // Button - Opacity
  var buttonOpacity1 = $('<div class="toolButton toolButtonOne">1</div>')
  buttonOpacity1.on('tap', function () {
    Boston.stage.selection.cssPreview('opacity 1')
    Boston.stage.commit()
    $('.handle').trigger('update')
    return false
  })
  columnRight.append(buttonOpacity1)
  
  // Button - Opacity
  var buttonOpacity2 = $('<div id="opacityOne" class="toolButton toolButtonTwo">.8</div>')
  buttonOpacity2.on('tap', function () {
    Boston.stage.selection.cssPreview('opacity .8')
    Boston.stage.commit()
    $('.handle').trigger('update')
    return false
  })
  columnRight.append(buttonOpacity2)
  
  // Button - Opacity
  var buttonOpacity3 = $('<div class="toolButton toolButtonTwo">.5</div>')
  buttonOpacity3.on('tap', function () {
    Boston.stage.selection.cssPreview('opacity .5')
    Boston.stage.commit()
    $('.handle').trigger('update')
    return false
  })
  columnRight.append(buttonOpacity3)
  
  // Button - Opacity4
  var buttonOpacity4 = $('<div class="toolButton toolButtonThree">.2</div>')
  buttonOpacity4.on('tap', function () {
    Boston.stage.selection.cssPreview('opacity .2')
    Boston.stage.commit()
    $('.handle').trigger('update')
    return false
  })
  columnRight.append(buttonOpacity4)
  
  // Clear
  var clear2 = $('<div class="clear"></div>')
  columnRight.append(clear2)
  
  // Header - Shadow
  var headerOpacity = $('<div class="editorHeader">Shadow</div>')
  columnRight.append(headerOpacity)
  
  // Button - Shadow
  var buttonShadow1 = $('<div class="toolButton toolButtonOne">0</div>')
  buttonShadow1.on('tap', function () {
    Boston.stage.selection.cssPreview('box-shadow none')
    Boston.stage.commit()
    $('.handle').trigger('update')
    return false
  })
  columnRight.append(buttonShadow1)
  
  // Button - Shadow
  var buttonShadow2 = $('<div id="shadowOne" class="toolButton toolButtonTwo">Out</div>')
  buttonShadow2.on('tap', function () {
    Boston.stage.selection.cssPreview('box-shadow 0px 1px 3px rgba(0,0,0,.6)')
    Boston.stage.commit()
    $('.handle').trigger('update')
    return false
  })
  columnRight.append(buttonShadow2)
  
  // Button - Shadow
  var buttonShadow3 = $('<div id="shadowTwo" class="toolButton toolButtonTwo">In</div>')
  buttonShadow3.on('tap', function () {
    Boston.stage.selection.cssPreview('box-shadow inset 0px 1px 3px rgba(0,0,0,.6)')
    Boston.stage.commit()
    $('.handle').trigger('update')
    return false
  })
  columnRight.append(buttonShadow3)
  
  // Button - Shadow
  var buttonShadow4 = $('<div id="ShadowThree" class="toolButton toolButtonThree">All</div>')
  buttonShadow4.on('tap', function () {
    Boston.stage.selection.cssPreview('box-shadow 0px 0px 0px 4px rgba(0,0,0,.2)')
    Boston.stage.commit()
    $('.handle').trigger('update')
    return false
  })
  columnRight.append(buttonShadow4)
  
  // Clear
  var clear = $('<div class="clear"></div>')
  styleEditorContainer.append(clear)
  
  // Insert text editor
  var textEditorContainer = $('<div id="BostonStyleEditorTextEditor"></div>')
  styleEditor.append(textEditorContainer)
  
  var currentFont = $('.selection').css('font-family');
  
  var setCurrentFont = function() {
    $(':input[name=fontFamilyDropdown] option').each(function(i, selected) {
      var selectedText = $(selected).text()
      if (selectedText == currentFont) {
        $(this).attr('selected', 'selected')
      }
    });
  }
  
  // Button - Font Family
  var buttonFontFamily = $('<select id="fontFamily" class="toolButton" name="fontFamilyDropdown"><option>Arial</option><option>Arvo</option><option>Courier</option><option>Helvetica</option><option>Open Sans</option><option>Times</option><option>Titillium Web</option></select>')
  buttonFontFamily.on('change', function () {
    currentFont = $('#fontFamily').val();
    Boston.stage.selection.cssPreview('font-family ' + currentFont)
    Boston.stage.commit()
    $('.handle').trigger('update')
    return false
  })
    textEditorContainer.append(buttonFontFamily)
  
  // Button - Font Color
  var currentFontColor = $('.selection').css('color');
  
  // Picker - Font Color
  var colorFontPicker = $('<div class="colorFont"><input type="text" class="colorFontPicker toolButton toolButtonOne"></div>')
  textEditorContainer.append(colorFontPicker)
  
  var currentFontSize = $('.selection').css('font-size');
  
  var setCurrentFontSize = function() {
    $(':input[name=fontDropdown] option').each(function(i, selected) {
      var selectedText = $(selected).text() + 'px'
      if (selectedText == currentFontSize) {
        $(this).attr('selected', 'selected')
      }
    });
  }
  
  // Button - FontSize
  var buttonFontSize = $('<select id="fontSize" name="fontDropdown"><option>11</option><option>12</option><option>13</option><option>14</option><option>16</option><option>18</option><option>24</option><option>32</option><option>40</option><option>48</option><option>56</option><option>64</option><option>72</option></select>')
  buttonFontSize.on('change', function () {
    currentFontSize = $('#fontSize').val()
    Boston.stage.selection.cssPreview('font-size ' + currentFontSize + 'px')
    Boston.stage.commit()
    $('.handle').trigger('update')
    return false
  })
  textEditorContainer.append(buttonFontSize)
  
  // Button - Auto Resize
  var buttonResize = $('<div id="resize" class="toolButton" title="Auto Resize"><img src="/nudgepad/public/images/contract.png"></div>')
  buttonResize.on('click', function () {
    Boston.stage.selection.cssPreview({
    "width" : "auto",
    "height" : "auto"
    })
    Boston.stage.commit()
    $('.handle').trigger('update')
    return false
  })
  textEditorContainer.append(buttonResize)
  
  // Clear
  var clear = $('<div class="clear"></div>')
  textEditorContainer.append(clear)
  
  // Column - Left
  var columnLeftText = $('<div class="columnLeft"></div>')
  textEditorContainer.append(columnLeftText)
  
  // Header - Alignment
  var headerAlignment = $('<div class="editorHeader">Alignment</div>')
  columnLeftText.append(headerAlignment)
  
  // Button - Alignment
  var buttonAlignment1 = $('<div class="toolButton toolButtonOne"><img src="/nudgepad/public/images/left_lt.png"></div>')
  buttonAlignment1.on('click', function () {
    Boston.stage.selection.cssPreview('text-align left')
    Boston.stage.commit()
    $('.handle').trigger('update')
    return false
  })
  columnLeftText.append(buttonAlignment1)
  
  // Button - Alignment
  var buttonAlignment2 = $('<div class="toolButton toolButtonTwo"><img src="/nudgepad/public/images/center_lt.png"></div>')
  buttonAlignment2.on('click', function () {
    Boston.stage.selection.cssPreview('text-align center')
    Boston.stage.commit()
    $('.handle').trigger('update')
    return false
  })
  columnLeftText.append(buttonAlignment2)
  
  // Button - Alignment
  var buttonAlignment3 = $('<div class="toolButton toolButtonTwo"><img src="/nudgepad/public/images/right_lt.png"></div>')
  buttonAlignment3.on('click', function () {
    Boston.stage.selection.cssPreview('text-align right')
    Boston.stage.commit()
    $('.handle').trigger('update')
    return false
  })
  columnLeftText.append(buttonAlignment3)
  
  // Button - Alignment
  var buttonAlignment4 = $('<div class="toolButton toolButtonThree"><img src="/nudgepad/public/images/justify_lt.png"></div>')
  buttonAlignment4.on('click', function () {
    Boston.stage.selection.cssPreview('text-align justify')
    Boston.stage.commit()
    $('.handle').trigger('update')
    return false
  })
  columnLeftText.append(buttonAlignment4)
  
  // Clear
  var clear = $('<div class="clear"></div>')
  columnLeftText.append(clear)
  
  // Header - Padding
  var headerPadding = $('<div class="editorHeader">Padding</div>')
  columnLeftText.append(headerPadding)
  
  // Button - Padding
  var buttonPadding1 = $('<div class="toolButton toolButtonOne">0</div>')
  buttonPadding1.on('click', function () {
    Boston.stage.selection.cssPreview('padding 0px')
    Boston.stage.commit()
    $('.handle').trigger('update')
    return false
  })
  columnLeftText.append(buttonPadding1)
  
  // Button - Padding
  var buttonPadding2 = $('<div class="toolButton toolButtonTwo">10</div>')
  buttonPadding2.on('click', function () {
    Boston.stage.selection.cssPreview('padding 10px')
    Boston.stage.commit()
    $('.handle').trigger('update')
    return false
  })
  columnLeftText.append(buttonPadding2)
  
  // Button - Padding
  var buttonPadding3 = $('<div class="toolButton toolButtonTwo">20</div>')
  buttonPadding3.on('click', function () {
    Boston.stage.selection.cssPreview('padding 20px')
    Boston.stage.commit()
    $('.handle').trigger('update')
    return false
  })
  columnLeftText.append(buttonPadding3)
  
  // Button - Padding
  var buttonPadding4 = $('<div class="toolButton toolButtonTwo">40</div>')
  buttonPadding4.on('click', function () {
    Boston.stage.selection.cssPreview('padding 40px')
    Boston.stage.commit()
    $('.handle').trigger('update')
    return false
  })
  columnLeftText.append(buttonPadding4)
  
  // Column - Right
  var columnRightText = $('<div class="columnRight"></div>')
  textEditorContainer.append(columnRightText)
  
  // Clear
  var clear = $('<div class="clear"></div>')
  columnRightText.append(clear)
  
  // Header - Line Height
  var headerLineHeight = $('<div class="editorHeader">Line Height</div>')
  columnRightText.append(headerLineHeight)
  
  // Button - LineHeight1
  var buttonLineHeight1 = $('<div id="lineHeightOne" class="toolButton toolButtonOne">100</div>')
  buttonLineHeight1.on('click', function () {
    Boston.stage.selection.cssPreview('line-height 100%')
    return false
  })
  columnRightText.append(buttonLineHeight1)
  
  // Button - LineHeight2
  var buttonLineHeight2 = $('<div id="lineHeightTwo" class="toolButton toolButtonTwo">140</div>')
  buttonLineHeight2.on('click', function () {
    Boston.stage.selection.cssPreview('line-height 140%')
    return false
  })
  columnRightText.append(buttonLineHeight2)
  
  // Button - LineHeight
  var buttonLineHeight3 = $('<div id="lineHeightTwo" class="toolButton toolButtonTwo">180</div>')
  buttonLineHeight3.on('click', function () {
    Boston.stage.selection.cssPreview('line-height 180%')
    return false
  })
  columnRightText.append(buttonLineHeight3)
  
  // Button - LineHeight
  var buttonLineHeight4 = $('<div id="lineHeightThree" class="toolButton toolButtonThree">Mid</div>')
  buttonLineHeight4.on('click', function () {
    var currentHeight = $('.selection').css('height')
    Boston.stage.selection.cssPreview('line-height ' + currentHeight)
    return false
  })
  columnRightText.append(buttonLineHeight4)
  
  // Clear
  var clear6 = $('<div class="clear"></div>')
  columnRightText.append(clear6)
  
  // Header - Style
  var headerTextStyle = $('<div class="editorHeader">Style</div>')
  columnRightText.append(headerTextStyle)
  
  // Button - TextStyle1
  var buttonTextStyle1 = $('<div id="textStyleOne" class="toolButton toolButtonOne">B</div>')
  buttonTextStyle1.on('click', function () {
    Boston.stage.selection.cssPreview('font-weight bold')
    Boston.stage.commit()
    $('.handle').trigger('update')
    return false
  })
  columnRightText.append(buttonTextStyle1)
  
  // Button - TextStyle
  var buttonTextStyle2 = $('<div id="italics" class="toolButton toolButtonTwo">I</div>')
  buttonTextStyle2.on('click', function () {
    Boston.stage.selection.cssPreview('font-style italic')
    Boston.stage.commit()
    $('.handle').trigger('update')
    return false
  })
  columnRightText.append(buttonTextStyle2)
  
  // Button - TextStyle2
  var buttonTextStyle3 = $('<div id="textStyleTwo" class="toolButton toolButtonTwo">U</div>')
  buttonTextStyle3.on('click', function () {
    Boston.stage.selection.cssPreview('text-decoration underline')
    Boston.stage.commit()
    $('.handle').trigger('update')
    return false
  })
  columnRightText.append(buttonTextStyle3)
  
  // Button - TextStyle3
  var buttonTextStyle4 = $('<div id="textStyleThree" class="toolButton toolButtonThree">Auto</div>')
  buttonTextStyle4.on('click', function () {
    Boston.stage.selection.cssPreview({
    "text-decoration" : "none",
    "font-weight" : "normal",
    "font-style" : "normal"
    })
    return false
  })
  columnRightText.append(buttonTextStyle4)
  
  // Clear
  var clear = $('<div class="clear"></div>')
  textEditorContainer.append(clear)
  
  // Insert text_area
  var text_area = $('<textarea id="BostonStyleEditorCssEditor"></textarea>')
  if (scrap.get('style'))
    text_area.val(scrap.get('style'))
  text_area.on('tap mousedown click slide slidestart slideend mouseup', function (event) {
    event.stopPropagation()
  })
  Boston.styleEditor.livePreviewScrap = scrap
  text_area.on('keyup', Boston.styleEditor.livePreviewStart)
  
  styleEditor.append(text_area)
  
  // Insert bottom bar
  var button_container = $('<div id="BostonStyleEditorBottomBar"></div>')
  text_area.append(button_container)
  
  // Insert save button
  var save_button = $('<div id="BostonStyleEditorSaveButton">Save</div>')
  save_button.on('click', function () {
    Boston.stage.commit()
    $('.handle').trigger('update')
    styleEditor.remove()
    modal_screen.remove()
  })
  text_area.append(save_button)
  
  // Insert styleeditor
  $('body').append(styleEditor)
  
  var colorType;
  
  // Insert Color Spectrum Picker
  $(".colorPicker").spectrum({
      color: currentColor,
      move: function(color) {
        Boston.stage.selection.cssPreview('background-color ' + color.toHexString());
        currentColor = color.toHexString();
      },
      change: function(color) {
          $("#basic-log").text("change called: " + color.toHexString());
          currentColor = color.toHexString();
      },
      show: function(color) {
          colorType = "background-color "
      },
      hide: function() {
        Boston.stage.commit()
        $('.handle').trigger('update')
      }
  });
  
  $(".colorBorderPicker").spectrum({
      color: currentBorderColor,
      move: function(color) {
        Boston.stage.selection.cssPreview('border-color ' + color.toHexString());
        currentBorderColor = color.toHexString();
      },
      change: function(color) {
          $("#basic-log").text("change called: " + color.toHexString());
          currentBorderColor = color.toHexString();
      },
      show: function() {
          colorType = "border-color "
      },
      hide: function() {
        Boston.stage.commit()
        $('.handle').trigger('update')
      }
  });
  
  $(".colorFontPicker").spectrum({
      color: currentFontColor,
      move: function(color) {
        Boston.stage.selection.cssPreview('color ' + color.toHexString());
        currentBorderColor = color.toHexString();
      },
      change: function(color) {
          $("#basic-log").text("change called: " + color.toHexString());
          currentBorderColor = color.toHexString();
      },
      show: function() {
          colorType = "color "
      },
      hide: function() {
        Boston.stage.commit()
        $('.handle').trigger('update')
      }
  });
  
  $(document).on('slide slidestart slideend', ".sp-container", function(){return false})
  $('.sp-input[type=text]').on('keydown', function(e) {
      if (e.which == 13) {
          e.preventDefault();
          var inputColor = $(this).val()
          Boston.stage.selection.css(colorType + inputColor);
          return false
      }
  });
  $('.colorFont .sp-replacer').addClass('fontColorButton')
  $('.colorFont .sp-preview').addClass('fontColorLine')
  $('.colorFont .sp-replacer').append('<img src="/nudgepad/public/images/letter.png">')
  $('.colorBorder .sp-replacer').addClass('borderColorButton')
  $('.colorBorder .sp-preview').addClass('borderColorLine')
  $('.colorBackground .sp-replacer').addClass('backgroundColorButton')
  
  setCurrentFontSize();
  setCurrentFont();
  
  // Focus CSS editor
 // text_area.focus()
 // scroll to reveal the styleEditor
  var difference = styleEditor.position().top + styleEditor.outerHeight() - Boston.stage.height()
  if (difference > 0) {
    $('#BostonStage').scrollTop($('#BostonStage').scrollTop() + difference)
    styleEditor.css('top', parseFloat(styleEditor.css('top')) - difference)
  }
  var difference = styleEditor.position().left + styleEditor.outerWidth() - $(window).width()
  if (difference > 0) {
    $('#BostonStage').scrollLeft($('#BostonStage').scrollLeft() + difference)
    styleEditor.css('left', parseFloat(styleEditor.css('left')) - difference)
  }
}
