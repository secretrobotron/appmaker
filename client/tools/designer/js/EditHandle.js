
Designer.EditHandle = {}

Designer.EditHandle.create = function (scrap) {
  var element = scrap.element()
  var container = $('<div class="DesignerEditHandle"></div>')
  container.attr('value', scrap.getPath())
  container.addClass('handle editHandle ' + scrap.id + 'Handle')
  
  var edit = $('<div class="DesignerEditStyleHandle"></div>')
  edit.on('tap', function () {
    Designer.styleEditor.edit(scrap)
    container.remove()
    return false
  })
  container.append(edit)
  
  
  // Tool to turn it into %
  if (Designer.advanced) {
  var percent = $('<div class="">%</div>')
  percent.on('tap', function () {
    if (scrap.get('style width') && scrap.get('style width').match('%'))
      scrap.toPixels()
    else
      scrap.toPercentage()
    Designer.stage.commit()
    element.deselect()
    return false
  })
  container.append(percent)

  // Toggle position
  var pos = $('<div class="">Pos</div>')
  pos.on('tap', function () {
    if (scrap.get('style position') === 'absolute')
      scrap.toRelative()
    else
      scrap.toAbsolute()
    Designer.stage.commit()
    element.deselect()
    return false
  })
  container.append(pos)
  }
  
  element.parent().append(container)
  container.on("update", Designer.EditHandle.update)
  container.trigger("update")
}

Designer.EditHandle.update = function () {
  var owner = $(this).owner()
  $(this).css({
  "left" : owner.position().left + 2 + "px",
  "top" : owner.position().top + owner.outerHeight(true) + 4 + "px"
  })
}

