<template>
  <b-card no-body :name="collection.slug" class="my-2 border-0 shadow">
    <b-card-header header-tag="header" class="rounded p-0" role="tab">
      <b-button
        v-b-toggle="collection.slug"
        block
        :variant="titleButtonVariant"
      >
        <slot name="title">
          {{ collection.name }}
        </slot>
      </b-button>
    </b-card-header>
    <b-collapse :id="collection.slug" accordion="my-accordion" role="tabpanel">
      <slot name="heading">
        <b-card-body class="py-2">
          <b-button-toolbar justify>
            <b-button-group size="sm" class="flex-wrap">
              <!-- <b-button variant="primary" @click="() => copyCollectionSetIds()">
                {{ $t("collectionCard.setIds") }}
              </b-button>
              <b-button variant="info" @click="() => copyCollectionSetLinks()">
                {{ $t("collcollectionCard.setLinks}
              </b-button>
              <b-button variant="warning" @click="() => copyCollectionBeatmapIds()">
                {{ $t("collectionCard.copy.beatmapIds") }}
              </b-button>
              <b-button
                variant="danger"
                @click="() => copyCollectionBeatmapLinks()"
              >
                {{ $t(collectionCard.copy.beatmapLinkss") }}
              </b-button> -->
              <b-dropdown :text="$t('collectionCard.copy')" size="sm" variant="primary">
                <b-dropdown-item @click="() => copyCollectionSetIds()">
                  {{ $t("collectionCard.setIds") }}
                </b-dropdown-item>
                <b-dropdown-item @click="() => copyCollectionSetLinks()">
                  {{ $t("collectionCard.setLinks") }}
                </b-dropdown-item>
                <b-dropdown-item @click="() => copyCollectionBeatmapIds()">
                  {{ $t("collectionCard.beatmapIds") }}
                </b-dropdown-item>
                <b-dropdown-item @click="() => copyCollectionBeatmapLinks()">
                  {{ $t("collectionCard.beatmapLinksks") }}
                </b-dropdown-item>
              </b-dropdown>
              <b-button variant="success" @click="() => toDownload()">
                {{ $t("collectionCard.downloadSet") }}
              </b-button>
            </b-button-group>
          </b-button-toolbar>
        </b-card-body>
      </slot>
      <slot name="list">
        <template v-if="!tournament">
          <keep-alive>
            <b-list-group>
              <template v-for="(set, index) of collection.mapsets">
                <keep-alive :key="`${collection.name}-${set.id}`">
                  <beatmapset-list-item
                    v-if="
                      index >= (currentPage - 1) * perPage &&
                        index < currentPage * perPage
                    "
                    :key="`${collection.name}-${set.id}`"
                    :set="set"
                    class="border-right-0 border-left-0"
                  />
                </keep-alive>
              </template>
            </b-list-group>
          </keep-alive>
          <base-pagination
            v-if="collection.mapsets.length > perPage"
            v-model="currentPage"
            align="center"
            :per-page="perPage"
            :total="collection.mapsets.length"
            class="pt-2"
          />
        </template>

        <b-table-simple
          v-else
          hover
          small
          caption-top
          striped
          responsive
          bordered
        >
          <tournament-head />
          <b-tbody>
            <template
              v-for="(set, setIndex) of collection.mapsets.slice(
                (currentPage - 1) * perPage,
                currentPage * perPage
              )"
            >
              <b-tr
                v-for="(map, mapIndex) in set.maps"
                :key="`collapse-${set.id}-${map.md5}`"
                :style="`--var-bg: url('https://assets.ppy.sh/beatmaps/${set.id}/covers/cover@2x.jpg')`"
              >
                <b-td
                  :variant="
                    edit ? (map.indexStatus ? 'success' : 'danger') : ''
                  "
                >
                  <b-form-input
                    v-if="edit"
                    size="sm"
                    style="width: 50px"
                    type="number"
                    :value="map.index"
                    @change="
                      (value) =>
                        $emit('updateIndex', {
                          setIndex: setIndex + (currentPage - 1) * perPage,
                          mapIndex,
                          value,
                        })
                    "
                  />
                  <template v-else>
                    {{ map.index }}
                  </template>
                </b-td>
                <b-th
                  v-if="!mapIndex"
                  :rowspan="set.maps.length"
                  class="text-right bg"
                >
                  <a :href="beatmapsetLink(set)">{{ songName(set) }}</a>
                </b-th>
                <b-th>
                  <a :href="beatmapLink(map)">{{ map.difficulty }}</a>
                </b-th>
                <b-td class="text-right">
                  {{ map.beatmap_id > 0 ? map.beatmap_id : "unsubmitted" }}
                </b-td>
                <b-td class="text-right">
                  ★{{ difficultyFromMods(map, collection.mod) }}
                </b-td>
                <b-td class="text-right">
                  {{ map.circle_size | fractionDigits1 }}
                </b-td>
                <b-td class="text-right">
                  {{ map.approach_rate | fractionDigits1 }}
                </b-td>
                <b-td class="text-right">
                  {{ map.overall_difficulty | fractionDigits1 }}
                </b-td>
                <b-td class="text-right border-right-0">
                  {{ map.drain_time }}s
                </b-td>
              </b-tr>
            </template>
          </b-tbody>
          <b-tfoot v-if="collection.mapsets.length > perPage">
            <b-tr>
              <b-td colspan="7" variant="secondary">
                <base-pagination
                  v-model="currentPage"
                  align="center"
                  :per-page="perPage"
                  :total="collection.mapsets.length"
                />
              </b-td>
            </b-tr>
          </b-tfoot>
        </b-table-simple>
      </slot>
      <slot name="footing" />
    </b-collapse>
  </b-card>
</template>

<script>
import BeatmapsetListItem from '@/components/sb-components/BeatmapsetListItem'
import TournamentHead from './tournament/TournamentTableHead'
export default {
  components: {
    BeatmapsetListItem,
    TournamentHead
  },
  filters: {
    fractionDigits2 (num) {
      return num.toLocaleString('decimal', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    },
    fractionDigits1 (num) {
      return num.toLocaleString('decimal', { minimumFractionDigits: 0, maximumFractionDigits: 1 })
    }
  },
  props: {
    collection: {
      type: Object,
      default: () => ({
        name: 'Collection',
        slug: '',
        description: '',
        mapsets: []
      })
    },
    titleButtonVariant: {
      type: String,
      default: 'default'
    },
    tournament: {
      type: Boolean,
      default: false
    },
    mod: {
      type: Array,
      default: () => []
    },
    edit: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      currentPage: 1,
      perPage: 10
    }
  },
  methods: {
    difficultyFromMods (map) {
      if (!map.star_rating_standard[0]) { return '?' }
      return `${map.star_rating_standard[0].toLocaleString('decimal', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    },
    songName (set) {
      return `${set.artist.unicodeName || set.artist.name} - ${set.song.unicodeTitle || set.song.title}`
    },
    beatmapsetLink (set) {
      return `https://osu.ppy.sh/beatmapsets/${set.id}`
    },
    beatmapLink (beatmap) {
      return `https://osu.ppy.sh/b/${beatmap.beatmap_id}`
    },
    collectionSetIds () {
      return `# ${this.collection.name}\n${this.collection.mapsets.map(set => set.id).join('\n')}`
    },
    copyCollectionSetIds () {
      this.copySomething(this.collectionSetIds())
    },
    copyCollectionBeatmapIds () {
      this.copySomething(`# ${this.collection.name}\n${this.collection.mapsets.map(set => set.maps.map(map => map.beatmap_id).join('\n')).join('\n')}`)
    },
    copyCollectionSetLinks () {
      this.copySomething(`# ${this.collection.name}\n${this.collection.mapsets.map(set => this.beatmapsetLink(set)).join('\n')}`)
    },
    copyCollectionBeatmapLinks () {
      this.copySomething(`# ${this.collection.name}\n${this.collection.mapsets.map(set => set.maps.map(map => this.beatmapLink(map)).join('\n')).join('\n')}`)
    },
    toDownload () {
      const sid = this.collection.mapsets.map(set => set.id > 0 ? set.id : `# ${set.artist.name} - ${set.song.title} (unable to find set ID)`)
      const prefix = this.collection.name
      this.$router.push(this.localeLocation({ name: 'download', query: { sid, prefix } }))
    },
    async copySomething (text) {
      try {
        await this.$copyText(text)
      } catch (e) {
        console.error(e)
      }
    }
  }
}
</script>
<style>
table.table-fit {
  width: auto !important;
  table-layout: auto !important;
}
table.table-fit thead th,
table.table-fit tfoot th {
  width: auto !important;
}
table.table-fit tbody td,
table.table-fit tfoot td {
  width: auto !important;
}
</style>
<style lang="scss" scoped>
.bg {
  background-color: transparent !important;
  position: relative;
  z-index: 1;

  &::before {
    content: "";
    background-image: var(--var-bg);
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    // opacity: 0.2;
    mask-image: linear-gradient(
      to right,
      rgba(0, 0, 0, 0.46),
      rgba(0, 0, 0, 0.1) 40%,
      rgba(0, 0, 0, 0)
    );
    z-index: -1;
  }
}
</style>
