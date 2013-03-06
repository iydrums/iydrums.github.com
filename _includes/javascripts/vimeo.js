window.cgf = window.cgf || {}
cgf.vm = {
  init: function(){
    $(document).on('click', 'a.vimeo_link', function(e){
      e.preventDefault()
      tpl = "<iframe frameborder='0' src='http://player.vimeo.com/video/" + this.getAttribute('data-id') + "?autoplay=1&title=0&portrait=0' webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>"
      console.log(tpl)
      this.parentNode.innerHTML = tpl
    })
  }
}
