(function($){

  'use strict';

  var MHEAudio = function(el){
    this.$el          = $(el);
    this.playPause    = this.$el.find('.playPause');
    this.muteUnmute   = this.$el.find('.muteUnmute');
    this.scrobbler    = this.$el.find('.scrobbler');
    this.volume       = this.$el.find('.volume');
    this.audioURL     = this.$el.data('audiourl');
    this.song         = new Audio(this.audioURL);
    this.song.type    = this.$el.data('audiotype');
    this.song.src     = this.audioURL;
    this.song.preload = 'none';
    this.isMuted      = false;
    this.isPlaying    = false;
    this.previousVolume = 10;
    this.scrobblerProxy = null;
    this.durationProxy  = null;
    this.errorProxy     = null;
    this.errorDuration  = 0;
    this.errorTimeOut   = 5000;

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
    this.volume.on('click', $.proxy(this.clickSlider, this));
    this.scrobbler.on('change', $.proxy(this.updateSongPosition, this));
    this.scrobbler.on('mousedown', $.proxy(this.startDrag, this));
    this.scrobbler.on('mouseup', $.proxy(this.stopDrag, this));
    this.scrobbler.on('click', $.proxy(this.clickSlider, this));

    this.scrobblerProxy = $.proxy(this.updateScrobbler, this);
    this.song.addEventListener('timeupdate', this.scrobblerProxy);

    this.errorProxy = $.proxy(this.handleSrcError, this);
    this.song.addEventListener('error', this.errorProxy);

    this.durationProxy = $.proxy(this.setDuration, this);
    this.song.addEventListener('durationchange', this.durationProxy);

    this.endProxy = $.proxy(this.resetPlayer, this);
    this.song.addEventListener('ended', this.endProxy);
  };

  MHEAudio.prototype.tearDown = function(){
    this.playPause.unbind();
    this.muteUnmute.unbind();
    this.volume.unbind();
    this.scrobbler.unbind();
    this.song.removeEventListener('timeupdate', this.scrobblerProxy, false);
    this.song.removeEventListener('durationchange', this.durationProxy, false);
    this.song.removeEventListener('ended', this.endProxy, false);
    this.song.removeEventListener('error', this.errorProxy, false);

    this.song.src = '';
    this.song     = null;

    $(this.$el).removeData('MHEAudio');
  };

  MHEAudio.prototype.handleSrcError = function(e){
    var errorCode = e.target.error.code;
    var _this     = this;

    if((errorCode === 4 || errorCode === 2) && _this.isPlaying) {
      var src   = e.target.src;
      var song  = _this.song;

      if(_this.errorDuration > _this.errorTimeOut) {
        $(_this.playPause).removeClass('isPlaying').addClass('inError');
        $(_this.$el).attr('title', 'An error occurred while playing your recording. Please try again later.');
      } else {
        setTimeout(function(){
          _this.errorDuration = _this.errorDuration + 500;
          song.src = src;
          song.pause();
          song.load();
          song.play();
        }, 500);
      }
    }
  };

  MHEAudio.prototype.resetPlayer = function(){
    this.togglePlayback();
    $(this.scrobbler).val(0);
  };

  MHEAudio.prototype.setDuration = function(){
    $(this.scrobbler).attr('max', this.song.duration);
  };

  MHEAudio.prototype.clickSlider = function(){
    return false;
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
    return false;
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
     return false;
  };
  
  MHEAudio.prototype.updateVolume = function(){
    var i = parseInt($(this.volume).val());
    this.song.volume = i * 0.1;
    if(i === 0){
      $(this.muteUnmute).removeClass('isUnmuted').addClass('isMuted');
    } else {
      this.previousVolume = i;
      $(this.muteUnmute).removeClass('isMuted').addClass('isUnmuted');
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
          return instance;
        }
      }
    });
  }

  $.fn.mheAudio = Plugin;
  $.fn.mheAudio.Constructor = MHEAudio;

})(jQuery);
