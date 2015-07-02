(function($){

  'use strict';

  var MHEAudio = function(el){
    this.$el          = $(el);
    this.playPause    = $(el + ' .playPause');
    this.muteUnmute   = $(el + ' .muteUnmute');
    this.scrobbler    = $(el + ' .scrobbler');
    this.volume       = $(el + ' .volume');
    this.audioURL     = $(el).data('audiourl');
    this.song         = new Audio(this.audioURL);
    this.song.type    = 'audio/mpeg';
    this.song.src     = this.audioURL;
    this.isMuted      = false;
    this.isPlaying    = false;
    this.previousVolume = 10;

    this.playPause.addClass('isPaused');
    this.muteUnmute.addClass('isUnmuted');
    this.volume.val(this.previousVolume);

    this.addEvents();
  };

  MHEAudio.prototype.addEvents = function(){
    this.playPause.on('click', $.proxy(this.togglePlayback, this));
    this.muteUnmute.on('click', $.proxy(this.toggleVolume, this));
    this.volume.on('change', $.proxy(this.updateVolume, this));
    this.scrobbler.on('change', $.proxy(this.updateSongPosition, this));
    this.scrobbler.on('mousedown', $.proxy(this.startDrag, this));
    this.scrobbler.on('mouseup', $.proxy(this.stopDrag, this));
    this.song.addEventListener('timeupdate', $.proxy(this.updateScrobbler, this));
  };
  
  MHEAudio.prototype.startDrag = function(){
    $(this.scrobbler).attr('max', this.song.duration);
    if(this.isPlaying === true){
      this.song.pause();
    }
  };

  MHEAudio.prototype.stopDrag = function(){
    if(this.isPlaying === true){
      this.song.play();
    }
  };

  MHEAudio.prototype.updateSongPosition = function(){
    this.song.currentTime = $(this.scrobbler).val();
    console.log($(this.scrobbler).val());
  };
  
  MHEAudio.prototype.updateScrobbler = function(){
    var curtime = parseInt(this.song.currentTime, 10);
    $(this.scrobbler).val(curtime);
  };

  MHEAudio.prototype.togglePlayback = function(){
    if(this.isPlaying === false){
      $(this.playPause).removeClass('isPaused').addClass('isPlaying');
      this.song.play();
      this.isPlaying = true;
    } else {
      $(this.playPause).removeClass('isPlaying').addClass('isPaused');
      this.song.pause();
      this.isPlaying = false;
    }
  };

  MHEAudio.prototype.toggleVolume = function(){
    if(this.isMuted){
      this.isMuted = false;
      this.song.volume = this.previousVolume * 0.1;
      $(this.volume).val(this.previousVolume);
      $(this.muteUnmute).removeClass('isMuted').addClass('isUnmuted');
    } else {
      this.isMuted = true;
      this.song.volume = 0;
      $(this.volume).val(0);
      $(this.muteUnmute).removeClass('isUnmuted').addClass('isMuted');
    }
  };
  
  MHEAudio.prototype.updateVolume = function(){
    var i = $(this.volume).val();
    this.song.volume = i * 0.1;
    if(i === 0){
      $(this.muteUnmute).addClass('isMuted');
    } else {
      this.previousVolume = i;
      $(this.muteUnmute).addClass('isUnmuted');
    }
  };

  function Plugin(){
    var that = this;
    return this.each(function(){
      if(!this.instance){
        this.instance = new MHEAudio(that.selector);
      }
    });
  }

  $.fn.mheAudio = Plugin;
  $.fn.mheAudio.Constructor = MHEAudio;

})(jQuery);
