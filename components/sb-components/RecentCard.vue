<template>
  <score-list-card
    :loading="loading"
    :list="recent"
    :more="more"
    @moreClicked="increaseLength"
  >
    <template v-slot:header>
      <h4>{{ $t("user.recent") }}:</h4>
    </template>
    <template v-slot:more-link>
      {{ $tc("scoreCard.countableMore",limit) }}...
    </template>
  </score-list-card>
</template>

<script>
const axios = require("axios");

import ScoreListCard from "./components/ScoreListCard.vue";
export default {
  components: {
    ScoreListCard
    // SyncLoader
  },
  props: {
    id: {
      type: [Number, String],
      default: undefined
    },
    mode: {
      type: Number,
      default: 0
    },
    rx: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    increaseClicked: 0,
    // showCount: 10,
    loading: true,
    recent: [],
    page: 0,
    limit: 5,
    frontendLimit: 40
  }),
  computed: {
    more() {
      return this.recent.length < this.frontendLimit;
    }
  },

  watch: {
    id(to, from) {
      this.init();
    },
    mode(to, from) {
      this.init();
    },
    rx(to, from) {
      this.init();
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    async getRecent() {
      const bp = await axios({
        url: `${this.$root.rippleApiBase}/users/scores/${
          this.rx ? "rx" : ""
        }recent`,
        params: {
          id: this.id,
          mode: this.mode,
          p: this.page,
          l: this.limit
        }
      }).then(res => res.data.scores || []);
      return bp;
    },
    async init() {
      // console.log(bp);
      this.increaseClicked = 0;
      this.limit = 5;
      this.recent.length = 0;
      this.increaseLength();
    },
    async increaseLength() {
      this.loading = true;
      this.page = this.recent.length / this.limit + 1;

      const newRecent = await this.getRecent();
      this.recent.push(...newRecent);

      //for next fetch
      this.increaseClicked += 1;
      //first time +5
      if (this.increaseClicked == 1) {
        // this.page = 1;
        //from second times +10
      } else if (this.increaseClicked > 1) {
        this.limit = 10;
      }
      this.loading = false;
    }
  }
};
</script>