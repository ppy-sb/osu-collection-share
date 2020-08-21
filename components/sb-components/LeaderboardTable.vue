<template>
  <b-table
    :items="players"
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
    <template v-slot:table-colgroup="scope">
      <col
        v-for="field in scope.fields"
        :key="field.key"
        :style="{ 
          width: field.label == 'level' ? '160px' : '',
        }"
      >
    </template>
    <template v-slot:head()="data">
      <div v-if="data.column == 'chosen_mode.country_leaderboard_rank'">
        <router-link
          :to="{ name: 'leaderboard', params:{ mode: mode ? mode : undefined, rx: rx ? rx : undefined}}"
        >
          <gb-flag 
            :code="country" 
            size="small" 
            icon-path="/assets/flags" 
            class="pr-2"
          />
        </router-link>
      </div>
      <div 
        v-else-if="data.column == 'chosen_mode.level'" 
        style="min-width:70px"
      >
        {{ $t(`leaderboard.${data.label}`) }}
      </div>
      <div v-else>
        {{ $t(`leaderboard.${data.label}`) }}
      </div>
    </template>
    <template v-slot:cell(user)="data">
      <div class="d-flex">
        <router-link
          :to="{ name: 'country-leaderboard', params:{country:data.item.country, mode: mode ? mode : undefined, rx: rx ? rx : undefined}}"
        >
          <gb-flag
            v-if="country == ''"
            :code="data.item.country"
            size="small"
            icon-path="/assets/flags"
            class="mr-2"
          />
        </router-link>
        <div class="d-flex">
          <table-user
            :user="data.item"
            :mode="mode ? mode : undefined"
            :rx="rx ? rx : undefined"
          />
        </div>
      </div>
    </template>
    <template v-slot:cell(chosen_mode.level)="data">
      <!-- {{data.value}} -->
      <div class="d-flex align-items-center">
        <!-- <base-progress type="default" :value="data.value.f * 100" class="py-0">
                    <template v-slot:label>
                        <s></s>
                    </template>
                    <span>{{data.value.v.toFixed(3)}}</span>
                </base-progress>-->
        <small class="pr-1">Lv.{{ data.value.i }}</small>
        <b-progress
          :value="data.value.f * 100"
          animated
          variant="default"
          class="flex-grow-1 mb-0"
        />
      </div>
    </template>
  </b-table>
</template>
<script>
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
        players: {
            type: Array,
            default: () => []
        },
        country: {
            type: String,
            default: ""
        },
        mode: {
            type: String,
            default: ""
        },
        rx: {
            type: String,
            default: ""
        }
    },
    data() {
        return {
            logger: false,
            StaticRows: [
                {
                    label: "user",
                    key: "user"
                    // stickyColumn: true,
                },
                {
                    label: "level",
                    key: "chosen_mode.level",
                    formatter: k => {
                        const v = parseFloat(k);
                        const i = Math.floor(v);
                        const f = v % 1;
                        return {
                            v,
                            i,
                            f
                        };
                    }
                },
                {
                    label: "accuracy",
                    key: "chosen_mode.accuracy",
                    formatter: k =>
                        (parseFloat(k) / 100).toLocaleString("en", {
                            style: "percent",
                            minimumSignificantDigits: 2,
                            maximumSignificantDigits: 4
                        }),
                    thClass: ["text-right"],
                    tdClass: ["text-right"]
                },
                {
                    label: "rankedScore",
                    key: "chosen_mode.ranked_score",
                    formatter: k =>
                        k.toLocaleString("en", {
                            style: "decimal"
                        }),
                    thClass: ["text-right"],
                    tdClass: ["text-right"]
                },
                // {
                //     label: "totalScore",
                //     key: "chosen_mode.total_score",
                //     formatter: k =>
                //         k.toLocaleString("en", {
                //             style: "decimal"
                //         }),
                //     thClass: ["text-right"],
                //     tdClass: ["text-right"]
                // },
                {
                    label: "pp",
                    key: "chosen_mode.pp",
                    formatter: k =>
                        `${k.toLocaleString("en", {
                            style: "decimal"
                        })}pp`,
                    thClass: ["text-right"],
                    tdClass: ["text-right"]
                }
            ]
        };
    },
    computed: {
        bid() {
            return this.beatmap.id;
        },
        fields() {
            return [
                {
                    label: "index",
                    // flag: this.country,
                    key: this.country
                        ? "chosen_mode.country_leaderboard_rank"
                        : "chosen_mode.global_leaderboard_rank",
                    formatter: k => `#${k}`,
                    thClass: ["text-right"],
                    tdClass: ["text-right"]
                },
                ...this.StaticRows
            ]
            .map(row => {
                const mixin = ["py-3", "pl-2", "align-middle"];
                if (row.tdClass)
                    row.tdClass.push(...mixin);
                else row.tdClass = mixin;
                if (row.thClass)
                    row.thClass.push(...mixin);
                else row.thClass = mixin;
                return row;
            });
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