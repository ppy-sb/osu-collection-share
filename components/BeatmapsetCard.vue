<template>
  <b-card no-body>
    <b-card-header>{{ songName() }}</b-card-header>
    <b-card-text>
      <b-list-group>
        <b-list-group-item v-for="map in set.maps" :key="(() => `set-${set.id}-${map.beatmap_id}`)()">
          {{ map }}
        </b-list-group-item>
      </b-list-group>
    </b-card-text>
  </b-card>
</template>
<script>
export default {
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
