Blog.on('close', function () {
  Project.off('change', Blog.refresh)
})

Blog.on('open', function () {
  
  Blog.install()
  Project.on('change', Blog.refresh)
  Blog.refresh()
})

