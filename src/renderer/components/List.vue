<template>
  <div>
    <div
      v-if="listing == 'list'"
      class="search-box"
    >
      <div class="searchform">
        <input
          v-model="search"
          id="s"
          type="text"
          placeholder="Search"
        />
      </div>
    </div>
    <div id="scroll-container">
      <div 
        id="wrap-scroll"
        class="wrap-container"
      >
        <ul
          v-if="listing == 'list'"
          id="ul-scroll"
        >
          <li
            v-for="(index, key) in source"
            @click="change(index)"
            :key="key"
            :class="{
              'active': current == index.id,
              'ra-display-none': index.name.toLowerCase().search(search.toLowerCase()) == -1
            }"
            class="listing"
          >
            <span
              v-text="index.name"
              class="item"
            ></span>
            <i
              @click="madeFavorite(index.id)"
              :class="{'activeFavorite': !index.favorite}"
              class="fas fa-star iconFavorite"
            ></i>
          </li>
        </ul>

        <ul v-if="listing == 'favorite'">
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

        <ul v-if="listing == 'history'">
          <li
            v-for="(index, key) in history.slice().reverse()"
            :key="key"
            track-by="id"
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
          v-if="history.length <= 0"
          v-text="'No one song played'"
        ></h1>
      </div>
    </div>
    <svg-scroll/>
  </div>
</template>

<script>
/*
<list
  // Func
  @change="change()"
  @madeFavorite="madeFavorite()"
  // Options
  :listing="listing"
  :current="current"
  :search="search"
  // Data
  :source="source"
  :history="history"
/>
*/

  import SvgScroll from './helpers/SvgScroll'

  export default {
    name: 'Listing',

    components: {
      SvgScroll
    },

    props: {
      listing: {
        type: String,
        required: true,
      },
      search: {
        type: String | Number,
        required: false,
        default: () => '',
      },
      source: {
        type: Array | Object,
        required: true
      }
    },
  }
</script>

