<template>
  <b-list-group-item>
    <div class="d-flex w-100 justify-content-between align-items-stretch">
      <div class="d-flex">
        <lazy-image
          :src="smallPreviewImgSrc"
          class="align-top mr-2 hide-when-too-small bp-img"
        />
        <div class="align-top">
          <div class="d-flex">
            <div class="d-inline-block">
              <h5 class="mb-1">
                <!-- <a :href="banchoBeatmapLink" v-html="score.beatmap.song_name" /> -->
                {{ songName() }}
              </h5>
              <p v-for="(map,index) in set.maps.filter((_,index) => index < 2)" :key="(()=>`${index}-diff-${set.id}-${map.md5}`)()" class="mb-1">
                {{ map.difficulty }}
              </p>
            </div>
          </div>
          <small v-if="set.maps.length > 2">{{ set.maps.length - 2 }} other diffs</small>
        </div>
      </div>
      <div class="d-flex align-items-end flex-column">
        <div class="align-top">
          <small
            class="float-right text-right text-nowrap"
          >set id: {{ set.id }}</small>
          <br>
          <p
            class="float-right text-right mb-0 text-nowrap"
          >
            <span>{{ set.maps.length }}</span> maps
          </p>
        </div>
        <div class="mt-auto">
          <h4 class="mb-0 float-right text-right text-nowrap">
            <b-button-group size="sm" class="mb-1">
              <b-button v-b-toggle="`collapse-${set.id}`" variant="primary">
                More
              </b-button>
              <b-button variant="light" :href="beatmapSetLink" target="_blank">
                beatmapset page
              </b-button>
            </b-button-group>
          </h4>
        </div>
      </div>
    </div>
    <b-collapse :id="(()=>`collapse-${set.id}`)()">
      <b-table-simple>
        <b-tbody>
          <b-tr v-for="map in set.maps" :key="`detail-${set.id}-${map.md5}`">
            <b-th>{{ map.difficulty }}</b-th>
            <b-td>
              <b-button-group size="sm">
                <b-button variant="light" :href="thread(map)" target="_blank">
                  thread
                </b-button>
                <b-button variant="success" :href="beatmapLink(map)" target="_blank">
                  /b/ link
                </b-button>
                <b-button v-b-toggle="`collapse-${set.id}-${map.md5}`">
                  beatmap static
                </b-button>
              </b-button-group>
              <b-collapse :id="(()=>`collapse-${set.id}-${map.md5}`)()" :key="`collaspe-${set.id}-${map.md5}`">
                <div>
                  AR: {{ map.approach_rate.toLocaleString(undefined,{maximumFractionDigits: 1}) }}
                  CS: {{ map.circle_size.toLocaleString(undefined,{maximumFractionDigits: 1}) }}
                  HP: {{ map.hp_drain.toLocaleString(undefined,{maximumFractionDigits: 1}) }}
                  OD: {{ map.overall_difficulty.toLocaleString(undefined,{maximumFractionDigits: 1}) }}
                </div>

                <div v-if="map.mode === 0">
                  star rating:<br>
                  NM: {{ map.star_rating_standard[0].toLocaleString(undefined,{maximumFractionDigits: 2}) }}
                  HR: {{ map.star_rating_standard[16].toLocaleString(undefined,{maximumFractionDigits: 2}) }}
                  DT: {{ map.star_rating_standard[64].toLocaleString(undefined,{maximumFractionDigits: 2}) }}
                  DTHR: {{ map.star_rating_standard[80].toLocaleString(undefined,{maximumFractionDigits: 2}) }}
                </div>
              </b-collapse>
            </b-td>
          </b-tr>
        </b-tbody>
      </b-table-simple>
    </b-collapse>
  </b-list-group-item>
</template>
<script>
// const moment = require("moment");

// import modHelper from "@/helpers/enum.js";
import LazyImage from './LazyImage.vue'
export default {
  components: {
    LazyImage
  },
  props: {
    set: {
      type: Object,
      default: () => ({
        id: -1,
        artist: {
          name: 'Unknown',
          unicodeName: 'Unknown'
        },
        song: {
          title: 'Unknown',
          unicodeTitle: 'unknown'
        },
        maps: []
      })
    }
  },
  computed: {
    beatmapSetLink () {
      return `https://osu.ppy.sh/s/${this.set.id}`
    },
    smallPreviewImgSrc () {
      return `https://b.ppy.sh/thumb/${this.set.id}l.jpg`
    }
  },
  methods: {
    songName () {
      return `${this.set.artist.name} - ${this.set.song.title}`
    },
    smallerFloatHtml (str) {
      const splitted = str.split('.')
      return `${splitted[0]}<small class="float-number">.${splitted[1]}</small></span>`
    },
    thread (map) {
      return `https://osu.ppy.sh/community/forums/topics/${map.thread_id}`
    },
    beatmapLink (map) {
      return `https://osu.ppy.sh/b/${map.beatmap_id}`
    }
  }
}
</script>

<style>
.score.rank {
    height: 3.75rem;
}
.bp-img {
    height: 80px !important;
}
.float-number {
    font-weight: 300;
}
.list-group-item p {
    font-weight: 400;
}
@media (max-width: 992px) {
    .hide-when-too-small {
        visibility: collapse !important;
        display: none !important;
    }
}
@media (max-width: 768px) {
    .list-group-item {
        font-size: 80%;
    }
    .list-group-item small {
        font-size: 85%;
    }
    .list-group-item h5 {
        font-size: 0.9rem;
    }
    .list-group-item h4 {
        font-size: 1.25rem;
    }
    .list-group-item p {
        font-weight: 400;
        font-size: 0.8rem;
    }
    .score.rank {
        height: 2.5rem;
    }
}
</style>
