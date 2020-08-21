<template>
  <card 
    no-body 
    shadow
  >
    <b-table
      :items="scores"
      :fields="fields"
      :empty-text="$t('leaderboard.empty')"
      borderless
      striped
      responsive
      show-empty
      table-variant="secondary"
      class="mb-0 text-nowrap"
      td-class
    >
      <template v-slot:head()="scope">
        {{ $t(`beatmaps.${scope.label}`) }}
      </template>
      <template v-slot:cell(index)="data">
        {{ data.index + 1 }}
      </template>
      <template v-slot:cell(date)="data">
        <span>{{ data.value }}</span>
      </template>
      <template v-slot:cell(score)="data">
        <span>
          {{ parseInt(data.value).toLocaleString("en", {
            style: "decimal",
          }) }}
        </span>
      </template>
      <template v-slot:cell(stats)="data">
        <span
          class="mr-1"
          v-html="`${smallerFloatHtml(data.item.accuracy.toLocaleString('en', {style: 'percent',minimumSignificantDigits: 2, maximumSignificantDigits: 4}))},`"
        />
        <span v-html="htmlCounts(data.item.counts)" />
      </template>
      <template v-slot:cell(user)="data">
        <!-- <div class="d-flex">
                    <div class="score-table-crop-img mr-2">
                        <lazy-image
                            :src="`https://a.ppy.sb/${data.value.id}`"
                            :src-placeholder="`https://a.ppy.sb/-1`"
                            style="width:100%"
                            :key="`score-avatar-${data.value.id}`"
                        />
                    </div>
                    <span>{{ data.value.name }}</span>
                </div>-->
        <!-- {{data.value}} -->
        <table-user
          :user="{id: data.value.id,username: data.value.name,username_aka:''}"
          :mode="mode ? mode : undefined"
          :rx="rx ? rx : undefined"
        />
      </template>
    </b-table>
  </card>
</template>
<script>
// import LazyImage from "@/components/sb-components/components/LazyImage";
import TableUser from "@/components/sb-components/components/TableUser";
const osu = require("node-osu");
const humanFormat = require("human-format");

import modHelper from "@/helpers/enum.js";
export default {
    components: {
        // LazyImage,
        TableUser
    },
    props: {
        scores: {
            type: Array,
            default: () => []
        },
        mode: {
            type: [String, Number],
            default: "std"
        },
        rx: {
            type: [String, Boolean],
            default: ""
        }
    },
    data() {
        return {
            logger: false,
            fields: [
                {
                    label: "index",
                    key: "index"
                },
                {
                    label: "user",
                      key: "user"
                },
                // "User",
                // { label: "Score", key: "score" },
                { label: "score", key: "score" },
                { label: "ingredient", key: "stats" },
                { label: "combo", key: "maxCombo" },
                {
                    label: "playedAt",
                    key: "date",
                    sortable: true,
                    formatter: (v, k, i) => {
                        const t = this.moment(v);
                        return `${t.format("l")} ${t.format("LT")}`;
                    }
                },
                {
                    label: "pp",
                    key: "pp",
                    sortable: true,
                    formatter: k => k.toFixed(2)
                },
                {
                    label: "mods",
                    key: "raw_mods",
                    formatter: v => modHelper.toModList(v).join(" ")
                }
            ]
        };
    },
    computed: {
        bid() {
            return this.beatmap.id;
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        async init() {
            this.log(this.fields, "fields");
        },
        smallerFloatHtml(str) {
            const splitted = str.split(".");
            if (splitted.length <= 1) return str;
            return `${splitted[0]}<small class="float-number">.${splitted[1]}</small></span>`;
        },
        htmlCounts(counts) {
            const c = [
                // { count: this.score.count_300, append: "x 300" },
                { count: counts[100], append: "x 100" },
                { count: counts[50], append: "x 50" },
                { count: counts.miss, append: "Miss" }
            ]
                .filter(({ count }) => count)
                .map(
                    ({ count, append }) =>
                        `${count} <small class="float-number">${append}</small>`
                )
                .join(", ");
            return c;
        },
        humanFormat(...any) {
            return humanFormat(...any);
        }
    }
};
</script>

<style>
.score-table-crop-img {
    width: 24px;
    height: 24px;
}
.score-table-crop-img img {
    object-fit: cover;
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