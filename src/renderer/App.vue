<template>
  <div id="wrapper">
    <article class="screen">
      <label
        @click="changelisting('list')"
        class="main"
        :class="{'activeLabel': listing == 'list'}"
      ></label>

      <label
        @click="changelisting('favorite')"
        class="main2"
        :class="{'activeLabel': listing == 'favorite'}"
      ></label>

      <label
        @click="changelisting('history')"
        class="main3"
        :class="{'activeLabel': listing == 'history'}"
      ></label>

      <div class="modal-container">
        <input
          id="modal-toggle"
          type="checkbox"
          v-model="modal"
        >
        <label
          class="modal-backdrop"
          for="modal-toggle"
          @click="searchInput = ''"
        ></label>
        <div class="modal-content">

          <div v-if="listing == 'list'">
            <div class="search-box">
              <div class="searchform">
                <input
                  id="s"
                  type="text"
                  v-model="searchInput"
                  placeholder="Search"
                />
              </div>
            </div>

            <div id="scroll-container">
              <div class="wrap-container" id="wrap-scroll">
                <ul id="ul-scroll">
                  <li
                    v-for="(index, key) in source"
                    @click="change(index)"
                    :key="key"
                    :class="{
                      'active': current == index.id,
                      'ra-display-none': index.name.toLowerCase().search(searchInput.toLowerCase()) == -1
                    }"
                    class="listing"
                  >
                    <span
                      v-text="index.name"
                      class="item"
                    ></span>
                    <i
                      @click="madeFavorite(index.id)"
                      class="fas fa-star iconFavorite"
                      :class="{'activeFavorite': !index.favorite}"
                    ></i>
                  </li>
                </ul>
              </div>
            </div>
            <svg-scroll/>
          </div>
          
          <div v-if="listing == 'favorite'">
            <div id="scroll-container">
              <div class="wrap-container">
                <ul>
                  <li
                    v-for="(index, key) in source"
                    @click="change(index)"
                    :key="key"
                    :class="{
                      'active': current == index.id,
                      'ra-display-none': index.favorite
                    }"
                    class="listing"
                  >
                    <span
                      v-text="index.name"
                      class="item"
                    ></span>
                    <i
                      @click="madeFavorite(index.id)"
                      class="fas fa-trash iconFavorite"
                      style="font-size: 15px;"
                    ></i>
                  </li>
                </ul>
              </div>
            </div>
            <svg-scroll/>
          </div>
          
          <div v-if="listing == 'history'">
            <div id="scroll-container2">
              <div
                id="wrap-scroll2"
                class="wrap-container2"
              >
                <ul v-if="history.length > 0">
                  <li
                    v-for="(index, key) in history.slice().reverse()"
                    track-by="id"
                    :key="key"
                    class="ra-bar"
                  >
                    <img
                      v-if="index.image"
                      :src="index.image"
                      class="ra-bar-item ra-item-img"
                    >
                    <img
                      v-else
                      :src="'https://images.radiovolna.net/_files/uploads/posts/2017-02/1486218080_2756.jpg'"
                      class="ra-bar-item ra-item-img"
                    >
                    <div class="ra-bar-item ra-item-text">
                      <span
                        v-text="index.artist"
                        class="ra-item-artist"
                      ></span>
                      <br>
                      <span
                        v-text="index.title"
                        class="ra-item-title"
                      ></span>
                    </div>
                  </li>
                </ul>
                <h1
                  v-else
                  v-text="'No one song played'"
                ></h1>
              </div>
            </div>
          </div>

        </div>          
      </div>

      <div class="coverImage">
        <video
          id="coverVideo"
          :src="channelGif"
          :autoplay="isPlay"
          height="100%"
          type="video/mp4"
          loop
        ></video>
      </div>

      <div
        @click="close()"
        class="close"
      ></div>

      <div
        @click="min()"
        class="min"
      ></div>

      <div class="bodyPlayer"></div>

      <div class="info">
				<h4 v-text="currentVoicer"></h4>
				<h3 v-text="currentSong"></h3>
        <img
          v-if="currentImg"
          :src="currentImg"
          class="ra-current-img"
          width="250"
        >
        <img
          v-else
          :src="'https://images.radiovolna.net/_files/uploads/posts/2017-02/1486218080_2756.jpg'"
          class="ra-current-img"
          width="250"
        >
        <h2
          v-text="channelName"
          class="ra-current-name"
        ></h2>
			</div>

      <audio
        id="audio"
        preload="auto"
        controls
        :autoplay="isPlay"
        :src="channelUrl"
      ></audio>

      <table class="player">
        <td>
          <input
            id="backward"
            @click="move(Number(current), false)"
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
            @click="move(Number(current), true)"
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
        <h2 v-text="channelName"></h2>
      </div>
    </article>
  </div>
</template>

<script>
  // Import rq
  import axios from 'axios';
  import Stations from './data/stations.json';

  // Storage
  const os = require('os');
  const storage = require('electron-json-storage');
  storage.setDataPath(os.tmpdir());

  // Mixins
  import { window } from './mixins/window';
  import { discord } from './mixins/discord';
  import { selector } from './mixins/selector';

  // Componenets
  import SvgScroll from './components/helpers/SvgScroll';

  // Vue
  export default {
    name: 'Player',
    mixins: [
      window,
      discord,
      selector
    ],

    components: {
      SvgScroll
    },

    data() {
      return {
        isPlay: false,
        volume: 30,

        current: 1,
        currentVoicer: '',
        currentSong: '',
        currentImg: '',

        channelName: '',
        channelGif: '',
        channelUrl: '',

        searchInput: '',
        modal: false,
        listing: 'none',

        favorite: [],
        history: [],
        source: [],
        time: 0,
      }
    },

    created() {
      // Storage data extract

      storage.has('setVolume', (error, hasKey) => {
        if (hasKey) {
          storage.get('setVolume', (error2, data) => {
            this.setVolume(data);
          });
        }
      });

      storage.has('setFavorite', (error, hasKey) => {
        if (hasKey) {
          storage.get('setFavorite', (error2, data) => {
            this.setFavorite(data);
          });
        } else {
          this.source = Stations.sort((a, b) => {
            if (a.name.charAt(0) > b.name.charAt(0)) return 1;
            if (a.name.charAt(0) < b.name.charAt(0)) return -1;
            return 0;
          });
        }
      });
    },

    mounted() {
      this.loadSong();
      this.time = new Date();

      setInterval(() => {
        this.loadSong();
      }, 500);
    },

    methods: {
      vol(e) {
        this.volume = e.target.value;
        this.selector('audio').volume = e.target.value / 100;
        storage.set('setVolume', e.target.value);
      },

      setVolume(e) {
        this.volume = e;
        this.selector('audio').volume = e / 100;
      },

      setFavorite(e) {
        this.source = e.sort((a, b) => {
          if (a.name.charAt(0) > b.name.charAt(0)) return 1;
          if (a.name.charAt(0) < b.name.charAt(0)) return -1;
          return 0;
        });
      },

      refresh()  {
        this.selector('audio').play;
        this.selector('coverVideo').play();
        this.selector('play').checked = true;
        this.isPlay = true;
      },

      play() {
        var audio = this.selector('audio');
        var cover = this.selector('coverVideo');
        this.loadSong();

        if(!this.isPlay) {
          audio.play();
          cover.play();
          this.selector("play").checked = true;
          this.isPlay = true;
        } else {
          audio.pause();
          cover.pause();
          this.selector("play").checked = false;
          this.isPlay = false;
        }
      },

      change(index) {
        this.current = index.id;
        this.channelGif = index.background;
        this.refresh();
        this.loadSong();
      },

      changelisting(listType) {
        if (this.modal && this.listing != listType) {
          this.listing = listType;
        } else if (this.modal && this.listing == listType) {
          this.listing = 'none';
          this.modal = false;
        } else if (!this.modal) {
          this.listing = listType;
          this.modal = true;
        }
      },

      move(id, moveTo) {
        for (var i = 0; i < this.source.length; i++) {
          if (this.source[i].id == id) {
            if (moveTo) {
              var res = Number(i) + 1;
              if (res > (this.source.length - 1)) {
                this.current = this.source[0].id;
                this.channelGif = this.source[0].background;

                var uiScroll = this.selector('ul-scroll');
                var topPos = uiScroll.offsetTop;
                this.selector('wrap-scroll').scrollTop = topPos;
              } else {
                this.current = this.source[res].id;
                this.channelGif = this.source[res].background;
              }
            } else {
              var res = Number(i) - 1;
              if (res < 0) {
                this.current = this.source[Number(this.source.length) - 1].id;
                this.channelGif = this.source[Number(this.source.length) - 1].background;
                
                var uiScroll = this.selector('ul-scroll');
                var topPos = uiScroll.offsetTop;
                var wrapScroll = this.selector('wrap-scroll');
                wrapScroll.scrollTop = wrapScroll.scrollHeight;
              } else {
                this.current = this.source[res].id;
                this.channelGif = this.source[res].background;
              }
            }
            this.refresh();
            this.loadSong();
          }
        }
      },

      madeFavorite(id) {
        this.source.find((element, index, array) => {
          if (this.source[index].id == id) {
            if (Boolean(this.source[index].favorite)) {
              this.source[index].favorite = Boolean(false);
              return true;
            } else {
              this.source[index].favorite = Boolean(true);
              return true;
            }
          }
          return false;
        });

        storage.set('setFavorite', this.source);
      },

      loadSong() {
        var id = this.current;
        var url = '';
        var title = '';

        this.source.find((element, index, array) => {
          if (this.source[index].id == id) {
            url = this.source[index].song;
            title = this.source[index].name;
            this.channelName = this.source[index].name;
            this.channelGif = this.source[index].background;
            this.channelUrl = this.source[index].src;
            return true;
          }
          return false;
        });

        axios.get(url)
          .then((response) => {
            if (this.currentVoicer != response.data.artist) {
              this.time = new Date();
            }
            this.currentVoicer = response.data.artist;
            this.currentSong = response.data.title;
            this.currentImg = response.data.image600;
            

            if (response.data.artist && response.data.title && this.isPlay) {
              let newHistory = {
                id: this.history.length,
                artist: response.data.artist,
                title: response.data.title,
                image: response.data.image600
              }

              let beacon = this.history.find((element, index, array) => {
                if (this.history[index].title == newHistory.title) {
                  return true;
                }
                return false;
              });

              if (!beacon) {
                this.history.push(newHistory);
              }
            }
          });

        if(this.discord) {
          this.setActivity(
            this.currentVoicer,
            this.currentSong,
            this.time,
            this.channelName
          );
        }
      }
    },
  }
</script>

<style>
  @import './css/app.css';
</style>