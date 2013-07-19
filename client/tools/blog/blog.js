var Blog = new Tool('Blog')
Blog.set('color', 'rgba(224, 54, 52, 1)')
Blog.set('description', 'Add a blog to your project.')
Blog.set('beta', 'true')
Blog.activePost = null

Blog.createPost = function () {
  $('#BlogContent,#BlogTitle').val('')
  $('#BlogAdvanced').val('timestamp ' + new Date().getTime() + '\ntemplate blog')
  $('#BlogPermalink').attr('value', '')
  $('#BlogTitle').focus()
  Blog.activePost = null
}

Blog.deletePost = function () {
  Blog.activePost = null
  var name = Blog.permalink($('#BlogPermalink').attr('value'))
  if (!name)
    return Flasher.error('No post to delete')
  
  if (!Project.get('posts ' + name))
    return Flasher.error('Post does not exist')

  Project.delete('posts ' + name)
}

Blog.editPost = function (name) {
  Blog.activePost = name
  var post = Project.get('posts ' + name)
  $('#BlogContent').val(post.get('content'))
  $('#BlogTitle').val(post.get('title'))
  var postSettings = new Space(post.toString())
  postSettings.delete('title')
  postSettings.delete('content')
  $('#BlogAdvanced').val(postSettings.toString())
  // http://{{document.location.host}}/<a id="permalink" target="_blog"></a>
  $('#BlogPermalink').text('http://' + document.location.host + '/' + name).attr('value', name)
  
  
  $('#BlogPosts div').css('color', '#777')
  // todo: improve this
  $('#BlogPosts div').each(function () {
    if ($(this).attr('value') == Blog.activePost)
      $(this).css('color', '#333')  
  })
  
  $('#BlogContent').focus()
  
}

Blog.install = function () {
  if (!Project.get('posts'))
    Explorer.mkdir('private posts')
}

/**
 * Make a string URL friendly. Turns "$foo Bar%!@$" into "foo-bar"
 *
 * @param {string}
 * @return {object}
 */
Blog.permalink = function (string) {
  if (!string) return ''
  // strip non alphanumeric characters from string and lowercase it.
  return string.toLowerCase().replace(/[^a-z0-9- _\.]/gi, '').replace(/ /g, '-')
}

Blog.refresh = function () {
  $('#BlogPosts').html('')
  if (!Project.get('posts'))
    return true
  _.each(Project.get('posts').keys, function (name) {
    var value = Project.get('posts').get(name)
    var div = $('<div >' + value.get('title') + '</div>')
      .css({
      'color' : '#777',
      'margin-bottom' : '9px',
      'font-size' : '13px'
      })
      .on('click', function () {
        Blog.editPost($(this).attr('value'))
      })
      .attr('value', name)
      .attr('title', name)
    $('#BlogPosts').append(div)
  })
  // Open the last edited post if there is one
  if (Blog.activePost)
    Blog.editPost(Blog.activePost)
  else
    Blog.createPost()
}

Blog.publishPost = function (name) {
  var post = Project.get('posts ' + name)
  var permalink = Blog.permalink(name)
  var template = post.get('template')

  var view = Project.get('pages ' + template)
  if (!view)
    view = Blog.blankTheme

  view = new Page(view.toString())
  var html = view.toHtml()
  html = html.replace('Blog Post Title', post.get('title'))
  html = html.replace('Blog Post Content', post.get('content'))
  
  html = html_beautify(html)
  
  Explorer.set(permalink + '.html', html, function () {
    window.open(name + '.html', 'published')
  })
}

Blog.savePost = function () {

  var name = Blog.permalink($('#BlogPermalink').attr('value'))
  
  if (!name)
    return Flasher.error('Title cannot be blank')

  mixpanel.track('I saved a blog post')
  var post = Project.get('posts ' + name)
  if (!post)
    post = new Space()

  post.set('content', $('#BlogContent').val())
  post.set('title', $('#BlogTitle').val())
  post.patch($('#BlogAdvanced').val())
  
  if (Project.get('posts ' + name))
    Project.set('posts ' + name, post)
  else
    Project.create('posts ' + name, post)
  
  // If they are editing a post and the name has changed,
  // make sure to delete old post
  // Todo: change this! Just make permalink editable.
  if (Blog.activePost && Blog.activePost !== name)
    Project.delete('posts ' + Blog.activePost)
  
  Blog.activePost = name
  
  // Open post in new tab
  Blog.publishPost(name)
}

Blog.updatePermalink = function () {
  var permalink = Blog.permalink($('#BlogTitle').val())
  $('#BlogPermalink').text('http://' + document.location.host + '/' + permalink).attr('value', permalink)
}


