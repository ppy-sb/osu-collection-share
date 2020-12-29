<template>
  <b-card no-body :name="collection.slug">
    <b-card-header header-tag="header" class="p-1" role="tab">
      <b-button v-b-toggle="collection.slug" block :variant="titleButtonVariant">
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
              <b-button variant="primary" @click="() =>collectionSetIds()">
                {{ $t('collectionCard.copySetIds') }}
              </b-button>
              <b-button variant="info" @click="() =>collectionSetLinks()">
                {{ $t('collectionCard.copySetLinks') }}
              </b-button>
              <b-button variant="warning" @click="() =>collectionBeatmapIds()">
                {{ $t('collectionCard.copyBeatmapIds') }}
              </b-button>
              <b-button variant="danger" @click="() =>collectionBeatmapLinks()">
                {{ $t('collectionCard.copyBeatmapLinks') }}
              </b-button>
            </b-button-group>
            <b-button-group size="sm">
              <b-button variant="dark" @click="() =>copySomething(JSON.stringify(collection))">
                copy as JSON Format
              </b-button>
            </b-button-group>
          </b-button-toolbar>
        </b-card-body>
      </slot>
      <slot name="list">
        <b-list-group v-if="!tournament">
          <beatmapset-list-item v-for="(set) of collection.mapsets" :key="`${collection.name}-${set.id}`" :set="set" class="border-right-0 border-left-0" />
        </b-list-group>

        <b-table-simple
          v-else
          hover
          small
          caption-top
          striped
          responsive
          bordered
        >
          <!-- <b-list-group-item v-for="(map) in set.maps" :key="`collapse-${set.id}-${map.md5}`">
      {{ map.difficulty }}
    </b-list-group-item> -->
          <!-- <caption>Items sold in August, grouped by Country and City:</caption> -->
          <colgroup><col><col><col></colgroup>
          <colgroup><col><col><col><col></colgroup>
          <b-thead>
            <b-tr>
              <b-th colspan="3">
                Beatmap
              </b-th>
              <b-th colspan="4">
                Info
              </b-th>
            </b-tr>
            <b-tr>
              <b-th style="width:1px">
                #
              </b-th>
              <b-th
                style=""
                class="text-right"
              >
                Beatmapset
              </b-th>
              <b-th
                style=""
              >
                Version
              </b-th>
              <b-th class="text-right">
                bid
              </b-th>
              <b-th class="text-right">
                Star
              </b-th>
              <b-th class="text-right">
                Duration
              </b-th>
              <!-- <b-th>Rings</b-th> -->
            </b-tr>
          </b-thead>
          <b-tbody>
            <template v-for="(set, setIndex) of collection.mapsets.slice((tournamentMode.currentPage - 1) * 10, tournamentMode.currentPage * 10)">
              <b-tr v-for="(map, mapIndex) in set.maps" :key="`collapse-${set.id}-${map.md5}`">
                <b-td :variant="edit ? map.indexStatus ? 'success' : 'danger' : ''">
                  <!-- {{ { setIndex, mapIndex, index: map.index } }} -->
                  <b-form-input
                    v-if="edit"
                    size="sm"
                    style="width:50px"
                    type="number"
                    :value="map.index"
                    @change="(value) => $emit('updateIndex',{ setIndex, mapIndex, value })"
                  />
                  <template v-else>
                    {{ map.index }}
                  </template>
                </b-td>
                <b-th v-if="!mapIndex" :rowspan="set.maps.length" style="max-width:150px" class="text-right">
                  {{ songName(set) }}
                </b-th>
                <b-th style="max-width:150px">
                  {{ map.difficulty }}
                </b-th>
                <b-td class="text-right">
                  {{ map.beatmap_id > 0 ? map.beatmap_id : 'unsubmitted' }}
                </b-td>
                <b-td class="text-right">
                  {{ difficultyFromMods(map) }}
                </b-td>
                <b-td class="text-right">
                  {{ map.drain_time }}s
                </b-td>
              </b-tr>
            </template>
          </b-tbody>
          <b-tfoot v-if="collection.mapsets.length > tournamentMode.perPage">
            <b-tr>
              <b-td colspan="7" variant="secondary">
                <base-pagination v-model="tournamentMode.currentPage" align="center" :per-page="tournamentMode.perPage" :total="collection.mapsets.length" />
                <!-- Total Rows: <b>5</b> -->
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

export default {
  components: {
    BeatmapsetListItem
    // SyncLoader
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
      tournamentMode: {
        currentPage: 1,
        perPage: 10
      }
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
      this.copySomething(`# ${this.collection.name}\n${this.collection.mapsets.map(set => set.id).join('\n')}`)
    },
    collectionBeatmapIds () {
      this.copySomething(`# ${this.collection.name}\n${this.collection.mapsets.map(set => set.maps.map(map => map.beatmap_id).join('\n')).join('\n')}`)
    },
    collectionSetLinks () {
      this.copySomething(`# ${this.collection.name}\n${this.collection.mapsets.map(set => this.beatmapsetLink(set)).join('\n')}`)
    },
    collectionBeatmapLinks () {
      this.copySomething(`# ${this.collection.name}\n${this.collection.mapsets.map(set => set.maps.map(map => this.beatmapLink(map)).join('\n')).join('\n')}`)
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
table.table-fit thead th, table.table-fit tfoot th {
    width: auto !important;
}
table.table-fit tbody td, table.table-fit tfoot td {
    width: auto !important;
}
</style>
