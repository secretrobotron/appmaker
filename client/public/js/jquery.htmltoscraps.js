// https://developer.mozilla.org/en-US/docs/Web/API/DOMParser
/*
 * DOMParser HTML extension
 * 2012-09-04
 * 
 * By Eli Grey, http://eligrey.com
 * Public domain.
 * NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
 */

/*! @source https://gist.github.com/1129031 */
/*global document, DOMParser*/

(function(DOMParser) {
	"use strict";

	var
	  DOMParser_proto = DOMParser.prototype
	, real_parseFromString = DOMParser_proto.parseFromString
	;

	// Firefox/Opera/IE throw errors on unsupported types
	try {
		// WebKit returns null on unsupported types
		if ((new DOMParser).parseFromString("", "text/html")) {
			// text/html parsing is natively supported
			return;
		}
	} catch (ex) {}

	DOMParser_proto.parseFromString = function(markup, type) {
		if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {
			var
			  doc = document.implementation.createHTMLDocument("")
			;
	      		if (markup.toLowerCase().indexOf('<!doctype') > -1) {
        			doc.documentElement.innerHTML = markup;
      			}
      			else {
        			doc.body.innerHTML = markup;
      			}
			return doc;
		} else {
			return real_parseFromString.apply(this, arguments);
		}
	};
}(DOMParser));


$.fn.toSpace = function () {
  var space = new Space()
  var el = $(this)
  var tag = $(this).get(0).tagName.toLowerCase()
  space.set('tag', tag)
  $($(this).get(0).attributes).each(function() {
    space.set(this.nodeName, this.nodeValue)
  })
  
  // if leaf node
  if (!$(this).children().length) {
    
    // Meta is a special case. :(
    if (tag !== 'meta')
      space.set('content', $(this).html())
    else
      space.set('content', $(this).attr('content'))
  
  }
  else {
    var scraps = new Space()
    $(this).children().each(function () {
      var id = $(this).attr('id') || $(this).get(0).tagName.toLowerCase()
      var num = 1
      var nextId = id
      while (scraps.values[nextId]) {
        num++
        nextId = id + num.toString()
      }
      scraps.set(nextId, $(this).toSpace())
    })
    space.set('scraps', scraps)
  }
  return space
}

$.htmlToScraps = function (html) {
  
  var doc = new DOMParser().parseFromString(html, "text/html")
  var space = new Space()
  
  $('html', doc).children().each(function () {
    // Skip whitespace
    if (!$(this).get(0).tagName)
      return true
    var id = $(this).attr('id') || $(this).get(0).tagName.toLowerCase()
    var tag = $(this).get(0).tagName.toLowerCase()
    // Skip br tags
//    if (tag === 'br')
//      return true
    var num = 1
    var nextId = id
    while (space.get(nextId)) {
      num++
      nextId = id + num.toString()
    }
    var scrap = $(this).toSpace()
    space.set(nextId, scrap)
  })
//  iframe.remove()

// does html contain <head>?
// does html contain <body>?
//
  if (html.match(/\<head\>/) && !html.match(/\<body\>/))
    return space.delete('body')
  
  if (html.match(/\<head\>/) && html.match(/\<body\>/))
    return space

  if (!html.match(/\<head\>/) && !html.match(/\<body\>/)) {
    space.delete('head')
    return space.get('body scraps')
  }
  
  if (!html.match(/\<head\>/) && html.match(/\<body\>/)) {
    space.delete('head')
    return space
  }

  return space
}
