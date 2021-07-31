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
  methods: {

    increaseLength () {
      this.$emit('moreClicked')
    }
  }
}
</script>
