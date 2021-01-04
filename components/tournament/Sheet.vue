<template>
  <!-- <fullscreen ref="sheet-fullscreen" :fullscreen.sync="fullscreen"> -->
  <b-table-simple
    hover
    :small="small === true ? '' : undefined"
    caption-top
    striped
    responsive
    class="m-0"
    bordered
  >
    <colgroup><col><col><col></colgroup>
    <colgroup><col><col><col><col><col><col><col></colgroup>
    <tournament-head />
    <b-tbody>
      <template v-for="(collection, collectionIndex) of collections">
        <b-th :key="`collection-title-${collection.slug}`" colspan="9" class="text-center border-left-0 border-right-0" :variant="sequenceVariant(collectionIndex)">
          {{ collection.name }} | {{ collection.mod.join(', ') }} | {{ collection.scoreType }}
        </b-th>
        <template v-for="(set) of collection.mapsets">
          <b-tr v-for="(map, mapIndex) in set.maps" :key="`collapse-${set.id}-${map.md5}`" :style="`--var-bg: url('https://assets.ppy.sh/beatmaps/${set.id}/covers/cover@2x.jpg')`">
            <b-th sticky-column class="border-left-0">
              {{ map.index }}
            </b-th>
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
              {{ map.beatmap_id > 0 ? map.beatmap_id : 'unsubmitted' }}
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
      </template>
    </b-tbody>
    <b-tfoot>
      <b-tr>
        <b-td colspan="9" variant="secondary" class="border-0 pr-2 text-right">
          Size: {{ collections.reduce((acc,cur) => acc + cur.mapsets.reduce((acc,cur) => acc + cur.maps.length ,0),0) }}
        </b-td>
      </b-tr>
    </b-tfoot>
  </b-table-simple>
  <!-- </fullscreen> -->
</template>
<script>
import TournamentHead from './TournamentTableHead'
import modHelper from '~/helpers/enum'
export default {
  components: {
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
    collections: {
      type: Array,
      default: () => []
    },
    small: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      variant: [
        'primary',
        'success',
        'warning',
        'danger',
        'info',
        'light'
      ],
      fullscreen: false
    }
  },
  methods: {
    difficultyFromMods (map, mods) {
      // const rawMod = modHelper.toEnum(map.mods)
      const raw = modHelper.toEnum(['EZ', 'HR', 'DT', 'HT'].map(difficultyAffectedMod => mods.find(m => m === difficultyAffectedMod)).filter(a => a))
      if (!map.star_rating_standard[raw]) { return '?' }
      return `${map.star_rating_standard[raw].toLocaleString('decimal', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
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
    sequenceVariant (index) {
      return this.variant[index % this.variant.length]
    }
  }
}
</script>
<style lang="scss" scoped>
.bg {
  background-color: transparent !important;
  position: relative;
  z-index: 1;

  &::before {
    content: '';
    background-image: var(--var-bg);
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    // opacity: 0.2;
    mask-image: linear-gradient(to right, rgba(0,0,0,0.46), rgba(0,0,0,0.1) 40%, rgba(0,0,0,0));
    z-index: -1;
  }
}
</style>
