<template>
  <beatmap-list-card :set="set">
    <template v-slot:header>
      <h4>{{ songName() }}</h4>
    </template>
  </beatmap-list-card>
</template>

<script>
import BeatmapListCard from './components/BeatmapListCard.vue'

export default {
  components: {
    BeatmapListCard
    // SyncLoader
  },
  props: {
    set: {
      type: Object,
      default: () => ({
        id: -1,
        artist: {
          name: 'Unknown',
          unicodeName: 'Unknown'
        },
        song: {
          title: 'Unknown',
          unicodeTitle: 'unknown'
        },
        maps: []
      })
    }
  },
  methods: {
    songName () {
      return `${this.set.artist.name} - ${this.set.song.title}`
    }
  }
}
</script>
