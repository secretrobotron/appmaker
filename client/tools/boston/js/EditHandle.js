
Boston.EditHandle = {}

Boston.EditHandle.create = function (scrap) {
  var element = scrap.element()
  var container = $('<div class="BostonEditHandle"></div>')
  container.attr('value', scrap.getPath())
  container.addClass('handle editHandle ' + scrap.id + 'Handle')
  
  var edit = $('<div class="BostonEditStyleHandle"></div>')
  edit.on('tap', function () {
    Boston.styleEditor.edit(scrap)
    container.remove()
    return false
  })
  container.append(edit)
  
  /*
  // Tool to turn it into %
  var percent = $('<div class="BostonEditStyleHandle">%</div>')
  percent.on('tap', function () {
    if (scrap.get('style width') && scrap.get('style width').match('%'))
      scrap.toPixels()
    else
      scrap.toPercentage()
    Boston.stage.commit()
    return false
  })
  container.append(percent)

  // Toggle position
  var pos = $('<div class="BostonEditStyleHandle">Pos</div>')
  pos.on('tap', function () {
    if (scrap.get('style position') === 'absolute')
      scrap.toRelative()
    else
      scrap.toAbsolute()
    Boston.stage.commit()
    return false
  })
  container.append(pos)
  */
  
  
  element.parent().append(container)
  container.on("update", Boston.EditHandle.update)
  container.trigger("update")
}

Boston.EditHandle.update = function () {
  var owner = $(this).owner()
  $(this).css({
  "left" : owner.position().left + 2 + "px",
  "top" : owner.position().top + owner.outerHeight(true) + 4 + "px"
  })
}

