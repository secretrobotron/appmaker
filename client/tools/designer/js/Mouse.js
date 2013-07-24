/**
 * We provide easy access to querying the mouse position and state.
 *
 * @special Singleton.
 */
Designer.Mouse = {}

// Is the mouse down?
Designer.Mouse.isDown = false

/**
 * When a mousedown starts, we keep track of how far the mouse moves. Helpful for
 * drag and drop and drawing stuff.
 */
Designer.Mouse.yChange = 0
Designer.Mouse.xChange = 0
Designer.Mouse.pathDistance = 0

/**
 * Update our Designer.Mouse object
 *
 * @param {object} The mousedown event
 * @return true. Continue propagation.
 */
Designer.Mouse.onmousedown = function (event) {
  //  console.log('mouse down')
  Designer.Mouse.isDown = true
  Designer.Mouse.down = event
  Designer.Mouse.target = event.srcElement || event.originalTarget || event.target
  Designer.Mouse.lastX = event.pageX
  Designer.Mouse.lastY = event.pageY
  Designer.Mouse.pathDistance = 0
  return true
}

/**
 * Update our Designer.Mouse object
 *
 * @param {object} The move event
 * @return true. Continue propagation.
 */
Designer.Mouse.onmousemove = function (event) {
  Designer.Mouse.move = event
//  console.log('mouse move')
  if (!Designer.Mouse.isDown)
    return true
  
  Designer.Mouse.pathDistance += Math.abs(event.pageX - Designer.Mouse.lastX) + Math.abs(event.pageY - Designer.Mouse.lastY)
  Designer.Mouse.lastX = event.pageX
  Designer.Mouse.lastY = event.pageY
  Designer.Mouse.xChange = event.pageX - Designer.Mouse.down.pageX
  Designer.Mouse.yChange = event.pageY - Designer.Mouse.down.pageY
  Designer.Mouse.distance = // a2 + b2 = c2 solving for c
    Math.pow(
      Math.pow(Designer.Mouse.xChange, 2) +
      Math.pow(Designer.Mouse.yChange, 2),
    .5)
  // todo: rotation
  return true
}

/**
 * Update our Designer.Mouse object
 *
 * @param {object} The mouseup event
 * @return true. Continue propagation.
 */
Designer.Mouse.onmouseup = function (event) {
  Designer.Mouse.isDown = false
  Designer.Mouse.xChange = event.pageX - Designer.Mouse.down.pageX
  Designer.Mouse.yChange = event.pageY - Designer.Mouse.down.pageY
  Designer.Mouse.distance = // a2 + b2 = c2 solving for c
    Math.pow(
      Math.pow(Designer.Mouse.xChange, 2) +
      Math.pow(Designer.Mouse.yChange, 2),
    .5)
  return true
}

/**
 * Update our Designer.Mouse object
 *
 * @param {object} The mouseup event
 * @return true. Continue propagation.
 */
Designer.Mouse.onTouchEnd = function (event) {
  Designer.Mouse.isDown = false
  Designer.Mouse.xChange = event.pageX - Designer.Mouse.down.pageX
  Designer.Mouse.yChange = event.pageY - Designer.Mouse.down.pageY
  Designer.Mouse.distance = // a2 + b2 = c2 solving for c
    Math.pow(
      Math.pow(Designer.Mouse.xChange, 2) +
      Math.pow(Designer.Mouse.yChange, 2),
    .5)
  return true
}

/**
 * Update our Designer.Mouse object
 *
 * @param {object} The mousedown event
 * @return true. Continue propagation.
 */
Designer.Mouse.onTouchStart = function (event) {
  //  console.log('mouse down')
  Designer.Mouse.isDown = true
  Designer.Mouse.down = event
  Designer.Mouse.target = event.srcElement || event.originalTarget || event.target
  Designer.Mouse.lastX = event.pageX
  Designer.Mouse.lastY = event.pageY
  Designer.Mouse.pathDistance = 0
  return true
}

/**
 * Update our Designer.Mouse object
 *
 * @param {object} The move event
 * @return true. Continue propagation.
 */
Designer.Mouse.onTouchMove = function (event) {
  Designer.Mouse.move = event
//  console.log('mouse move')
  if (!Designer.Mouse.isDown)
    return true
  
  Designer.Mouse.pathDistance += Math.abs(event.pageX - Designer.Mouse.lastX) + Math.abs(event.pageY - Designer.Mouse.lastY)
  Designer.Mouse.lastX = event.pageX
  Designer.Mouse.lastY = event.pageY
  Designer.Mouse.xChange = event.pageX - Designer.Mouse.down.pageX
  Designer.Mouse.yChange = event.pageY - Designer.Mouse.down.pageY
  Designer.Mouse.distance = // a2 + b2 = c2 solving for c
    Math.pow(
      Math.pow(Designer.Mouse.xChange, 2) +
      Math.pow(Designer.Mouse.yChange, 2),
    .5)
  // todo: rotation
  return true
}

