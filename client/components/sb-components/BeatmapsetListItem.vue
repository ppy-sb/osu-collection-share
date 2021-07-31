<template>
  <b-list-group-item>
    <div class="d-flex w-100 justify-content-between align-items-stretch">
      <div class="d-flex flex-grow-1">
        <div class="d-flex flex-column justify-content-center mr-2">
          <lazy-image
            :src="smallPreviewImgSrc"
            class="hide-when-too-small bp-img"
          />
          <b-button
            variant="light"
            :href="beatmapSetLink"
            target="_blank"
            size="sm"
            class="mt-2"
            :disabled="set.id <= 0"
          >
            {{ $t('collectionCard.beatmapSetPage') }}
          </b-button>
        </div>
        <div class="align-top d-flex-column flex-grow-1">
          <div class="d-flex mb-1">
            <h5>
              <!-- <a :href="banchoBeatmapLink" v-html="score.beatmap.song_name" /> -->
              {{ songName() }}
            </h5>
            <small class="float-right ml-auto text-nowrap">
              {{ $t('collectionCard.setId') }} {{ set.id }}
            </small>
          </div>
          <div class="d-block">
            <!-- <b-collapse :visible="!visible" class="mx-1">
              <p v-for="(map) in set.maps" :key="`-diff-${set.id}-${map.md5}`" class="mb-1">
                {{ map.difficulty }}
              </p>
            </b-collapse> -->
            <b-collapse visible class="mx-1">
              <div
                v-for="(map,index) in set.maps"
                :key="`detail-${set.id}-${map.md5}`"
                class="my-1"
              >
                <b-card no-body class="shadow-sm">
                  <b-button
                    v-b-toggle="`accordion-detail-${set.id}-${map.md5}`"
                    block
                    variant="outline-secondary"
                    size="sm"
                    class="text-left border-0"
                  >
                    {{ map.difficulty }}
                  </b-button>
                  <b-collapse :id="`accordion-detail-${set.id}-${map.md5}`" :accordion="`accordion-detail-${set.id}`" :visible="bmstatistics[index]">
                    <div class="p-2">
                      <div>
                        AR: {{ map.approach_rate.toLocaleString(undefined,{maximumFractionDigits: 1}) }}
                        CS: {{ map.circle_size.toLocaleString(undefined,{maximumFractionDigits: 1}) }}
                        HP: {{ map.hp_drain.toLocaleString(undefined,{maximumFractionDigits: 1}) }}
                        OD: {{ map.overall_difficulty.toLocaleString(undefined,{maximumFractionDigits: 1}) }}
                      </div>
                      <div v-if="map.mode === 0">
                        <hr class="my-1">
                        <i class="fas fa-star" />: {{ map.star_rating_standard[0].toLocaleString(undefined,{maximumFractionDigits: 2}) }}
                        <br>
                        HR: {{ map.star_rating_standard[16].toLocaleString(undefined,{maximumFractionDigits: 2}) }}
                        <br>
                        DT: {{ map.star_rating_standard[64].toLocaleString(undefined,{maximumFractionDigits: 2}) }}
                        <br>
                        DTHR: {{ map.star_rating_standard[80].toLocaleString(undefined,{maximumFractionDigits: 2}) }}
                        <br>
                      </div>
                    </div>
                  </b-collapse>
                </b-card>
              </div>
            </b-collapse>
          </div>
        </div>
      </div>
    </div>
  </b-list-group-item>
</template>
<script>
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
  data () {
    return {
      visible: false,
      bmstatistics: this.set.maps.map(m => false)
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
    // hoverBeatmap (index, hover) {
    //   this.$set(this.bmstatistics, index, hover)
    // }
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
