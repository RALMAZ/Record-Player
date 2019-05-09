<template>
  <div id="wrapper">
    <article class="screen">
      <label class="main" for="modal-toggle"></label>

      <div class="modal-container">
        <input id="modal-toggle" type="checkbox">
        <label class="modal-backdrop" for="modal-toggle"></label>
        <div class="modal-content">

          <input type="text" placeholder="Search">

          <div id="scroll-container">
            <div class="wrap-container" id="wrap-scroll">
              <ul id="ul-scroll">
                <li
                  v-for="(index, key) in source"
                  @click="change(index)"
                  :key="key"
                  :class="{'active': current == index.id}"
                >
                  <span
                    v-text="index.name"
                    class="item"
                  ></span>
                </li>
              </ul>
            </div>
          </div>
          <svg>
            <defs>
              <linearGradient id="gradient" x1="0" y1="0%" x2 ="0" y2="50%">
                <stop stop-color="black" offset="0"/>
                <stop stop-color="white" offset="1"/>
              </linearGradient>

              <mask id="masking" maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox">
                <rect y="0" width="1" height="1" fill="url(#gradient)" />
              </mask>
            </defs>
          </svg>

        </div>          
      </div>  

        <div class="coverImage">
          <video id="coverVideo" height="100%" loop>
            <source
              id="coverSource"
              :src="source[current - 1].background"
              type="video/mp4"
            >
          </video>
        </div>

        <div @click="close()" class="close"></div>
        <div @click="min()" class="min"></div>
        <div class="bodyPlayer"></div>

        <div class="info">
					<h4 v-text="currentVoicer"></h4>
					<h3 v-text="currentSong"></h3>
          <img
            :src="currentImg"
            class="ra-current-img"
            width="250"
          >
          <h2
            v-if="currentImg"
            v-text="source[current - 1].name"
            class="ra-current-name"
          ></h2>
				</div>

        <audio
          id="audio"
          preload="auto"
          controls
          :autoplay="isPlay"
          :src="source[current - 1].src"
        ></audio>
        <table class="player">
          <td>
            <input
              id="backward"
              @click="move(Number(current) - 1)"
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
              @click="move(Number(current) + 1)"
              type="checkbox"
            />
            <label class="forward" for="forward"></label>
          </td>
        </table>
        
        <table class="footer">
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
  const path = require('path');
  const url = require('url');
  import axios from 'axios';
  const os = require('os');
  const storage = require('electron-json-storage');
  const DiscordRPC = require('discord-rpc');
  import Stations from './data/stations.json';
  
  const clientId = '499605504813826053';
  DiscordRPC.register(clientId);
  const rpc = new DiscordRPC.Client({ transport: 'ipc' });






  

  export default {
    name: 'Player',

    data() {
      return {
        isPlay: false,
        volume: 30,
        current: 1,
        currentVoicer: '',
        currentSong: '',
        currentImg: '',
        time: 0,
        discord: true,
        source: [],
      }
    },

    created() {
      storage.setDataPath(os.tmpdir());
      storage.has('setVolume', (error, hasKey) => {
        if (hasKey) {
          storage.get('setVolume', (error2, data) => {
            this.volSet(data);
          });
        }
      });
      storage.has('setChannel', (error, hasKey) => {
        if (hasKey) {
          storage.get('setChannel', (error2, data) => {
            this.channelSet(data);
          });
        }
      });
      this.source = Stations;
    },

    mounted() {
      rpc.setActivity({
        details: 'Search song',
        state: 'Radio Record channels',
        startTimestamp: new Date(),
        largeImageKey: 'record',
        largeImageText: 'Radio Record Player',
        instance: false,
      });
      rpc.login({ clientId }).catch(()=> {
        this.discord = false;
      });
      
      this.loadSong();
      this.time = new Date();

      document.addEventListener('keyup', this.keyBind);

      setInterval(() => {
        this.loadSong();
      }, 500);
    },

    methods: {
      keyBind(e) {
        let value = e.keyCode;
        if(value == 32) {
          this.play();
        }
        if(value == 39 || value == 38) {
          this.move(Number(this.current) + 1)
        }
        if(value == 37 || value == 40) {
          this.move(Number(this.current) - 1)
        }
      },

      vol(e) {
        this.volume = e.target.value;
        document.querySelector('#audio').volume = e.target.value / 100;
        storage.set('setVolume', e.target.value);
      },

      volSet(e) {
        this.volume = e;
        document.querySelector('#audio').volume = e / 100;
      },

      channelSet(e) {
        this.current = e;
      },

      refresh()  {
        document.querySelector('#audio').play;
        document.querySelector('#coverVideo').play();
        document.querySelector("#play").checked = true;
        this.isPlay = true;
      },

      play() {
        var audio = document.querySelector('#audio');
        var cover = document.querySelector('#coverVideo');
        this.loadSong();

        if(!this.isPlay) {
          audio.play();
          cover.play();
          document.querySelector("#play").checked = true;
          this.isPlay = true;
        } else {
          audio.pause();
          cover.pause();
          document.querySelector("#play").checked = false;
          this.isPlay = false;
        }
      },

      change(index) {
        this.current = index.id;
        document.querySelector('#coverVideo').src = index.background;
        this.refresh();
        this.loadSong();
      },

      move(id) {
        id = Number(id) > Number(this.source.length) ? Number(1) : Number(id);
        id = Number(id) < Number(1) ? Number(this.source.length) : Number(id);

        for (var i = 0; i < this.source.length; i++) {
          if (this.source[i].id == id) {
            this.current = this.source[i].id;
            storage.set('setChannel', this.source[i].id);
            document.querySelector('#coverVideo').src = this.source[i].background;
            this.refresh();
            this.loadSong();
          }
        }
      },

      close() {
        let window = remote.getCurrentWindow();
        window.close();
      },
      
      min() {
        let window = remote.getCurrentWindow();
        window.minimize();
      },

      loadSong() {
        var id = this.current;
        var url = '';
        var title = '';

        for (var i = 0; i < this.source.length; i++) {
          if (this.source[i].id == id) {
            url = this.source[i].song;
            title = this.source[i].name;
          }
        }

        axios.get(url)
          .then((response) => {
            if (this.currentVoicer != response.data.artist) {
              this.time = new Date();
            }
            this.currentVoicer = response.data.artist;
            this.currentSong = response.data.title;
            this.currentImg = response.data.image600;
          })
          .catch(function (error) {
            console.log(error);
          });

        if(this.discord) {
          rpc.setActivity({
            details: this.currentVoicer,
            state: this.currentSong,
            startTimestamp: this.time,
            largeImageKey: 'record',
            largeImageText: title,
            instance: false,
          });
        }
      }
    },
  }
</script>

<style>
  @import './css/app.css';
</style>