<template>
  <b-overlay
    :show="loading"
    spinner-variant="primary"
  >
    <template v-slot:overlay>
      <sync-loader
        :loading="loading"
        color="#172b4d"
      />
    </template>
    <card
      class="shadow"
      no-body
    >
      <template v-slot:header>
        <slot name="header">
          <h4>Score List:</h4>
        </slot>
      </template>
      <b-list-group flush>
        <score-list-item
          v-for="(score,index) in list"
          :key="index"
          :score="score"
        />
        <b-list-group-item v-if="more">
          <div class="row justify-content-center text-center">
            <div class="col-lg-9">
              <slot name="more-html">
                <a
                  href="#"
                  @click.prevent="increaseLength()"
                >
                  <slot name="more-link">Show more</slot>
                </a>
              </slot>
            </div>
          </div>
        </b-list-group-item>
        <b-list-group-item v-else-if="list.length == 0">
          ...
        </b-list-group-item>
      </b-list-group>
    </card>
  </b-overlay>
</template>

<script>
import SyncLoader from 'vue-spinner/src/SyncLoader.vue'

import ScoreListItem from './BeatmapsetListItem'
export default {
  // mounted() {
  //     this.init();
  // },
  components: {
    ScoreListItem,
    SyncLoader
  },
  props: {
    list: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    more: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    // increaseClicked: 0,
    // showCount: 10,
    // loading: true,
    // bp: [],
    // cachedMap: []
  }),
  computed: {
    // sliced() {
    //     return this.list.slice(0, this.showCount);
    // }
  },
  methods: {
    // async apiGetMap(beatmap) {
    //     let map = undefined;
    //     if ((map = this.cachedMap.find(map => map.id) == beatmap.id))
    //         return map;
    //     else {
    //         const beatmap = await $axios
    //             .get(`http://47.101.168.165:5005/api/map/${mapped.id}`)
    //             .then(res => res.data[0])
    //             .then(
    //                 res => new nodeOsu.Beatmap({ parseNumeric: true }, res)
    //             );
    //         this.cachedMap.push(beatmap);
    //         return beatmap;
    //     }
    // },
    // async init() {
    //     const bp = await axios({
    //         url: `${this.$root.apiBase}/users/scores/rxbestall`,
    //         params: {
    //             id: this.$route.params.id
    //         }
    //     }).then(res => res.data.scores);
    //     // console.log(bp);
    //     this.loading = true;
    //     this.increaseClicked = 0;
    //     this.showCount = 10;
    //     this.bp.length = 0;
    //     this.bp.push(...bp);
    //     this.loading = false;
    // },
    increaseLength () {
      this.$emit('moreClicked')
    }
  }

  // watch: {
  //     $route(to, from) {
  //         this.init();
  //     }
  // }
}
</script>
