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
            <img 
              :src="rankImgSrc" 
              class="score rank d-inline-block align-top" 
              alt="A"
            >
            <div class="d-inline-block">
              <h5 class="mb-1">
                <!-- <a :href="banchoBeatmapLink" v-html="score.beatmap.song_name" /> -->
                <router-link
                  :to="{
                    name:'beatmapsets', 
                    params: {
                      beatmapSetId: score.beatmap.beatmapset_id, 
                      beatmapId: score.beatmap.beatmap_id
                    }
                  }"
                  v-html="score.beatmap.song_name"
                />
              </h5>
              <p class="mb-1">
                <span v-html="htmlCounts" />
              </p>
            </div>
          </div>
          <small class="ml-2">{{ moment(score.time).format("LLLL") }}</small>
        </div>
      </div>
      <div class="d-flex align-items-end flex-column">
        <div class="align-top">
          <small
            class="float-right text-right text-nowrap"
          >{{ moment(score.time).fromNow() }}</small>
          <br>
          <p 
            v-if="score.pp" 
            class="float-right text-right mb-0 text-nowrap"
          >
            <span v-html="smallerFloatHtml(score.pp.toFixed(2))" /> pp
          </p>
        </div>
        <div class="mt-auto">
          <h4 class="mb-0 float-right text-right text-nowrap">
            {{ modsStr }}
          </h4>
        </div>
      </div>
    </div>
    <slot />
  </b-list-group-item>
</template>
<script>
// const moment = require("moment");

import modHelper from "@/helpers/enum.js";
import LazyImage from "./LazyImage.vue";
export default {
    components: {
        LazyImage
    },
    props: ["score"],
    // beforeCreate() {
    //     moment.locale(this.$root.locale || "zh-cn");
    // },
    // data: () =>({
    //     modHelper,
    // }),
    computed: {
        htmlCounts() {
            // //SS
            // if (this.score.accuracy == 100) return "-"
            //or
            const combo = this.score.full_combo
                ? `${
                      this.score.beatmap.max_combo
                  }<small class="float-number">x</small> ${this.$t(
                      "scoreCard.fullCombo"
                  )}`
                : `${this.score.max_combo} <small>/</small> ${this.score.beatmap.max_combo}<small class="float-number">x</small>`;
            const accuracy =
                this.score.accuracy !== 100
                    ? this.smallerFloatHtml(
                          `${this.score.accuracy.toFixed(2)}%`
                      )
                    : "";
            const counts = [
                // { count: this.score.count_300, append: "x 300" },
                // { count: this.score.count_100, append: "x 100" },
                // { count: this.score.count_50, append: "x 50" },
                // { count: this.score.count_miss, append: this.$t('scoreCard.miss') }
                ...Object.entries(this.score)
                    .filter(
                        ([k, v]) =>
                            k.includes("count_") &&
                            !["count_geki", "count_katu", "count_300"].includes(
                                k
                            )
                    )
                    .map(([k, v]) => ({
                        count: v,
                        append:
                            k == "count_miss"
                                ? this.$t("scoreCard.miss")
                                : `x ${k.slice(6)}`
                    }))
            ]
                .filter(({ count }) => count)
                .map(
                    ({ count, append }) =>
                        `${count} <small class="float-number">${append}</small>`
                )
                .join(" <small>/</small> ");
            return [combo, accuracy, counts].filter(str => str).join(" , ");
        },
        // songNameHtml() {
        //     let rtn = this.score.beatmap.song_name;
        //     ["-", "(", "["].map(splitter => {
        //         rtn = rtn.split(splitter).join(`<wbr>${splitter}`);
        //     });
        //     return rtn;
        // },
        rankImgSrc() {
            const rank = () => {
                switch (this.score.rank) {
                    case "SSH":
                        return "SSHD";
                    case "SH":
                        return "SHD";
                    default:
                        return this.score.rank;
                }
            };
            return `https://osu.ppy.sb/static/ranking-icons/${rank()}.svg`;
        },
        beatmapLink() {
            return `https://osu.ppy.sb/b/${this.beatmap.beatmap_id}`;
        },
        banchoBeatmapLink() {
            return `https://osu.ppy.sh/beatmapsets/${this.score.beatmap.beatmapset_id}#/${this.score.beatmap.beatmap_id}`;
        },
        smallPreviewImgSrc() {
            return `https://b.ppy.sh/thumb/${this.score.beatmap.beatmapset_id}l.jpg`;
        },
        modsStr() {
            return modHelper.toModList(this.score.mods).join(" ");
        }
    },
    methods: {
        // moment(...any) {
        //     return moment(...any);
        // },
        smallerFloatHtml(str) {
            const splitted = str.split(".");
            return `${splitted[0]}<small class="float-number">.${splitted[1]}</small></span>`;
        }
    },
};
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