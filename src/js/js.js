(function($){

	'use strict';	

  $.fn.mheAudio = function(el){

		var Plugin = this;

		//http://www.stephaniequinn.com/Music/Allegro%20from%20Duet%20in%20C%20Major.mp3'

		this.el = $(this.selector);

		this.playPause = $(this.selector + ' #playPause');
		this.muteUnmute = $(this.selector + ' #muteUnmute');
		this.scrobbler = $(this.selector + ' #scrobbler');
		this.isMuted = false;
		this.isPlaying = false;

		// init
		this.audioURL = $(this.selector).data('audiourl');
		this.song = new Audio(this.audioURL);
		this.song.type = 'audio/mpeg';
		this.song.src = this.audioURL;
		$(this.scrobbler).attr('max', this.song.duration)

		// ui handlers
		this.playPause.on('click', function(e){
			e.preventDefault();
			if(Plugin.isPlaying === false){
				$(this).removeClass('isPaused').addClass('isPlaying');
				Plugin.song.play();
				Plugin.isPlaying = true;
			} else {
				$(this).removeClass('isPlaying').addClass('isPaused');
				Plugin.song.play(); 
				Plugin.isPlaying = false;
			}
		});

		this.muteUnmute.on('click', function(e){
			e.preventDefault();
			if(Plugin.isMuted === false){
				Plugin.song.volume = 0;
				$(this).removeClass('isUnmuted').addClass('isMuted');
				Plugin.isMuted = true;
			} else {
				Plugin.song.volume = 1;
				$(this).removeClass('isMuted').addClass('isUnmuted');
				Plugin.isMuted = false;
			}
		});

		this.song.addEventListener('timeupdate',function (){
			var curtime = parseInt(Plugin.song.currentTime, 10);
			$(Plugin.scrobbler).val(curtime);
		});

		this.scrobbler.bind('change', function() {
			Plugin.song.currentTime = $(this).val();
			Plugin.scrobbler.attr('max', Plugin.song.duration);
		});

		return this;

  };



})(jQuery);
