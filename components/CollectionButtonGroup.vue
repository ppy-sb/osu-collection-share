<template>
  <b-button-toolbar>
    <b-button-group size="sm" class="flex-wrap">
      <!-- <b-button variant="primary" @click="copyCollectionSummary">
        {{ $t('viewer.copySummary') }}
      </b-button>
      <b-button
        variant="light"
        @click="saveCollectionSummary"
      >
        {{ $t('viewer.summaryAsText') }}
      </b-button>
       -->
      <b-button variant="success" @click="saveCollectionDB">
        {{ $t('viewer.generateCollectionDB') }}
      </b-button>
      <b-dropdown id="collection-download-dropdown" text="Sayobot" size="sm" variant="primary">
        <b-dropdown-item @click="copyCollectionSummary">
          {{ $t('viewer.copySummary') }}
        </b-dropdown-item>
        <b-dropdown-item
          @click="saveCollectionSummary"
        >
          {{ $t('viewer.summaryAsText') }}
        </b-dropdown-item>
        <!-- <b-dropdown-item>Third Action</b-dropdown-item>
        <b-dropdown-divider />
        <b-dropdown-item active>
          Active action
        </b-dropdown-item>
        <b-dropdown-item disabled>
          Disabled action
        </b-dropdown-item> -->
      </b-dropdown>
    </b-button-group>
  </b-button-toolbar>
</template>
<script>
const FileSaver = require('file-saver')
const osuColle = require('osucolle')
export default {
  props: {
    collectionDB: { type: Object, default: () => ({ slug: '', name: 'no name' }) },
    user: { type: Object, default: () => ({ name: 'no name' }) },
    compiledCollectionData: { type: Array, default: () => [] }
  },
  methods: {
    beatmapsetLink (set) {
      return `https://osu.ppy.sh/beatmapsets/${set.id}`
    },
    beatmapLink (beatmap) {
      return `https://osu.ppy.sh/b/${beatmap.beatmap_id}`
    },
    copyCollectionSummary () {
      this.copySomething(this.collectionSummary())
    },
    saveCollectionSummary () {
      const blob = new Blob([this.collectionSummary()], { type: 'text/plain;charset=utf-8' })
      FileSaver.saveAs(blob, `collection-summary-${this.collectionDB.slug}.txt`)
    },
    collectionSummary () {
      const description = [
        `# creator: ${this.uploader.name || this.user.name}`,
        `# generated At: ${new Date()}`,
        '# ========',
        `# ${this.collectionDB.description.replace('\r', '\n').replace('\n', '\n# ')}`,
        '# ========'
      ].join('\n')
      const ids = this.compiledCollectionData.map(this.collectionSetIds).join('\n\n')
      return description + '\n\n' + ids
    },
    generateCollectionDB () {
      const db = new osuColle.Database()
      this.compiledCollectionData.map((collection) => {
        db.appendCollection(collection.name)
        collection.mapsets.map((set) => {
          set.maps.map(map => db.collection(collection.name).appendBeatmap(map.md5))
        })
      })
      return db
    },
    saveCollectionDB () {
      const db = this.generateCollectionDB()
      const buffer = db.toBuffer()
      const blob = new Blob([buffer], { type: 'application/octet-stream;charset=utf-8' })
      FileSaver.saveAs(blob, `collection-${this.collectionDB.slug}.db`)
    },
    collectionSetIds (collection) {
      return (`# ${collection.name}\n${collection.mapsets.map((set) => {
        if (set.id === -1) { return `# unsubmitted set [${set.artist.name} - ${set.song.title}]: ${set.maps.map(map => `(${map.difficulty})`)}` }
        return set.id
      }).join('\n')}`)
    },
    collectionBeatmapIds (collection) {
      return (`# ${collection.name}\n${collection.mapsets.map(set => set.maps.map(map => map.beatmap_id).join('\n')).join('\n')}`)
    },
    collectionSetLinks (collection) {
      return (`# ${collection.name}\n${collection.mapsets.map(set => this.beatmapsetLink(set)).join('\n')}`)
    },
    collectionBeatmapLinks (collection) {
      return (`# ${collection.name}\n${collection.mapsets.map(set => set.maps.map(map => this.beatmapLink(map)).join('\n')).join('\n')}`)
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
</style>
