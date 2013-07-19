/**
 * A grid object looks like:
 * radius 15
 * type dynamic
 * verticalSpacing 100
 * horizontalSpacing 100
 * snaplines true
 * on true
 * visible false
 * points
 *  0.0
 *   x 0
 *   y 0
 *   selector #scrap2
 *  10.21
 *   x 10
 *   y 21
 *   selector #scrap3
 *
 * @param {object}
 */
function Grid (obj) {
  this.points = {}
  this.radius = 7
  this.snapToObjects = true
  this.snapToGrid = false
  this.snapToContainer = true
  this.verticalSpacing = 20
  this.horizontalSpacing = 20
  this.snaplines = true
  this.on = true
  this.visible = false
  if (obj) {
    for (var i in obj) {
      if (obj.hasOwnProperty(i))
        this[i] = obj[i]
    }
  }
}

/**
 * 
 */
Grid.prototype.addDynamicPoints = function () {

  var grid = this
  // Cap grid at 200 elements for now
  if ($('#PrototypeStageBody #body').children('.scrap:not(.selection)').length > 200)
    return true
  $('#PrototypeStageBody #body').children('.scrap:not(.selection)').each(function(){
    // Make sure no problem fetching scrap
    var scrap = $(this).scrap()
    if (scrap)
      grid.addPoints(scrap.selector())
  })
}

/**
 * 
 */
Grid.prototype.addFixedPoints = function () {


  // verticals
  var start = $('#PrototypeStageBody').position().left
  var end = $('#PrototypeStageBody').position().left + $('#PrototypeStageBody').outerWidth()
  this.horizontalSpacing = parseFloat(this.horizontalSpacing)
  for (var i = start; i <= end; i = i + this.horizontalSpacing) {
    this.addPoint(i, 0, '#PrototypeStageBody')  
  }
  
  start = $('#PrototypeStageBody').position().top
  end = $('#PrototypeStageBody').position().top + $('#PrototypeStageBody').outerHeight()
  this.verticalSpacing = parseFloat(this.verticalSpacing)
  for (var i = start; i <= end; i = i + this.verticalSpacing) {
    this.addPoint(0, i, '#PrototypeStageBody')  
  }

}

/**
 * @param {number}
 * @param {number}
 * @param {string}
 * Adds a point to the grid
 */
Grid.prototype.addPoint = function (x, y, selector) {
  var point = {},
      id = x + '.' + y
  point.x = x
  point.y = y
  point.selector = selector
  this.points[id] = point
}

/**
 * Computes 3 points from a jQuery object
 * @param {string}
 */
Grid.prototype.addPoints = function (selector) {
  
  var element = $(selector)
  if (!element.length)
    return console.log('not found %s', selector)
  this.addPoint(element.position().left, element.position().top, selector)
  var middle = Math.round(element.position().top + Math.round(element.outerHeight()/2))
  var center = Math.round(element.position().left + Math.round(element.outerWidth()/2))
  this.addPoint(center, middle, selector)
  this.addPoint(element.position().left + element.outerWidth(), element.position().top + element.outerHeight(), selector)  
}

/**
 * 
 */
Grid.prototype.create = function () {
  
  
  this.points = {}
  if (!this.on) {
//    this.points.clear()
    return this.erase()
  }
  
  if (this.snapToObjects)
    this.addDynamicPoints()
  
  if (this.snapToGrid)
    this.addFixedPoints()
  
  if (this.snapToContainer) {
    // We create these in specific order so that the bigger scraps override the little ones.
    // left
//    this.addPoint(0, $('#PrototypeStageBody').position().top, '#PrototypeStageBody')
    // right
    this.addPoint($('#PrototypeStageBody').outerWidth(), 0, '#PrototypeStageBody')
    // center
    this.addPoint(Math.round($('#PrototypeStageBody').outerWidth()/2), 0, '#PrototypeStageBody')
    // top
    this.addPoint(0, 0, '#PrototypeStageBody')
    // bottom
    this.addPoint(0, $('#PrototypeStageBody').height(), '#PrototypeStageBody')
    // middle
    this.addPoint(0, Math.round($(window).height()/2), '#PrototypeStageBody')
    
  }
  
  if (this.visible)
    this.draw()
  
  else
    this.erase()

}

/**
 * 
 */
Grid.prototype.draw = function () {
  
  var width = $("#PrototypeStageBody").width()
  var height = $("#PrototypeStageBody").height()
  
  if (this.context)
    this.erase()
  
  var canvas = '<canvas style="position: absolute; top: 0; left: 0; z-index: 0;" id="grid_canvas" width="' + width + '" height="' + height + '"></canvas>'
  $('#PrototypeStageBody').append(canvas)
  
  this.context = document.getElementById('grid_canvas').getContext('2d')
  this.context.strokeStyle = '#eee'
  
  var lines = {}
  
  lines.x = {}
  lines.y = {}
  
  for (var i in this.points) {
    
    if (!this.points.hasOwnProperty(i))
      continue
    
    var point = this.points[i]
    
    // Dont draw lines based on objects
    if (point.selector !== '#PrototypeStageBody')
      continue
    
    this.context.lineWidth = 0.5
    // Dont redraw lines
    if (!(point.x in lines.x)) {
      this.context.beginPath()
      this.context.moveTo(point.x + .5, 0)
      this.context.lineTo(point.x + .5, height)
      this.context.closePath()
      this.context.stroke()
      lines.x[point.x] = true
    }
    
    if (!(point.y in lines.y)) {
      this.context.beginPath()
      this.context.moveTo(0, point.y + .5)
      this.context.lineTo(width, point.y + .5)
      this.context.closePath()
      this.context.stroke()
      lines.y[point.y] = true
    }
    
  }
  
}


/**
 * @param {obj}
 * @param {obj}
 */
Grid.prototype.drawSnapline = function (point1, point2) {
  
  if (!this.snaplines) return false
  
  this.drawSnaplineCanvas()
  this.snaplineContext.beginPath()
  this.snaplineContext.lineWidth = 1
  this.snaplineContext.moveTo(point1.x + .5, point1.y + .5)
  this.snaplineContext.lineTo(point2.x + .5, point2.y + .5)
  this.snaplineContext.stroke()
  
  //draw a circle
  
  this.snaplineContext.moveTo(point1.x, point1.y)
  this.snaplineContext.beginPath()
  this.snaplineContext.arc(point1.x, point1.y, 2, 0, Math.PI*2, true)
  this.snaplineContext.closePath()
  this.snaplineContext.fill()
  
  this.snaplineContext.moveTo(point2.x, point2.y)
  this.snaplineContext.beginPath()
  this.snaplineContext.arc(point2.x, point2.y, 2, 0, Math.PI*2, true)
  this.snaplineContext.closePath()
  this.snaplineContext.fill()
  
//  console.log(point2.selector)
  
  // Dont draw lines based on objects
  if (point2.selector !== '#PrototypeStageBody')
    $(point2.selector).addClass('GridSnapOrigin')
}

/**
 */
Grid.prototype.drawSnaplineCanvas = function () {
  
  if (this.snaplineContext)
    return true
  
  this.width = $("#PrototypeStageBody").width()
  this.height = $("#PrototypeStageBody").height()
  
  var canvas = '<canvas style="position: absolute; top: 0; left: 0; z-index: 100;" id="snaplineCanvas" width="' + this.width + '" height="' + this.height + '"></canvas>'
  $('#PrototypeStageBody').append(canvas)
  
  this.snaplineContext = document.getElementById('snaplineCanvas').getContext('2d')
  this.snaplineContext.lineWidth = 1
  this.snaplineContext.strokeStyle = 'blue'
  
  // Sometimes it gets stuck(ie when someone is snapping then right clicks). This lets you click it to remove it.
  $('#snaplineCanvas').on('mousedown', function () {
    $(this).remove()
  })
}

/**
 */
Grid.prototype.erase = function () {
  delete this.context
  delete this.snaplineContext
  $('#grid_canvas,#snaplineCanvas').remove()
  $('.GridSnapOrigin').removeClass('GridSnapOrigin')
}

/**
 */
Grid.prototype.eraseSnaplines = function () {
  
  if (!this.snaplines) return false
  
  $('.GridSnapOrigin').removeClass('GridSnapOrigin')
  
  if (!this.snaplineContext)
    return false
  // I have lots of transforms right now
//  this.snaplineContext.save()
///  this.snaplineContext.setTransform(1, 0, 0, 1, 0, 0)
  // Will always clear the right space
  this.snaplineContext.clearRect(0, 0, this.width, this.height)
//  this.snaplineContext.restore()
  // Still have my old transforms
}

/**
 * todo: make sure grid is sorted so this is blazing fast!
 * @return {object} change.x, change.y
 */
Grid.prototype.getDelta = function (scrapPoints) {
  this.eraseSnaplines()
  
  var change = {}
  var xPair = []
  var yPair = []
  // Check all 3 points. We are looking for the closest link.
  for (var i in scrapPoints) {
    var scrapPoint = scrapPoints[i]
    // compute the smallest 3 x difference to each point
    for (var j in this.points) {
      if (!this.points.hasOwnProperty(j))
        continue
      var gridPoint = this.points[j]
      
      var xDifference = gridPoint.x - scrapPoint.x
      var yDifference = gridPoint.y - scrapPoint.y
      
      // Initialize values
      if (!change.x) {
        change.x = xDifference
        change.y = yDifference
      }
      
      // If this point difference is closer, use it.
      if (Math.abs(xDifference) <= Math.abs(change.x)) {
        change.x = xDifference
        xPair = [scrapPoint, gridPoint]
      }
      if (Math.abs(yDifference) <= Math.abs(change.y)) {
        change.y = yDifference
        yPair = [scrapPoint, gridPoint]
      }
    }

  }
  
  
  var xSnapped = Math.abs(change.x) < this.radius
  var ySnapped = Math.abs(change.y) < this.radius
  
  if (!xSnapped) change.x = 0
  if (!ySnapped) change.y = 0
  
  // The scrap points may have shifted in 2 directions, so make sure
  // we are drawing the *new* scrap points when we draw the snapline.
  if (xSnapped) {
    xPair[0] = {
      x : xPair[0].x + change.x,
      y : xPair[0].y + change.y
    }
    this.drawSnapline(xPair[0], xPair[1])
  }
  if (ySnapped) {
    yPair[0] = {
      x : yPair[0].x + change.x,
      y : yPair[0].y + change.y
    }
    this.drawSnapline(yPair[0], yPair[1])
  }
  
  return change
  

  
}

/**
 */
Grid.prototype.removeSnaplines = function () {
  delete this.snaplineContext
  $('#snaplineCanvas').remove()
  $('.GridSnapOrigin').removeClass('GridSnapOrigin')
}

