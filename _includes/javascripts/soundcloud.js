window.cgf = window.cgf || {}

cgf.Song = Backbone.Model.extend({
  defaults: {
    "title": null,
    "id": null,
    "position": null,
    "sound": null
  }
})

cgf.SongView = Backbone.View.extend({
  tagName: "li",
  className: "sc_song",
  initialize: function(){
    this.render()
  },
  render: function(){
    this.$el.html(this.model.get('title'))
  },
  events: {
    "click": "onclick"
  },
  onclick: function(e) {
    this.spinner = new Spinner({
      radius: 8,
      color: '#fff',
      left: '0'
    }).spin(this.el)
    if(this.model.get('sound')){
      this.toggle()
    } else {
      this.load()
    }
  },
  load: function(e) {
    var self = this
    SC.stream("/tracks/" + this.model.get("id"), {
      autoPlay: true,
      onplay: function(){ self.onplay() },
      onpause: function(){ self.onpause() },
      onstop: function(){ self.onpause() },
      whileplaying: function(){ self.whileplaying() }
    }, function(sound){
      self.model.set('sound', sound)
    })
  },
  toggle: function() {
    snd = this.model.get('sound')
    snd.togglePause()
  },
  onplay: function(){
    var self = this
    self.spinner.stop()
    self.$el.addClass("is_playing")
    this.collection.each(function(s){
      snd = s.get('sound')
      if(s != self.model && snd) snd.stop()
    })
  },
  onpause: function(){
    this.spinner.stop()
    this.$el.removeClass("is_playing")
  },
  whileplaying: function(){
  }
})

cgf.Playlist = Backbone.Collection.extend({
  model: cgf.Song,
  comparator: function(song){
    song.get('position')
  },
  initialize: function(args){
    this.el = args.el
    this.$el = $(this.el).empty()
    this.$list = $("<ol />").appendTo(this.$el)
    this.on("add", function(song){
      song_view = new cgf.SongView({model: song, collection: this})
      this.$list.append(song_view.el)
    })
  }
})

cgf.sc = {
  init: function(){
    var self = this;
    SC.initialize({
      client_id: "{{ site.soundcloud_consumer_key }}"
    })
    this.songs = new cgf.Playlist({
      el: document.getElementById("soundcloud_player")
    })
    SC.get("/users/{{ site.soundcloud_user_id }}/tracks", function(res){
      res = res.reverse()
      i = l = res.length
      while(i--) {
        song = res[i]
        s = new cgf.Song({
          title: song.title,
          position: l-i,
          id: song.id,
        })
        self.songs.add(s)
      }
    })
  }
}

