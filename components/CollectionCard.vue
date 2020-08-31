<template>
  <b-card no-body :name="collection.slug">
    <b-card-header header-tag="header" class="p-1" role="tab">
      <b-button v-b-toggle="collection.slug" block variant="info">
        {{ collection.name }}
      </b-button>
    </b-card-header>
    <b-collapse :id="collection.slug" accordion="my-accordion" role="tabpanel">
      <b-card-body>
        <b-button-toolbar justify>
          <b-button-group size="sm" class="flex-wrap">
            <b-button variant="primary" @click="() =>collectionSetIds(collection)">
              {{ $t('collectionCard.copySetIds') }}
            </b-button>
            <b-button variant="info" @click="() =>collectionSetLinks(collection)">
              {{ $t('collectionCard.copySetLinks') }}
            </b-button>
            <b-button variant="warning" @click="() =>collectionBeatmapIds(collection)">
              {{ $t('collectionCard.copyBeatmapIds') }}
            </b-button>
            <b-button variant="danger" @click="() =>collectionBeatmapLinks(collection)">
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
      <beatmapset-list-item v-for="(set) of collection.mapsets" :key="`${collection.name}-${set.id}`" :set="set" class="border-right-0 border-left-0" />
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
    }
  },
  methods: {
    songName () {
      return `${this.set.artist.name} - ${this.set.song.title}`
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
