__Audio Playback__

jQuery plugin to play audio in a skinned UI.

Full Featured:

![screen shot 2015-07-02 at 12 03 57 pm](https://cloud.githubusercontent.com/assets/2104257/8481660/5a9ee472-20b2-11e5-9430-13a496f4444c.png)

Minimum Features:

![screen shot 2015-07-02 at 12 05 33 pm](https://cloud.githubusercontent.com/assets/2104257/8481702/96111642-20b2-11e5-9109-6b085e89cf57.png)


Includes:
* Play/Pause
* Mute/Unmute
* Timeline Scrubbinb
* Volume Slider

Implementation:

Add a container element with class `audio__container` and a `data-audiourl` value. 

Then envoke it via `$(someSelector).mheAudio();`



You may omit any UI elements but they need class definitions as follows:

 Function | Class Name 
 ---------|------------
play / pause | `.playPause` 
scrub | `.scrobbler` (must be `input type=range`)
mute / unmute | `.muteUnmute`
volume slider | `.volume` (must be `input type=range`)

Example:

```
<div class="audio__container audio1" data-audiourl='http://www.stephaniequinn.com/Music/Allegro%20from%20Duet%20in%20C%20Major.mp3'>
    <button class="playPause">play</button>
    <input type="range" class="scrobbler" value="0" step="0" max="0"/>
    <button class="muteUnmute"></button>
    <input type="range" class="volume" value="0" step="0" max="10"/>
  </div>
```

and then...

```
  $('.audio1').mheAudio();
```

Contributing
------------

* to build just run `gulp build` (compiles into ./dist/)

* to work (sever and watch tasks) run `gulp dev`: runs on `localhost:8001/test.html`
