<template>
  <div id="wrapper">
    <article class="screen">
      <input
        id="magicButton"
        type="checkbox"
        name="check"
        value="None"
      />
      <label class="main" for="magicButton"></label>

        <div v-if="isPlay" class="coverImage">
          <img
            :src="source[current - 1].background"
            class="unimage"
          />
        </div>
        <div v-else class="coverImage">
          <img
            src="https://image.freepik.com/free-photo/3d-render-of-spotlights-on-a-grunge-brick-wall_1048-6284.jpg"
            class="unimage"
          />
        </div>
        <div @click="close()" class="search"></div>
        <div @click="min()" class="min"></div>
        <div class="bodyPlayer"></div>

        <table class="list">

          <tr
            v-for="(index, key) in pagination"
            @click="change(index)"
            :key="key"
            class="song"
          >
            <td class="nr">
              <h5 v-text="index.id"></h5>
            </td>
            <td class="title">
              <h6
                v-if="current == index.id"
                v-text="index.name"
                style="color:red"
              ></h6>
              <h6 v-else v-text="index.name"></h6>
            </td>
            <td class="length">
              <h5></h5>
            </td>
            <td>
              <input
                v-model="index.star"
                :id="'heart' + index.id"
                class="favorite"
                type="checkbox"
              />
              <label
                :for="'heart' + index.id"
                class="love"
              ></label>
            </td>
          </tr>

        </table>
        
        <div class="shadow"></div>
        
        <div class="bar"></div>
        <audio
          id="audio"
          :src="source[current - 1].src"
          preload="auto"
          autoplay
          controls
        ></audio>
        <table class="player">
          <td>
            <input
              id="backward"
              @click="move(current - 1)"
              type="checkbox"
            />
            <label class="backward" for="backward"></label>
          </td>
          <td>
            <input
              id="play"
              @click="play()"
              type="checkbox"
              title="Play"
            />
            <label class="play" for="play"></label>
          </td>
          <td>
            <input
              id="forward"
              @click="move(current + 1)"
              type="checkbox"
            />
            <label class="forward" for="forward"></label>
          </td>
        </table>
        
        <table class="footer">
          <td>
            <input
              id="love"
              v-model="source[current - 1].star"
              type="checkbox"
            />
            <label class="love" for="love"></label>
          </td>
          <td>
            <div class="orange">
              <input
                id="s1"
                @input="vol($event)"
                :value="volume"
                type="range"
                class="range"
                step="1"
                min="0"
                max="100"
              />
            </div>
          </td>
        </table>
        <div class="current">
          <h2 v-text="source[current - 1].name"></h2>
        </div>
    </article>
  </div>
</template>

<script>
  const remote = require('electron').remote;

  export default {
    name: 'Player',

    data() {
      return {
        isPlay: false,
        volume: 100,
        current: 1,
        // Rework play/pause gif to mp4
        source: [
        	{id: 1, star: false, src: 'http://air.radiorecord.ru:805/rr_320', name: 'Radio Record', background: 'https://media.giphy.com/media/xXvIkTu08XQLC/giphy.mp4'},
        	{id: 2, star: false, src: 'http://air.radiorecord.ru:805/trancehits_320', name: 'Trance Hits', background: 'https://media.giphy.com/media/l2SpSmDIXYH4ykEHS/giphy.mp4'},
        	{id: 3, star: false, src: 'http://air.radiorecord.ru:805/2step_320', name: '2 step', background: 'https://media.giphy.com/media/AaOYWtozeBpAc/giphy.mp4'},
        	{id: 4, star: false, src: 'http://air.radiorecord.ru:805/tecktonik_320', name: 'Tecktonik', background: 'https://media.giphy.com/media/xThta2TIEn7PXojyb6/giphy.mp4'},
        	{id: 5, star: false, src: 'http://air.radiorecord.ru:805/neurofunk_320', name: 'Neurofunk', background: 'https://media.giphy.com/media/10kxE34bJPaUO4/giphy.mp4'},
        	{id: 6, star: false, src: 'http://air.radiorecord.ru:805/edmhits_320', name: 'EDM Hits', background: 'https://media.giphy.com/media/XeJeluwfWWELe/giphy.mp4'},
        	{id: 7, star: false, src: 'http://air.radiorecord.ru:805/houseclss_320', name: 'House Classics', background: 'https://media.giphy.com/media/tDgWEibPXFyzS/giphy.mp4'},
        	{id: 8, star: false, src: 'http://air.radiorecord.ru:805/uplift_320', name: 'Upfliting', background: 'https://media.giphy.com/media/ByozcDGZsaKis/giphy.mp4'},
        	{id: 9, star: false, src: 'http://air.radiorecord.ru:805/darkside_320', name: 'Darkside', background: 'https://media.giphy.com/media/F6ub4AQXz13xK/giphy.mp4'},
        	{id: 10, star: false, src: 'http://air.radiorecord.ru:805/dream_320', name: 'Dream Dance', background: 'https://media.giphy.com/media/UGQopfLmrzNO8/giphy.mp4'},
        	{id: 11, star: false, src: 'http://air.radiorecord.ru:805/bighits_320', name: 'Big Hits', background: 'https://media.giphy.com/media/vDQsziDhqRGQE/giphy.mp4'},
        	{id: 12, star: false, src: 'http://air.radiorecord.ru:805/househits_320', name: 'House Hits', background: '###'},
        	{id: 13, star: false, src: 'http://air.radiorecord.ru:805/synth_320', name: 'Synthwave', background: '###'},
        	{id: 14, star: false, src: 'http://air.radiorecord.ru:805/progr_320', name: 'Progressive', background: '###'},
        	{id: 15, star: false, src: 'http://air.radiorecord.ru:805/mt_320', name: 'Midtempo', background: '###'},
        	{id: 16, star: false, src: 'http://air.radiorecord.ru:805/elect_320', name: 'Electro', background: '###'},
        	{id: 17, star: false, src: 'http://air.radiorecord.ru:805/ibiza_320', name: 'Innocence', background: '###'},
        	{id: 18, star: false, src: 'http://air.radiorecord.ru:805/gold_320', name: 'Gold', background: '###'},
        	{id: 19, star: false, src: 'http://air.radiorecord.ru:805/groovetribal_320', name: 'Groove/Tribal', background: '###'},
        	{id: 20, star: false, src: 'http://air.radiorecord.ru:805/complextro_320', name: 'Complextro', background: '###'},
        	{id: 21, star: false, src: 'http://air.radiorecord.ru:805/1970_320', name: '1970s', background: '###'},
        	{id: 22, star: false, src: 'http://air.radiorecord.ru:805/chillhouse_320', name: 'Chill House', background: '###'},
        	{id: 23, star: false, src: 'http://air.radiorecord.ru:805/1980_320', name: '1980s', background: '###'},
        	{id: 24, star: false, src: 'http://air.radiorecord.ru:805/cadillac_320', name: 'Cadillac FM', background: '###'},
        	{id: 25, star: false, src: 'http://air.radiorecord.ru:805/rapclassics_320', name: 'Rap Classics', background: '###'},
        	{id: 26, star: false, src: 'http://air.radiorecord.ru:805/rap_320', name: 'Rap Hits', background: '###'},
        	{id: 27, star: false, src: 'http://air.radiorecord.ru:805/discofunk_320', name: 'Disco/Funk', background: '###'},
        	{id: 28, star: false, src: 'http://air.radiorecord.ru:805/technopop_320', name: 'Technopop', background: '###'},
        	{id: 29, star: false, src: 'http://air.radiorecord.ru:805/eurodance_320', name: 'Eurodance', background: '###'},
        	{id: 30, star: false, src: 'http://air.radiorecord.ru:805/russiangold_320', name: 'Russian Gold', background: '###'},
        	{id: 31, star: false, src: 'http://air.radiorecord.ru:805/drumhits_320', name: 'Drum`n`Bass Hits', background: '###'},
        	{id: 32, star: false, src: 'http://air.radiorecord.ru:805/liquidfunk_320', name: 'Liquid Funk', background: '###'},
        	{id: 33, star: false, src: 'http://air.radiorecord.ru:805/jungle_320', name: 'Jungle', background: '###'},
        	{id: 34, star: false, src: 'http://air.radiorecord.ru:805/mix_320', name: 'Megamix', background: '###'},
        	{id: 35, star: false, src: 'http://air.radiorecord.ru:805/deep_320', name: 'Deep', background: '###'},
        	{id: 36, star: false, src: 'http://air.radiorecord.ru:805/club_320', name: 'EDM', background: '###'},
        	{id: 37, star: false, src: 'http://air.radiorecord.ru:805/trop_320', name: 'Tropical', background: '###'},
        	{id: 38, star: false, src: 'http://air.radiorecord.ru:805/goa_320', name: 'GOA/PSY', background: '###'},
        	{id: 39, star: false, src: 'http://air.radiorecord.ru:805/fut_320', name: 'Future House', background: '###'},
        	{id: 40, star: false, src: 'http://air.radiorecord.ru:805/tm_320', name: 'Trancemission', background: '###'},
        	{id: 41, star: false, src: 'http://air.radiorecord.ru:805/chil_320', name: 'Chill-Out', background: '###'},
        	{id: 42, star: false, src: 'http://air.radiorecord.ru:805/mini_320', name: 'Minimal/Tech', background: '###'},
        	{id: 43, star: false, src: 'http://air.radiorecord.ru:805/ps_320', name: 'Pirate Station', background: '###'},
        	{id: 44, star: false, src: 'http://air.radiorecord.ru:805/rus_320', name: 'Russian Mix', background: '###'},
        	{id: 45, star: false, src: 'http://air.radiorecord.ru:805/vip_320', name: 'Vip House', background: '###'},
        	{id: 46, star: false, src: 'http://air.radiorecord.ru:805/hypno_320', name: 'Hypnotic', background: '###'},
        	{id: 47, star: false, src: 'http://air.radiorecord.ru:805/trancehouse_320', name: 'Trancehouse', background: '###'},
        	{id: 48, star: false, src: 'http://air.radiorecord.ru:805/jackin_320', name: 'Jackin`/Garage', background: '###'},
        	{id: 49, star: false, src: 'http://air.radiorecord.ru:805/mmbt_320', name: 'Moombahton', background: '###'},
        	{id: 50, star: false, src: 'http://air.radiorecord.ru:805/sd90_320', name: 'Superdisco 90s', background: '###'},
        	{id: 51, star: false, src: 'http://air.radiorecord.ru:805/brks_320', name: 'Breaks', background: '###'},
        	{id: 52, star: false, src: 'http://air.radiorecord.ru:805/dub_320', name: 'Dupstep', background: '###'},
        	{id: 53, star: false, src: 'http://air.radiorecord.ru:805/dc_320', name: 'Dancecore', background: '###'},
        	{id: 54, star: false, src: 'http://air.radiorecord.ru:805/fbass_320', name: 'Future Bass', background: '###'},
        	{id: 55, star: false, src: 'http://air.radiorecord.ru:805/rmx_320', name: 'Remix', background: '###'},
        	{id: 56, star: false, src: 'http://air.radiorecord.ru:805/techno_320', name: 'Techno', background: '###'},
        	{id: 57, star: false, src: 'http://air.radiorecord.ru:805/hbass_320', name: 'Hard Bass', background: '###'},
        	{id: 58, star: false, src: 'http://air.radiorecord.ru:805/teo_320', name: 'Hardstyle', background: '###'},
        	{id: 59, star: false, src: 'http://air.radiorecord.ru:805/trap_320', name: 'Trap', background: '###'},
        	{id: 60, star: false, src: 'http://air.radiorecord.ru:805/pump_320', name: 'Old School', background: '###'},
        	{id: 61, star: false, src: 'http://air.radiorecord.ru:805/rock_320', name: 'Rock', background: '###'},
        	{id: 62, star: false, src: 'http://air.radiorecord.ru:805/mdl_320', name: 'Slow FM', background: '###'},
        	{id: 63, star: false, src: 'http://air.radiorecord.ru:805/symph_320', name: 'Symphony FM', background: '###'},
        	{id: 64, star: false, src: 'http://air.radiorecord.ru:805/yo_320', name: 'Black', background: '###'},
        	{id: 65, star: false, src: 'http://air.radiorecord.ru:805/rave_320', name: 'Rave FM', background: '###'}
        ],
        pagination: []
      }
    },

    methods: {
      vol(e) {
        this.volume = e.target.value;
        let resize = e.target.value / 100;
        document.querySelector('#audio').volume = resize;
      },

      refresh()  {
        document.querySelector('#audio').play;
        document.querySelector("#play").checked = true;
        this.isPlay = true;

        this.pagination = [];

        for (var i = 0; i < this.source.length; i++) {
          let testMinus = this.current - 3;
          let testPlus = this.current + 3;
          if (i >= testMinus && i <= testPlus) {
            this.pagination.push(this.source[i]);
          }
        }
      },

      play() {
        var audio = document.querySelector('#audio');
        this.isPlay = !this.isPlay;

        if (audio.paused || audio.ended) {
          audio.play();
        } else {
          audio.pause();
        }
      },

      change(index) {
        this.current = index.id;
        this.refresh();
      },

      move(id) {
        id = id > this.source.length ? Number(1) : Number(id);
        id = id < 1 ? Number(this.source.length) : Number(id);

        for (var i = 0; i < this.source.length; i++) {
          if (this.source[i].id == id) {
            this.current = this.source[i].id;
            this.refresh();
          }
        }
      },

      close() {
        // @TODO Need to save volume, localstorage cant work
        localStorage["volume"] = this.volume;
        let window = remote.getCurrentWindow();
        window.close();
      },
      
      // @TODO Add dragged window

      min() {
        let window = remote.getCurrentWindow();
        window.minimize();
      },

      loadData() {
        if (localStorage["volume"] != undefined && localStorage["volume"] != '') {
          this.volume = localStorage["volume"];
        }
      }
    },

    mounted() {
      this.loadData();
      this.refresh();
    }
  }
</script>

<style>
/* @TODO Download */
@import url(https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css);

body {
  background: #ff564c;
  padding: 0;
  margin: 0;
  overflow: hidden;
}

.unimage {
  height: 100%;
  -webkit-app-region: no-drag;
}

@keyframes harlem {
  0% {
    transform: scale(1);
    -webkit-transform: scale(1);
    -moz-transform: scale(1);
    -o-transform: scale(1);
    -ms-transform: scale(1);
  }
  20% {
    transform: scale(1.03, 1);
    -webkit-transform: scale(1.03, 1);
    -moz-transform: scale(1.03, 1);
    -o-transform: scale(1.03, 1);
    -ms-transform: scale(1.03, 1);
  }
  40% {
    transform: scale(0.97, 1);
    -webkit-transform: scale(0.97, 1);
    -moz-transform: scale(0.97, 1);
    -o-transform: scale(0.97, 1);
    -ms-transform: scale(0.97, 1);
  }
  60% {
    transform: scale(1.01, 1);
    -webkit-transform: scale(1.01, 1);
    -moz-transform: scale(1.01, 1);
    -o-transform: scale(1.01, 1);
    -ms-transform: scale(1.01, 1);
  }
  80% {
    transform: scale(0.99, 1);
    -webkit-transform: scale(0.99, 1);
    -moz-transform: scale(0.99, 1);
    -o-transform: scale(0.99, 1);
    -ms-transform: scale(0.99, 1);
  }
  100% {
    transform: scale(1);
    -webkit-transform: scale(1);
    -moz-transform: scale(1);
    -o-transform: scale(1);
    -ms-transform: scale(1);
  }
}

h2 {
  margin: 0;
  padding: 0;
  font-size: 10px;
  line-height: 10px;
  letter-spacing: 2.5px;
  font-family: 'Open Sans';
  font-weight: 700;
  color: #fff;
}

h3 {
  margin: 0;
  padding: 0;
  font-size: 11px;
  line-height: 11px;
  font-family: 'Open Sans';
  font-weight: 400;
  color: #777;
}

h4 {
  margin: 0 0 5px 29px;
  padding: 0;
  font-size: 14px;
  line-height: 14px;
  font-family: 'Open Sans';
  font-weight: 700;
  color: #fff;
}

h5 {
  margin: 0;
  padding: 0;
  font-size: 13px;
  line-height: 13px;
  font-family: 'Open Sans';
  font-weight: 700;
  color: #6d6d6d;
}

h6 {
  margin: 0;
  padding: 0;
  font-size: 13px;
  line-height: 13px;
  font-family: 'Open Sans';
  font-weight: 700;
  color: #f0f0f0;
}

.screen {
  background-color: #fff;
  padding: 0;
  height: 100%;
  width: 100%;
  position: absolute;
  left: 50%;
  top: 0;
  transform: translate(-50%, 0);
  overflow: hidden;
}

.header {
  display: inline-flex;
}

input[type=checkbox] {
  visibility: hidden;
  margin: 0;
  padding: 0;
  z-index: 10;
}

label.main:before {
  position: absolute;
  top: 23px;
  left: 23px;
  font-family: FontAwesome;
  content: '\f0c9';
  color: #959595;
  font-size: 16px;
  line-height: 16px;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease-in;
}

label.main:hover:before {
  color: #bbb;
}

.screen > #magicButton:checked ~ label.main:before {
  color: #ff564c;
  transition: all 0.3s ease-in;
}

.coverImage {
  background-size:cover;
  background-repeat: no-repeat;
  width: 366px;
  height: 366px;
  padding: 0;
  margin: 0;
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: 0% 0%;
  transition: all 0.3s ease-in;
}

.pauseImage {
  background-image: black !important;
}

.screen > #magicButton:checked ~ .coverImage {
  transition: all 0.3s ease-in;
}

.search:before {
  position: absolute;
  top: 23px;
  right: 23px;
  font-family: FontAwesome;
  content: '\f00d';
  color: #959595;
  font-size: 16px;
  line-height: 16px;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease-in;
}

.search:hover:before {
  color: #bbb;
}

.drag {
  -webkit-app-region: drag;
}

.drag:before {
  position: absolute;
  top: 23px;
  right: 100px;
  font-family: FontAwesome;
  content: '\f0b2';
  color: #959595;
  font-size: 16px;
  line-height: 16px;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease-in;
}

.drag:hover:before {
  color: #bbb;
}

.min:before {
  position: absolute;
  top: 23px;
  right: 60px;
  font-family: FontAwesome;
  content: '\f068';
  color: #959595;
  font-size: 16px;
  line-height: 16px;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease-in;
}

.min:hover:before {
  color: #bbb;
}

.bodyPlayer {
  position: absolute;
  top: 366px;
  left: 0;
  margin: 0;
  padding: 0;
  height: 286px;
  width: 366px;
  background: #111;
  transition: all 0.3s ease-in;
}

.screen > #magicButton:checked ~ .bodyPlayer {
  height: 470px;
  left: 0;
  top: 180px;
  transition: all 0.3s ease-in;
}

.list {
  border-spacing: 0px 2px;
  width: 342px;
  visibility: hidden;
  opacity: 0;
  position: absolute;
  top: 378px;
  left: 12px;
  transform-origin: 0% 0%;
  transform: scale(0.1, 0.1);
  transition: all 0.3s ease-in;
}

.list tr {
  transform-origin: 0% 50%;
  height: 50px;
  text-align: center;
  background: #1d1d1d;
  text-indent: 8px;
}

.list tr:hover {
  background: #222;
  cursor: pointer;
}

.title {
  width: 215px;
  text-align: left;
  text-indent: 15px;
  transition: all 0.11s ease-in;
}

.list tr:hover .title {
  padding-left: 5px;
  width: 210px;
  transition: all 0.11s ease-in;
}

.screen > #magicButton:checked ~ .list {
  top: 192px;
  left: 12px;
  opacity: 1;
  visibility: visible;
  transform: scale(1, 1);
  transition: all 0.3s ease-in;
}

.screen > #magicButton:checked ~ table tr:nth-child(1) {
  opacity: 1;
  animation: harlem 0.3s linear forwards;
  animation-delay: 0.185s;
}

.screen > #magicButton:checked ~ table tr:nth-child(2) {
  animation: harlem 0.3s linear forwards;
  animation-delay: 0.2s;
}

.screen > #magicButton:checked ~ table tr:nth-child(3) {
  animation: harlem 0.3s linear forwards;
  animation-delay: 0.215s;
}

.screen > #magicButton:checked ~ table tr:nth-child(4) {
  animation: harlem 0.3s linear forwards;
  animation-delay: 0.23s;
}

.screen > #magicButton:checked ~ table tr:nth-child(5) {
  animation: harlem 0.3s linear forwards;
  animation-delay: 0.245s;
}

.screen > #magicButton:checked ~ table tr:nth-child(6) {
  animation: harlem 0.3s linear forwards;
  animation-delay: 0.26s;
}

.screen > #magicButton:checked ~ table tr:nth-child(7) {
  animation: harlem 0.3s linear forwards;
  animation-delay: 0.275s;
}

.screen > #magicButton:checked ~ table tr:nth-child(8) {
  animation: harlem 0.3s linear forwards;
  animation-delay: 0.29s;
}

.screen > #magicButton:checked ~ table tr:nth-child(9) {
  animation: harlem 0.3s linear forwards;
  animation-delay: 0.305s;
}

.bar {
  background-size: 100%;
  width: 320px;
  height: 21px;
  position: absolute;
  top: 407px;
  left: 23px;
  transform-origin: 0% 0%;
  transition: all 0.3s ease-in;
}

.screen > #magicButton:checked ~ .bar {
  top: 119px;
  left: 126px;
  transform: scale(0.6875, 0.6875);
  transition: all 0.3s ease-in;
}

.info {
  width: 157px;
  position: absolute;
  left: 104px;
  top: 440px;
  transition: all 0.3s ease-in;
  display: block;
}

.screen > #magicButton:checked ~ .info {
  display:none;
}

.player {
  background: none;
  text-align: center;
  font-family: FontAwesome;
  color: #fff;
  font-size: 26px;
  line-height: 26px;
  width: 216px;
  height: 35px;
  position: absolute;
  bottom: 100px;
  left: 48%;
  transform: translate(-50%, 0);
  z-index: 10;
  transition: all 0.3s ease-in;
  border-spacing: 0;
}

.player td {
  width: 72px;
}

.backward:before {
  content: "\f04a";
  cursor: pointer;
  transition: all 0.15s linear;
}

.play:before {
  content: "\f04b";
  cursor: pointer;
  transition: all 0.15s linear;
}

.forward:before {
  content: "\f04e";
  cursor: pointer;
  transition: all 0.15s linear;
}

.backward:hover:before {
  color: #bbb;
  transition: all 0.15s linear;
}

.play:hover:before {
  color: #bbb;
  transition: all 0.15s linear;
}

.forward:hover:before {
  color: #bbb;
  transition: all 0.15s linear;
}

td > #play:checked ~ label.play:before {
  content: "\f04c";
  transition: all 0.15s linear;
}

.screen > #magicButton:checked ~ .player {
  bottom: 4px;
  left: -44px;
  transform: scale(0.45, 0.45);
  transition: all 0.3s ease-in;
}

.shadow {
  background: rgba(17, 17, 17, 0.8);
  width: 366px;
  height: 50px;
  position: absolute;
  bottom: -12px;
  left: 0;
  box-shadow: 0px -15px 40px rgba(17, 17, 17, 0.8);
}

.footer {
  background: none;
  font-family: FontAwesome;
  color: #6d6d6d;
  font-size: 15px;
  line-height: 15px;
  height: 45px;
  width: 360px;
  position: absolute;
  bottom: 10px;
  left: 23px;
  z-index: 20;
  transition: all 0.15s linear;
  transition: bottom 0.3s linear;
}

.love:before {
  content: "\f08a";
  cursor: pointer;
  transition: all 0.15s linear;
}

.shuffle:before {
  content: "\f074";
  cursor: pointer;
  transition: all 0.15s linear;
}

.repeat:before {
  content: "\f01e";
  cursor: pointer;
  transition: all 0.15s linear;
}

.options:before {
  content: "\f141";
  cursor: pointer;
  transition: all 0.15s linear;
}

.love:hover:before {
  color: #bbb;
  transition: all 0.15s linear;
}

.shuffle:hover:before {
  color: #bbb;
  transition: all 0.15s linear;
}

.repeat:hover:before {
  color: #bbb;
  transition: all 0.15s linear;
}

.options:hover:before {
  color: #bbb;
  transition: all 0.15s linear;
}

td > #love:checked ~ label.love:before {
  content: "\f004";
  color: #ff564c;
  transition: all 0.15s linear;
}
td > .favorite:checked ~ label.love:before {
  font-family: FontAwesome;
  content: "\f004";
  color: #ff564c;
  transition: all 0.15s linear;
}

td > #shuffle:checked ~ label.shuffle:before {
  color: #ff564c;
  transition: all 0.15s linear;
}

td > #repeat:checked ~ label.repeat:before {
  color: #ff564c;
  transition: all 0.15s linear;
}

.screen > #magicButton:checked ~ .footer {
  bottom: -60px;
  transition: all 0.3s ease-in;
}

#love2 ~ label.love:before {
  content: "\f004";
  color: #ff564c;
  transition: all 0.15s linear;
}

.current {
  position: absolute;
  right: 23px;
  bottom: -60px;
  transition: all 0.3s ease-in;
}

.screen > #magicButton:checked ~ .current {
  bottom: 17px;
  transition: all 0.3s ease-in;
}

audio {
  visibility: hidden;
}

input[type="number"] {
  min-width: 15%;
  display: inline-block;
  position: absolute;
  top: 10px;
  margin-left: 5%;
  background: transparent;
  box-shadow: none;
  border: none;
  font-size: 18px;
  color: orange;
  text-align: center;
}
input[type="number"] :focus, :active {
    outline: none;
  }

input[type="range"] {
  -webkit-appearance: none;
  margin-top: 20px;
  width: 80%;
  background: transparent;
}

input[type="range"] :focus, :active {
  outline: none;
}

input[type=range]::-webkit-slider-runnable-track {
    -webkit-appearance: none;
    background: linear-gradient(90deg, orange 0%, darkOrange 33%, orangeRed 66%);
    height: 3px;
    position: relative;
}

input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  background: #ff564c;
  outline: none;
  height: 25px;
  width: 25px;
  position: relative;
  top: -10px;
  border-radius: 50%;
}

:active, :hover, :focus {
    outline: 0;
    outline-offset: 0;
}
</style>
