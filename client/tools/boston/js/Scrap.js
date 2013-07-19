/**
 * Launches the default block editor.
 *
 * @param {string} Scrap id
 * @return {Scrap} this
 */
Scrap.prototype.onedit = '' // String, name of app to open.
Scrap.prototype.edit = function (selectAll) {
  var tool = this.get('onedit')
  if (tool && window[tool])
    window[tool].open()
  
  // Default block editor
  else
    Boston.contentEditor.focus(this.selector(), selectAll)

  return this
}

Scrap.prototype.element = function () {
  return $(this.selector())
}

Scrap.prototype.getPath = function () {
  return this.path.replace(/ /g, ' scraps ')
}

Scrap.devFilter = function () {
  this.div.addClass('scrap')
  this.div.attr('path', this.getPath())
//  this.div.attr('page', Boston.stage.activePage)
  this.div.attr('selector', this.selector())
  return this.div.toHtml()
}

/**
 * @return {bool}
 */
Scrap.prototype.isContentEditable = function () {
  var tag = this.get('tag')
  if (tag && tag.match(/^(textarea|input|password|label|button|ul|ol)$/))
    return false
  return true
}

/**
 * @param {number}
 * @param {number}
 * @return {Scrap} this
 */
Scrap.prototype.move = function (x, y) {
  
  // move can adjust multiple properties
  // Cases:
  // left 20%; left 20px; right 20px;
  var css = {}
  var style = this.get('style')
  if (!style) {
    this.set('style', new Space())
    style = this.get('style')
  }
  
  // Move right or left
  if (x) {
    // Move ->
    var left = style.get('left')
    if (typeof left !== 'undefined') {
      css.left = (x + parseFloat(left)) + 'px'
      style.set('left', css.left)
    }
    var right = style.get('right')
    if (typeof right !== 'undefined') {
      css.right = (-x + parseFloat(right)) + 'px'
      style.set('right', css.right)
    }
    if (typeof style.get('margin-left') !== 'undefined') {
      style.set('margin-left', (x + parseFloat(style.get('margin-left'))) + 'px')
      css['margin-left'] = style.get('margin-left')
    }
  }
  // Move up or down
  if (y) {
    if (typeof style.get('top') !== 'undefined') {
      style.set('top', (y + parseFloat(style.get('top'))) + 'px')
      css.top = style.get('top')
    }    
    if (typeof style.get('bottom') !== 'undefined') {
      style.set('bottom', (-y + parseFloat(style.get('bottom'))) + 'px')
      css.bottom = style.get('bottom')
    }
    if (typeof style.get('margin-top') !== 'undefined') {
      style.set('margin-top', (y + parseFloat(style.get('margin-top'))) + 'px')
      css['margin-top'] = style.get('margin-top')
    }
  }
  this.element().css(css)
  return this
}

Scrap.prototype.moveDown = function () {
  if (!this.get('style'))
    this.set('style', new Space())
  
  if (this.get('style z-index') === undefined)
    this.set('style z-index', 0)
  else
    this.set('style z-index', parseFloat(this.get('style z-index')) - 1)
    
  $(this.selector()).css("z-index", this.get('style z-index'))
}

Scrap.prototype.moveUp = function () {
  if (!this.get('style'))
    this.set('style', new Space())
  
  if (this.get('style z-index') === undefined)
    this.set('style z-index', 1)
  else
    this.set('style z-index', parseFloat(this.get('style z-index')) + 1)
    
  $(this.selector()).css("z-index", this.get('style z-index'))
}

Scrap.prototype.parentSelector = function () {
  return this.selector().replace(/\>[^\>]+$/, '') // chop last
}

/**
 * @return this
 */
Scrap.prototype.render = function (index) {

  var tag = this.get('tag')
  // dont render invisibles
  if (tag && tag.match(/title|script|meta/))
    return this
  
  // For head elements, just render their children
  if (tag === 'head') {
    if (this.get('scraps')) {
      this.get('scraps').each(function (key, value) {
        value.render()
      })
    }
    return this
  }
  
  // Throw style tags into a div that we can easily empty
  if (tag && tag.match(/style|link/)) {
    this.setTag()
    this.setContent()
    $('#BostonStageHead').append(this.div.toHtml())
    
    // temporary fix until we turn CSS into pure Space.
    if (tag === 'style') {
      var css = cssToSpace(this.get('content'))
      var bodyProperties = [
        'background',
        'background-color',
        'background-image',
        'background-repeat',
        'background-size',
        'background-attachment',
        'background-position'
      ]
      bodyProperties.forEach(function (property, index) {
        var val = css.get('body ' + property)
        if (!val)
          return true
        $('#BostonStageBody').css(property, val)
      })
    }
    
    return this
  }
  
  // Turn body tags into divs during the render stage
  if (tag && tag === 'body') {
    $('#BostonStageBody').append(this.toHtml(function () {
      this.div.tag = 'div'      
      return this.div.toHtml()
    }))
    return this
  }
  
  // Remove the style, the html, and the script
  if (index)
    $(this.parentSelector()).insertAt(index, this.toHtml(Scrap.devFilter))
  else
    $(this.parentSelector()).append(this.toHtml(Scrap.devFilter))
  return this
}

Scrap.prototype.selector = function () {
  var selector = this.path.replace(/[^a-z0-9\-\.\_ ]/gi, '').replace(/ /g, '>#')
  if (!selector)
    return ''
  return '#BostonStageBody>#' + selector
}

Scrap.prototype.unlock = function () {
  
  if (!this.get('locked'))
    return true
  
  this.delete('locked')
  $(this.selector()).removeClass('lockedScrap')
  return true
  
}

/** Event Handlers **/


/**
 * Prevent leaving of page when you click on blocks that are links
 * or links inside blocks
 *
 * @param {event}
 * @return false
 */
Scrap.disableLinks =  function (event) {
  event.preventDefault()
  return false
}


/**
 * Pop Advanced Handle on Hold
 *
 * @param {event}
 * @return false
 */
Scrap.selectOnTap =  function (event) {
  // blur any focused elements
  if (!$(this).is(':focus'))
    $(':focus').blur()


  // Hold meta key to nest something
  if (Boston.Mouse.down && Boston.Mouse.down.altKey) {
    if (!$(this).hasClass('selection') && $('.selection').length) {
      Boston.stage.selection.nest($(this).attr('path'))
      return false
    }
  }
  

  // If shift key is not down, clear selection first
  if (!Boston.Mouse.down || !Boston.Mouse.down.shiftKey)
    Boston.stage.selection.clear()

  $(this).selectMe()

  // return false to not trigger default events
  return false
}

Scrap.unlock = function () {
  
  var scrap = $(this).scrap()
  
  // Unlock block on hold
  if (scrap.get('locked')) {
    scrap.unlock()
    Boston.stage.commit()
  }
  
  $(this).selectMe()
  return false
}




