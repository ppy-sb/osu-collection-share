<template>
  <score-list-card
    :loading="loading"
    :list="slicedBP"
    :more="showCount <= bp.length"
    @moreClicked="increaseLength"
  >
    <template v-slot:header>
      <h4>{{ $t("user.bp") }}:</h4>
    </template>
    <template v-slot:more-link>
      {{ $t("scoreCard.more") }}...
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
        // user: {
        //     type: Object,
        //     default: () => {
        //         id: -1;
        //     }
        // },
        id: {
            type: [Number, String],
            default: -1,
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
        showCount: 10,
        bp: [],
        loading: true
        // cachedMap: []
    }),
    computed: {
        slicedBP() {
            return this.bp.slice(0, this.showCount);
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
        beforeRouteUpdate() {},
        async init() {
            this.loading = true;
            const bp = await axios({
                url: `${this.$root.rippleApiBase}/users/scores/${
                    this.rx ? "rx" : ""
                }bestall`,
                params: {
                    id: this.id,
                    mode: this.mode
                }
            }).then(res => res.data.scores || []);
            // console.log(bp);

            this.increaseClicked = 0;
            this.showCount = 10;
            this.bp.length = 0;
            this.bp.push(...bp);
            this.loading = false;
        },
        increaseLength() {
            if (this.increaseClicked < 2) {
                this.showCount += 10;
            } else {
                this.showCount += 40;
            }
            this.increaseClicked += 1;
        }
    },
};
</script>