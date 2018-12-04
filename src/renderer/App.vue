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

        <div class="coverImage">
          <video id="coverVideo" height="100%" loop>
            <source
              id="coverSource"
              :src="source[current - 1].background"
              type="video/mp4"
            >
          </video>
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
            <td class="title">
              <h6
                v-text="index.name"
                :class="{'red': current == index.id}"
              ></h6>
            </td>
            <td class="title">
            </td>
          </tr>

        </table>

        <div class="info">
					<h4 v-text="currentVoicer"></h4>
					<h3 v-text="currentSong"></h3>
          <img :src="currentImg" width="250" style="position:absolute; bottom:100px;left: 50px">
				</div>

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
  const DiscordRPC = require('discord-rpc');

  const clientId = '499605504813826053';
  DiscordRPC.register(clientId);
  const rpc = new DiscordRPC.Client({ transport: 'ipc' });

  rpc.setActivity({
    details: 'Search song',
    state: 'Radio Record channels',
    startTimestamp: new Date(),
    largeImageKey: 'record',
    largeImageText: 'Radio Record Player',
    instance: false,
  });
  rpc.login({ clientId }).catch(console.error);

  export default {
    name: 'Player',

    data() {
      return {
        isPlay: false,
        volume: 100,
        current: 1,
        currentVoicer: '',
        currentSong: '',
        currentImg: '',
        time: 0,
        source: [
        	{id: 1, song: 'https://www.radiorecord.ru/xml/rr_online_v8.txt', src: 'http://air.radiorecord.ru:805/rr_320', name: 'Radio Record', background: 'https://media.giphy.com/media/xXvIkTu08XQLC/giphy.mp4'},
        	{id: 2, song: 'https://www.radiorecord.ru/xml/trancehits_online_v8.txt', src: 'http://air.radiorecord.ru:805/trancehits_320', name: 'Trance Hits', background: 'https://media.giphy.com/media/l2SpSmDIXYH4ykEHS/giphy.mp4'},
        	{id: 3, song: 'https://www.radiorecord.ru/xml/2step_online_v8.txt', src: 'http://air.radiorecord.ru:805/2step_320', name: '2 step', background: 'https://media.giphy.com/media/AaOYWtozeBpAc/giphy.mp4'},
        	{id: 4, song: 'https://www.radiorecord.ru/xml/tecktonik_online_v8.txt', src: 'http://air.radiorecord.ru:805/tecktonik_320', name: 'Tecktonik', background: 'https://media.giphy.com/media/xThta2TIEn7PXojyb6/giphy.mp4'},
        	{id: 5, song: 'https://www.radiorecord.ru/xml/neurofunk_online_v8.txt', src: 'http://air.radiorecord.ru:805/neurofunk_320', name: 'Neurofunk', background: 'https://media.giphy.com/media/10kxE34bJPaUO4/giphy.mp4'},
        	{id: 6, song: 'https://www.radiorecord.ru/xml/edmhits_online_v8.txt', src: 'http://air.radiorecord.ru:805/edmhits_320', name: 'EDM Hits', background: 'https://media.giphy.com/media/XeJeluwfWWELe/giphy.mp4'},
        	{id: 7, song: 'https://www.radiorecord.ru/xml/houseclss_online_v8.txt', src: 'http://air.radiorecord.ru:805/houseclss_320', name: 'House Classics', background: 'https://media.giphy.com/media/tDgWEibPXFyzS/giphy.mp4'},
        	{id: 8, song: 'https://www.radiorecord.ru/xml/uplift_online_v8.txt', src: 'http://air.radiorecord.ru:805/uplift_320', name: 'Upfliting', background: 'https://media.giphy.com/media/ByozcDGZsaKis/giphy.mp4'},
        	{id: 9, song: 'https://www.radiorecord.ru/xml/darkside_online_v8.txt', src: 'http://air.radiorecord.ru:805/darkside_320', name: 'Darkside', background: 'https://media.giphy.com/media/F6ub4AQXz13xK/giphy.mp4'},
        	{id: 10, song: 'https://www.radiorecord.ru/xml/dream_online_v8.txt', src: 'http://air.radiorecord.ru:805/dream_320', name: 'Dream Dance', background: 'https://media.giphy.com/media/UGQopfLmrzNO8/giphy.mp4'},
        	{id: 11, song: 'https://www.radiorecord.ru/xml/bighits_online_v8.txt', src: 'http://air.radiorecord.ru:805/bighits_320', name: 'Big Hits', background: 'https://media.giphy.com/media/vDQsziDhqRGQE/giphy.mp4'},
        	{id: 12, song: 'https://www.radiorecord.ru/xml/househits_online_v8.txt', src: 'http://air.radiorecord.ru:805/househits_320', name: 'House Hits', background: 'https://media.giphy.com/media/lLfNvNFUytmnu/giphy.mp4'},
        	{id: 13, song: 'https://www.radiorecord.ru/xml/synth_online_v8.txt', src: 'http://air.radiorecord.ru:805/synth_320', name: 'Synthwave', background: 'https://media.giphy.com/media/3q4Qqf7KlFSzGtRLQE/giphy.mp4'},
        	{id: 14, song: 'https://www.radiorecord.ru/xml/progr_online_v8.txt', src: 'http://air.radiorecord.ru:805/progr_320', name: 'Progressive', background: 'https://media.giphy.com/media/5m6umHTnh0UI8/giphy.mp4'},
        	{id: 15, song: 'https://www.radiorecord.ru/xml/mt_online_v8.txt', src: 'http://air.radiorecord.ru:805/mt_320', name: 'Midtempo', background: 'https://media.giphy.com/media/3V9cxzbZWALle/giphy.mp4'},
        	{id: 16, song: 'https://www.radiorecord.ru/xml/elect_online_v8.txt', src: 'http://air.radiorecord.ru:805/elect_320', name: 'Electro', background: 'https://media.giphy.com/media/Zuic5hGIA9SrC/giphy.mp4'},
        	{id: 17, song: 'https://www.radiorecord.ru/xml/ibiza_online_v8.txt', src: 'http://air.radiorecord.ru:805/ibiza_320', name: 'Innocence', background: 'https://media.giphy.com/media/3o7TKvkrbL9A3gXBK0/giphy.mp4'},
        	{id: 18, song: 'https://www.radiorecord.ru/xml/gold_online_v8.txt', src: 'http://air.radiorecord.ru:805/gold_320', name: 'Gold', background: 'https://media.giphy.com/media/olAik8MhYOB9K/giphy.mp4'},
        	{id: 19, song: 'https://www.radiorecord.ru/xml/groovetribal_online_v8.txt', src: 'http://air.radiorecord.ru:805/groovetribal_320', name: 'Groove/Tribal', background: 'https://media.giphy.com/media/26Ff87zixpk2xxAFW/giphy.mp4'},
        	{id: 20, song: 'https://www.radiorecord.ru/xml/complextro_online_v8.txt', src: 'http://air.radiorecord.ru:805/complextro_320', name: 'Complextro', background: 'https://media.giphy.com/media/7MdYyz8TqYKEU/giphy.mp4'},
        	{id: 21, song: 'https://www.radiorecord.ru/xml/1970_online_v8.txt', src: 'http://air.radiorecord.ru:805/1970_320', name: '1970s', background: 'https://media.giphy.com/media/ulZ6ST8hOiaZy/giphy.mp4'},
        	{id: 22, song: 'https://www.radiorecord.ru/xml/chillhouse_online_v8.txt', src: 'http://air.radiorecord.ru:805/chillhouse_320', name: 'Chill House', background: 'https://media.giphy.com/media/FLZ610GPmjPdC/giphy.mp4'},
        	{id: 23, song: 'https://www.radiorecord.ru/xml/1980_online_v8.txt', src: 'http://air.radiorecord.ru:805/1980_320', name: '1980s', background: 'https://media.giphy.com/media/JRi5RF32hwXJu/giphy.mp4'},
        	{id: 24, song: 'https://www.radiorecord.ru/xml/cadillac_online_v8.txt', src: 'http://air.radiorecord.ru:805/cadillac_320', name: 'Cadillac FM', background: 'https://media.giphy.com/media/rfRC2uoC4vd16/giphy.mp4'},
        	{id: 25, song: 'https://www.radiorecord.ru/xml/rapclassics_online_v8.txt', src: 'http://air.radiorecord.ru:805/rapclassics_320', name: 'Rap Classics', background: 'https://media.giphy.com/media/3oxHQvKp6L6P6cFJV6/giphy.mp4'},
        	{id: 26, song: 'https://www.radiorecord.ru/xml/rap_online_v8.txt', src: 'http://air.radiorecord.ru:805/rap_320', name: 'Rap Hits', background: 'https://media.giphy.com/media/aufd3EoUNlOfK/giphy.mp4'},
        	{id: 27, song: 'https://www.radiorecord.ru/xml/discofunk_online_v8.txt', src: 'http://air.radiorecord.ru:805/discofunk_320', name: 'Disco/Funk', background: 'https://media.giphy.com/media/oXHDN5mJTpVW8/giphy.mp4'},
        	{id: 28, song: 'https://www.radiorecord.ru/xml/technopop_online_v8.txt', src: 'http://air.radiorecord.ru:805/technopop_320', name: 'Technopop', background: 'https://media.giphy.com/media/26lCNXMDLzg8baSOI/giphy.mp4'},
        	{id: 29, song: 'https://www.radiorecord.ru/xml/eurodance_online_v8.txt', src: 'http://air.radiorecord.ru:805/eurodance_320', name: 'Eurodance', background: 'https://media.giphy.com/media/BXt3LMsr8WSwo/giphy.mp4'},
        	{id: 30, song: 'https://www.radiorecord.ru/xml/drumhits_online_v8.txt', src: 'http://air.radiorecord.ru:805/drumhits_320', name: 'Drum`n`Bass Hits', background: 'https://media.giphy.com/media/cXjS6nMXNA0Ja/giphy.mp4'},
        	{id: 31, song: 'https://www.radiorecord.ru/xml/liquidfunk_online_v8.txt', src: 'http://air.radiorecord.ru:805/liquidfunk_320', name: 'Liquid Funk', background: 'https://media.giphy.com/media/10kxE34bJPaUO4/giphy.mp4'},
        	{id: 32, song: 'https://www.radiorecord.ru/xml/jungle_online_v8.txt', src: 'http://air.radiorecord.ru:805/jungle_320', name: 'Jungle', background: 'https://media.giphy.com/media/xT77XFdtzxsOBsaKkw/giphy.mp4'},
        	{id: 33, song: 'https://www.radiorecord.ru/xml/mix_online_v8.txt', src: 'http://air.radiorecord.ru:805/mix_320', name: 'Megamix', background: 'https://media.giphy.com/media/mAyCkVztyedPy/giphy.mp4'},
        	{id: 34, song: 'https://www.radiorecord.ru/xml/deep_online_v8.txt', src: 'http://air.radiorecord.ru:805/deep_320', name: 'Deep', background: 'https://media.giphy.com/media/PYsOfmCLHEaAg/giphy.mp4'},
        	{id: 35, song: 'https://www.radiorecord.ru/xml/club_online_v8.txt', src: 'http://air.radiorecord.ru:805/club_320', name: 'EDM', background: 'https://media.giphy.com/media/M3o6jPwh4jHGw/giphy.mp4'},
        	{id: 36, song: 'https://www.radiorecord.ru/xml/trop_online_v8.txt', src: 'http://air.radiorecord.ru:805/trop_320', name: 'Tropical', background: 'https://media.giphy.com/media/RJq0mpiVETuRa/giphy.mp4'},
        	{id: 37, song: 'https://www.radiorecord.ru/xml/goa_online_v8.txt', src: 'http://air.radiorecord.ru:805/goa_320', name: 'GOA/PSY', background: 'https://media.giphy.com/media/8hGRRN0hhN8B2/giphy.mp4'},
        	{id: 38, song: 'https://www.radiorecord.ru/xml/fut_online_v8.txt', src: 'http://air.radiorecord.ru:805/fut_320', name: 'Future House', background: 'https://media.giphy.com/media/NxWk4NY7C59Fm/giphy.mp4'},
        	{id: 39, song: 'https://www.radiorecord.ru/xml/tm_online_v8.txt', src: 'http://air.radiorecord.ru:805/tm_320', name: 'Trancemission', background: 'https://media.giphy.com/media/3ohfFDYgapOeekjXI4/giphy.mp4'},
        	{id: 40, song: 'https://www.radiorecord.ru/xml/chil_online_v8.txt', src: 'http://air.radiorecord.ru:805/chil_320', name: 'Chill-Out', background: 'https://media.giphy.com/media/26Ff6Mzngeac3NhJK/giphy.mp4'},
        	{id: 41, song: 'https://www.radiorecord.ru/xml/mini_online_v8.txt', src: 'http://air.radiorecord.ru:805/mini_320', name: 'Minimal/Tech', background: 'https://media.giphy.com/media/xULW8lKRBkg5qPABqg/giphy.mp4'},
        	{id: 42, song: 'https://www.radiorecord.ru/xml/ps_online_v8.txt', src: 'http://air.radiorecord.ru:805/ps_320', name: 'Pirate Station', background: 'https://media.giphy.com/media/PNwaNXiP6ubw4/giphy.mp4'},
        	{id: 43, song: 'https://www.radiorecord.ru/xml/vip_online_v8.txt', src: 'http://air.radiorecord.ru:805/vip_320', name: 'Vip House', background: 'https://media.giphy.com/media/10hO3rDNqqg2Xe/giphy.mp4'},
        	{id: 44, song: 'https://www.radiorecord.ru/xml/hypno_online_v8.txt', src: 'http://air.radiorecord.ru:805/hypno_320', name: 'Hypnotic', background: 'https://media.giphy.com/media/kWADDWRWrieje/giphy.mp4'},
        	{id: 45, song: 'https://www.radiorecord.ru/xml/trancehouse_online_v8.txt', src: 'http://air.radiorecord.ru:805/trancehouse_320', name: 'Trancehouse', background: 'https://media.giphy.com/media/xUOxflfjn4SmwWqWME/giphy.mp4'},
        	{id: 46, song: 'https://www.radiorecord.ru/xml/jackin_online_v8.txt', src: 'http://air.radiorecord.ru:805/jackin_320', name: 'Jackin`/Garage', background: 'https://media.giphy.com/media/3oz8xEG72RGTQ5q3WE/giphy.mp4'},
        	{id: 47, song: 'https://www.radiorecord.ru/xml/mmbt_online_v8.txt', src: 'http://air.radiorecord.ru:805/mmbt_320', name: 'Moombahton', background: 'https://media.giphy.com/media/3o6wrweu5IuWEBD9WU/giphy.mp4'},
        	{id: 48, song: 'https://www.radiorecord.ru/xml/sd90_online_v8.txt', src: 'http://air.radiorecord.ru:805/sd90_320', name: 'Superdisco 90s', background: 'https://media.giphy.com/media/3oKHWqBRAndWxStj9K/giphy.mp4'},
        	{id: 49, song: 'https://www.radiorecord.ru/xml/brks_online_v8.txt', src: 'http://air.radiorecord.ru:805/brks_320', name: 'Breaks', background: 'https://media.giphy.com/media/3o7aD04Qk69gc9sp3O/giphy.mp4'},
        	{id: 50, song: 'https://www.radiorecord.ru/xml/dub_online_v8.txt', src: 'http://air.radiorecord.ru:805/dub_320', name: 'Dubstep', background: 'https://media.giphy.com/media/50EVbvPHSPF2U/giphy.mp4'},
        	{id: 51, song: 'https://www.radiorecord.ru/xml/dc_online_v8.txt', src: 'http://air.radiorecord.ru:805/dc_320', name: 'Dancecore', background: 'https://media.giphy.com/media/RX7N03MEUafW8/giphy.mp4'},
        	{id: 52, song: 'https://www.radiorecord.ru/xml/fbass_online_v8.txt', src: 'http://air.radiorecord.ru:805/fbass_320', name: 'Future Bass', background: 'https://media.giphy.com/media/3oD3YKQ0uEbe88fXgI/giphy.mp4'},
        	{id: 53, song: 'https://www.radiorecord.ru/xml/rmx_online_v8.txt', src: 'http://air.radiorecord.ru:805/rmx_320', name: 'Remix', background: 'https://media.giphy.com/media/3oeSALGvQ6r8oTymnS/giphy.mp4'},
        	{id: 54, song: 'https://www.radiorecord.ru/xml/techno_online_v8.txt', src: 'http://air.radiorecord.ru:805/techno_320', name: 'Techno', background: 'https://media.giphy.com/media/b60d0PNX0NPdS/giphy.mp4'},
        	{id: 55, song: 'https://www.radiorecord.ru/xml/hbass_online_v8.txt', src: 'http://air.radiorecord.ru:805/hbass_320', name: 'Hard Bass', background: 'https://media.giphy.com/media/uZXZhtpCPRc5i/giphy.mp4'},
        	{id: 56, song: 'https://www.radiorecord.ru/xml/teo_online_v8.txt', src: 'http://air.radiorecord.ru:805/teo_320', name: 'Hardstyle', background: 'https://media.giphy.com/media/l4FGDHTesA4v3XmtG/giphy.mp4'},
        	{id: 57, song: 'https://www.radiorecord.ru/xml/trap_online_v8.txt', src: 'http://air.radiorecord.ru:805/trap_320', name: 'Trap', background: 'https://media.giphy.com/media/l4FGvaVO8FvC1cevm/giphy.mp4'},
        	{id: 58, song: 'https://www.radiorecord.ru/xml/pump_online_v8.txt', src: 'http://air.radiorecord.ru:805/pump_320', name: 'Old School', background: 'https://media.giphy.com/media/CmRgHgPchrHbO/giphy.mp4'},
        	{id: 59, song: 'https://www.radiorecord.ru/xml/rock_online_v8.txt', src: 'http://air.radiorecord.ru:805/rock_320', name: 'Rock', background: 'https://media.giphy.com/media/LNAQUlfh94kh2/giphy.mp4'},
        	{id: 60, song: 'https://www.radiorecord.ru/xml/mdl_online_v8.txt', src: 'http://air.radiorecord.ru:805/mdl_320', name: 'Slow FM', background: 'https://media.giphy.com/media/83QhSF6YdWGIM/giphy.mp4'},
        	{id: 61, song: 'https://www.radiorecord.ru/xml/symph_online_v8.txt', src: 'http://air.radiorecord.ru:805/symph_320', name: 'Symphony FM', background: 'https://media.giphy.com/media/l2JhGk8rR9WFLEDQY/giphy.mp4'},
        	{id: 62, song: 'https://www.radiorecord.ru/xml/yo_online_v8.txt', src: 'http://air.radiorecord.ru:805/yo_320', name: 'Black', background: 'https://media.giphy.com/media/xULW8qTe7yRirTPMUU/giphy.mp4'},
        	{id: 63, song: 'https://www.radiorecord.ru/xml/rave_online_v8.txt', src: 'http://air.radiorecord.ru:805/rave_320', name: 'Rave FM', background: 'https://media.giphy.com/media/TPHLeSRLGtxe/giphy.mp4'}
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
        document.querySelector('#coverVideo').play();
        document.querySelector("#play").checked = true;
        this.isPlay = true;

        this.pagination = [];

        /*for (var i = 0; i < this.source.length; i++) {
          let testMinus = this.current - 3;
          let testPlus = this.current + 2;
          if (i >= testMinus && i <= testPlus) {
            this.pagination.push(this.source[i]);
          }
        }*/

        const paginationFilter = (_, i) => (i >= this.current - 3) && (i <= this.current + 2);
        this.source.filter(paginationFilter).forEach((_, i) => this.pagination.push(this.source[i]));
      },

      checkConnection() {
        document.querySelector('#audio').play;
        document.querySelector('#coverVideo').play();
        document.querySelector("#play").checked = true;
        this.isPlay = true;
      },

      play() {
        var audio = document.querySelector('#audio');
        var cover = document.querySelector('#coverVideo');
        this.isPlay = !this.isPlay;
        this.loadSong();

        if (audio.paused || audio.ended) {
          audio.play();
          cover.play();
        } else {
          audio.pause();
          cover.pause();
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

        /*for (var i = 0; i < this.source.length; i++) {
          if (this.source[i].id == id) {
            this.current = this.source[i].id;
            document.querySelector('#coverVideo').src = this.source[i].background;
            this.refresh();
            this.loadSong();
          }
        }*/

        const moveFilter = (_, i) => (i == id);
        this.source.filter(moveFilter).forEach((_, i) => {
            this.current = this.source[i].id;
            document.querySelector('#coverVideo').src = this.source[i].background;
            this.refresh();
            this.loadSong();
          }
        );
      },

      close() {
        // @TODO Need to save volume, localstorage cant work
        let window = remote.getCurrentWindow();
        window.close();
      },
      
      // @TODO Add dragged window
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

          
        rpc.setActivity({
          details: this.currentVoicer,
          state: this.currentSong,
          startTimestamp: this.time,
          largeImageKey: 'record',
          largeImageText: title,
          instance: false,
        });
      }
    },

    mounted() {
      this.refresh();
      this.loadSong();
      this.time = new Date();

      setInterval(() => {
        this.loadSong();
      }, 500);

      setInterval(() => {
        if (this.isPlay) {
          this.checkConnection()
        }
      }, 250);
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

.red {
  color:red;
}

.white {
  color:white;
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
  background-color: black;
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
  width: 100%;
  position: absolute;
  text-align: center;
  top: 400px;
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
  bottom: 65px;
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