<template>
  <b-container fluid="lg">
    <b-row>
      <b-col>
        <b-card v-for="(collection) of compiledCollectionData" :key="collection.name" no-body class="mb-1">
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button v-b-toggle="collection.name" block variant="info">
              {{ collection.name }}
            </b-button>
          </b-card-header>
          <b-collapse :id="collection.name" accordion="my-accordion" role="tabpanel">
            <beatmapset-card v-for="(set) of collection.mapsets" :key="`${collection.name}-${set.id}`" :set="set" />
          </b-collapse>
        </b-card>
        <b-row />
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
// import fs from 'fs'
import BeatmapsetCard from '~/components/BeatmapsetCard.vue'
export default {
  components: {
    BeatmapsetCard
  },
  asyncData () {
    if (process.server) {
      const fs = require('fs')
      const OsuDBParser = require('osu-db-parser')
      const osuDBbuffer = Buffer.from(fs.readFileSync('/Users/kousakananako/Documents/GitHub/osu-collection-share/example_data/osu!.db'))
      const collectionBuffer = Buffer.from(fs.readFileSync('/Users/kousakananako/Documents/GitHub/osu-collection-share/example_data/collection.db'))
      const ultimateDB = new OsuDBParser(osuDBbuffer, collectionBuffer)

      const osuDBData = ultimateDB.getOsuDBData()
      const osuCollectionData = ultimateDB.getCollectionData()

      // console.log(osuCollectionData)
      return { osuCollectionData, osuDBData }
    }
  },
  data () {
    return {
      compiledCollectionData: {
        type: Array,
        default: () => []
      }
    }
  },
  mounted () {
    const collections = this.osuCollectionData.collection.map((collection) => {
      return {
        name: collection.name,
        maps: collection.beatmapsMd5.map(md5 => this.findMapInOsuDB({ md5 }) || { md5, unknown: true })
      }
    })
    this.compiledCollectionData = collections.map((collection) => {
      return {
        name: collection.name,
        mapsets: this.mapListToMapsetList(collection.maps)
      }
    })
    console.log(this.compiledCollectionData)
  },
  methods: {
    findMapInOsuDB (map) {
      return this.osuDBData.beatmaps.find(beatmap => beatmap.md5 === map.md5)
    },
    mapListToMapsetList (mapset) {
      return mapset.reduce((acc, beatmap) => {
        if (beatmap.unknown) {
          console.log('unknown beatmap', beatmap.md5)
          return acc
        }
        let set = acc.find(set => set.id === beatmap.beatmapset_id)
        if (!set) {
          set = {
            id: beatmap.beatmapset_id,
            artist: {
              name: beatmap.artist_name,
              unicodeName: beatmap.artist_name_unicode
            },
            song: {
              title: beatmap.song_title,
              unicodeTitle: beatmap.song_title_unicode
            },
            thread: beatmap.thread_id,
            maps: []
          }
          acc.push(set)
        }
        set.maps.push(beatmap)
        return acc
      }, [])
    }
  }
}
</script>
