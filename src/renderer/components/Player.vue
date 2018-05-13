<template>
  <div id="wrapper">

    <article class="screen">
      <input type="checkbox" value="None" id="magicButton" name="check" />
      <label class="main" for="magicButton"></label>

        <div class="coverImage"><img :src="current.background" style="height:100%"></div>
        <div class="search" @click="close()"></div>
        <div class="bodyPlayer"></div>

        <table class="list">

          <tr v-for="index in pagination" :key="index.id" class="song" @click="change(index)">
            <td class="nr"><h5 v-text="index.id"></h5></td>
            <td class="title"><h6 v-if="current.num == index.id" style="color:red" v-text="index.name"></h6><h6 v-else v-text="index.name"></h6></td>
            <td class="length"><h5></h5></td>
            <td><input type="checkbox" :id="'heart' + id"/><label class="zmr" :for="'heart' + id"></label></td>
          </tr>

        </table>
        
        <div class="shadow"></div>
        
        <div class="bar"></div>
        <audio preload="auto" id="audio" autoplay controls :src="current.src"></audio>
        <table class="player">
          <td><input type="checkbox" id="backward" @click="move(current.num - 1)"/><label class="backward" for="backward"></label></td>
          <td><input type="checkbox" id="play" title="Play" @click="play()"/><label class="play" for="play"></label></td>
          <td><input type="checkbox" id="forward" @click="move(current.num + 1)"/><label class="forward" for="forward"></label></td>
        </table>
        
        <table class="footer">
          <td><input type="checkbox" id="love" checked /><label class="love" for="love"></label></td>
          <td><input type="checkbox" id="shuffle"/><label class="shuffle" for="shuffle"></label></td>
          <td><input type="checkbox" id="repeat" checked /><label class="repeat" for="repeat"></label></td>
          <td><input type="checkbox" id="options"/><label class="options" for="options"></label></td>
        </table>
        
        <div class="current"><h2 v-text="current.name"></h2></div>
    </article>
  </div>
</template>

<script>
  const remote = require('electron').remote;

  export default {
    name: 'Player',
    data() {
      return {
        current: {
          num: 1,
          name: 'Radio Record',
          src: 'http://air2.radiorecord.ru:805/rr_320',
          background: 'https://media.giphy.com/media/xXvIkTu08XQLC/giphy.gif'
        },
        source: [
          {id: 1, src: 'http://air2.radiorecord.ru:805/rr_320', name: 'Radio Record', background: 'https://media.giphy.com/media/xXvIkTu08XQLC/giphy.gif'},
          {id: 2, src: 'http://air2.radiorecord.ru:805/mix_320', name: 'Mix', background: 'https://media.giphy.com/media/hkwe73GGVAsXm/giphy.gif'},
          {id: 3, src: 'http://air2.radiorecord.ru:805/deep_320', name: 'Deep', background: 'https://media.giphy.com/media/aZmD30dCFaPXG/giphy.gif'},
          {id: 4, src: 'http://air2.radiorecord.ru:805/club_320', name: 'Club', background: 'https://media.giphy.com/media/9ERBM1RrY9oUU/giphy.gif'},
          {id: 5, src: 'http://air2.radiorecord.ru:805/fut_320', name: 'Fut', background: 'https://media.giphy.com/media/TlK63EMNzHXbNBF8g9y/giphy.gif'},
          {id: 6, src: 'http://air2.radiorecord.ru:805/tm_320', name: 'Trancemission', background: 'https://media.giphy.com/media/l1J9z9csFxtbkGfXG/giphy.gif'},
          {id: 7, src: 'http://air2.radiorecord.ru:805/chil_320', name: 'Chil', background: 'https://media.giphy.com/media/4cwy5tGfqUWFG/giphy.gif'},
          {id: 8, src: 'http://air2.radiorecord.ru:805/mini_320', name: 'Mini', background: 'https://media.giphy.com/media/yzvVXSvrg7JxC/giphy.gif'},
          {id: 9, src: 'http://air2.radiorecord.ru:805/ps_320', name: 'Ps', background: 'https://media.giphy.com/media/Ci8S8u9lifcTS/giphy.gif'},
          {id: 10, src: 'http://air2.radiorecord.ru:805/rus_320', name: 'RUS', background: 'https://media.giphy.com/media/OB6PYJQmCMmJy/giphy.gif'},
          {id: 11, src: 'http://air2.radiorecord.ru:805/vip_320', name: 'VIP', background: 'https://media.giphy.com/media/hl0eJ9GsoiFVu/giphy.gif'},
          {id: 12, src: 'http://air2.radiorecord.ru:805/sd90_320', name: '90', background: 'https://media.giphy.com/media/xT77XKlezDkZXq7a2k/giphy.gif'},
          {id: 13, src: 'http://air2.radiorecord.ru:805/brks_320', name: 'Brks', background: 'https://media.giphy.com/media/3o7aD04Qk69gc9sp3O/giphy-downsized-large.gif'},
          {id: 14, src: 'http://air2.radiorecord.ru:805/dub_320', name: 'Dub', background: 'https://media.giphy.com/media/GRyUYyyBSNvs4/giphy.gif'},
          {id: 15, src: 'http://air2.radiorecord.ru:805/dc_320', name: 'Dc', background: 'https://media.giphy.com/media/xUNd9HAossTNDyUUbS/giphy.gif'},
          {id: 16, src: 'http://air2.radiorecord.ru:805/techno_320', name: 'Techno', background: 'https://media.giphy.com/media/3ornjVlWukY3BxZPAQ/giphy.gif'},
          {id: 17, src: 'http://air2.radiorecord.ru:805/teo_320', name: 'Teo', background: 'https://media.giphy.com/media/4oMoIbIQrvCjm/giphy.gif'},
          {id: 18, src: 'http://air2.radiorecord.ru:805/trap_320', name: 'Trap', background: 'https://media.giphy.com/media/3ohjV9q9FV8vnFQNe8/giphy.gif'},
          {id: 19, src: 'http://air2.radiorecord.ru:805/pump_320', name: 'Pump', background: 'https://media.giphy.com/media/l0NgQgSHKlhCyQYDu/giphy.gif'},
          {id: 20, src: 'http://air2.radiorecord.ru:805/rock_320', name: 'Rock', background: 'https://media.giphy.com/media/4ijoeaHXgLXlm/giphy.gif'},
          {id: 21, src: 'http://air2.radiorecord.ru:805/mdl_320', name: 'Mdl', background: 'https://media.giphy.com/media/Wa5aiRZE8inZK/giphy.gif'},
          {id: 22, src: 'http://air2.radiorecord.ru:805/gop_320', name: 'Gop', background: 'https://media.giphy.com/media/HBbA0gf8uemuQ/giphy.gif'},
          {id: 23, src: 'http://air2.radiorecord.ru:805/yo_320', name: 'Yo', background: 'https://media.giphy.com/media/55rdoT1Cu2lsk/giphy.gif'},
          {id: 24, src: 'http://air2.radiorecord.ru:805/rave_320', name: 'Rave', background: 'https://media.giphy.com/media/tx9xJgH0WbHhK/giphy.gif'}
        ],
        pagination: []
      }
    },
    methods: {
      refresh()  {
        document.getElementById('audio').play;
        var playpause = document.getElementById("play");
        playpause.title = "Play";
        playpause.checked = true;

        this.pagination = [];

        for (var i = 0; i < this.source.length; i++) {
          let testMinus = this.current.num - 3;
          let testPlus = this.current.num + 3;
          if (i >= testMinus && i <= testPlus) {
            this.pagination.push(this.source[i]);
          }
        }
      },

      play() {
        var audio = document.getElementById('audio');
        var playpause = document.getElementById("play");

        if (audio.paused || audio.ended) {
          playpause.title = "Pause";
          audio.play();
        } else {
          playpause.title = "Play";
          audio.pause();
        }
      },

      change(index) {
        this.current.num = index.id;
        this.current.name = index.name;
        this.current.src = index.src;
        this.current.background = index.background;
        this.refresh();
      },

      move(id) {
        id = id > this.source.length ? Number(1) : Number(id);
        id = id < 1 ? Number(this.source.length) : Number(id);

        for (var i = 0; i < this.source.length; i++) {
          if (this.source[i].id == id) {
            this.current.num = this.source[i].id;
            this.current.name = this.source[i].name;
            this.current.src = this.source[i].src;
            this.current.background = this.source[i].background;
            this.refresh();
          }
        }
      },

      close() {
        var window = remote.getCurrentWindow();
        window.close();
      }
    },
    mounted() {
      this.refresh();
    }
  }
</script>

<style>
@import url(https://fonts.googleapis.com/css?family=Open+Sans:300,400,700);
@import url(https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css);

body {
  background: #ff564c;
  padding: 0;
  margin: 0;
  overflow: hidden;
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

.screen > #magicButton:checked ~ .coverImage {
  transition: all 0.3s ease-in;
  border-radius: 20px;
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

label.zmr:before {
  font-family: FontAwesome;
  content: "\f08a";
  color: #777;
  font-size: 15px;
  line-height: 15px;
  cursor: pointer;
  z-index: 10;
  transition: all 0.15s linear;
}

td > #heart:checked ~ label.zmr:before {
  content: "\f004";
  color: #ff564c;
  transition: all 0.15s linear;
}

td > #heart1:checked ~ label.zmr:before {
  content: "\f004";
  color: #ff564c;
  transition: all 0.15s linear;
}

td > #heart2:checked ~ label.zmr:before {
  content: "\f004";
  color: #ff564c;
  transition: all 0.15s linear;
}

td > #heart3:checked ~ label.zmr:before {
  content: "\f004";
  color: #ff564c;
  transition: all 0.15s linear;
}

td > #heart4:checked ~ label.zmr:before {
  content: "\f004";
  color: #ff564c;
  transition: all 0.15s linear;
}

td > #heart5:checked ~ label.zmr:before {
  content: "\f004";
  color: #ff564c;
  transition: all 0.15s linear;
}

td > #heart6:checked ~ label.zmr:before {
  content: "\f004";
  color: #ff564c;
  transition: all 0.15s linear;
}

td > #heart7:checked ~ label.zmr:before {
  content: "\f004";
  color: #ff564c;
  transition: all 0.15s linear;
}

td > #heart8:checked ~ label.zmr:before {
  content: "\f004";
  color: #ff564c;
  transition: all 0.15s linear;
}

.bar {
  background: url('http://imgh.us/bar_3.svg') no-repeat;
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
</style>
