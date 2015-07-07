(function($){

  'use strict';

  //function MHEAudio(el){
  var MHEAudio = function(el){
    this.$el          = $(el);
    this.playPause    = this.$el.find('.playPause');
    this.muteUnmute   = this.$el.find('.muteUnmute');
    this.scrobbler    = this.$el.find('.scrobbler');
    this.volume       = this.$el.find('.volume');
    this.audioURL     = this.$el.data('audiourl');
    this.song         = new Audio(this.audioURL);
    this.song.type    = this.$el.data('audiotype') || 'audio/mp3';
    this.song.src     = this.audioURL;
    this.isMuted      = false;
    this.isPlaying    = false;
    this.previousVolume = 10;
    this.scrobblerProxy = null;
    this.durationProxy  = null;

    this.playPause.addClass('isPaused');
    this.muteUnmute.addClass('isUnmuted');
    this.volume.val(this.previousVolume);

    this.addEvents();
    return this;
  };

  MHEAudio.prototype.addEvents = function(){
    this.playPause.on('click', $.proxy(this.togglePlayback, this));
    this.muteUnmute.on('click', $.proxy(this.toggleVolume, this));
    this.volume.on('change', $.proxy(this.updateVolume, this));
    this.scrobbler.on('change', $.proxy(this.updateSongPosition, this));
    this.scrobbler.on('mousedown', $.proxy(this.startDrag, this));
    this.scrobbler.on('mouseup', $.proxy(this.stopDrag, this));

    this.scrobblerProxy = $.proxy(this.updateScrobbler, this);
    this.song.addEventListener('timeupdate', this.scrobblerProxy);

    this.durationProxy = $.proxy(this.setDuration, this);
    this.song.addEventListener('durationchange', this.durationProxy);
  };

  MHEAudio.prototype.tearDown = function(){
    this.playPause.unbind();
    this.muteUnmute.unbind();
    this.volume.unbind();
    this.scrobbler.unbind();
    this.song.removeEventListener('timeupdate', this.scrobblerProxy, false);
    this.song.removeEventListener('durationchange', this.durationProxy, false);
    this.song.src = '';
    this.song = null;
    
  };

  MHEAudio.prototype.setDuration = function(){
    $(this.scrobbler).attr('max', this.song.duration);
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
      this.song.volume = (this.previousVolume * 0.1);
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

  function Plugin(opt){
    var args = Array.prototype.slice.call(arguments, 0);

    return this.each(function(){
      var item = $(this);
      var instance = item.data('MHEAudio');
      if(!instance) {
        item.data('MHEAudio', new MHEAudio(this, opt));
      } else {
        if(typeof opt === 'string') {
          instance[opt].apply(instance, args);
        }
      }
    });
  }

  $.fn.mheAudio = Plugin;
  $.fn.mheAudio.Constructor = MHEAudio;

})(jQuery);
