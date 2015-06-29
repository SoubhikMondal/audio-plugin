

```
  <div class="audio__container audio1" data-audiourl='http://www.stephaniequinn.com/Music/Allegro%20from%20Duet%20in%20C%20Major.mp3'>
    <button class="playPause isPaused">play</button>
    <input type="range" class="scrobbler" value="0" step="0" max="0"/>
    <button class="muteUnmute isMuted"></button>
    <input type="range" class="volume" value="0" step="0" max="10"/>
  </div>
```

and then...

```
  $('.audio1').mheAudio();
```


* to build just run `gulp build` (compiles into ./dist/)

* to work (sever and watch tasks) run `gulp dev`: runs on port 8001
