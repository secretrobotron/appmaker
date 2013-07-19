/**
 * Appends scraps to DOM.
 *
 * @param {bool} Whether to render them with javascript or just html+css.
 */
Page.prototype.render = function (context) {
  
  this.each(function (key, value) {
    value.render(context)
  })
  return this
}
