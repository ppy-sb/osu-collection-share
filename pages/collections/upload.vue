<template>
  <profile-layout>
    <top-section-layout>
      <card shadow class="card-profile mt--300">
        <b-card-text>
          osu.db are only used for referencing the map in your collection.db and will not be uploaded!
          thus we may collect some data to improve other user's experirence such as your local offset
        </b-card-text>
        <b-form-group
          label-cols-sm="3"
          label="collections name:"
          label-align-sm="right"
          label-for="collectionName"
          :description="collection.slug"
        >
          <b-form-input id="collectionName" v-model="collection.name" placeholder="my collections" />
        </b-form-group>
        <b-form-group
          label-cols-sm="3"
          label="collections.db:"
          label-align-sm="right"
          label-for="collectionDB"
        >
          <b-form-file
            id="collectionDB"
            v-model="collectionDB"
            :state="Boolean(collectionDB)"
            placeholder="Choose collection.db in your osu folder or drop it here..."
            drop-placeholder="Drop file here..."
            :description="collectionDB"
          />
        </b-form-group>
        <b-form-group
          label-cols-sm="3"
          label="osu.db:"
          label-align-sm="right"
          label-for="osuDB"
        >
          <b-form-file
            id="osuDB"
            v-model="osuDB"
            :state="Boolean(osuDB)"
            placeholder="Choose osu.db in your osu folder  or drop it here..."
            drop-placeholder="Drop file here..."
          />
        </b-form-group>
        <b-button-group>
          <b-button :variant="osuCollectionData ? 'success' : 'primary'" @click="readData">
            parse
          </b-button>
          <b-button v-if="osuCollectionData" :variant="compiledCollectionData.length ? 'success' : 'primary'" @click="compileData">
            compile
          </b-button>
          <b-button v-if="compiledCollectionData.length" variant="primary" @click="upload">
            upload
          </b-button>
        </b-button-group>
      </card>
    </top-section-layout>
    <section-layout
      :contained="undefined"
      bg-variant="warning"
      skew
      shaped
      last
    >
      <card shadow>
        <b-form-checkbox
          v-model="onlyShowUploading"
        >
          only show uploading collections
        </b-form-checkbox>
      </card>
      <card
        v-for="(c) of uploadingCollections"
        :key="c.id"
        shadow
        no-body
        class="mb-1"
        :name="c.id"
      >
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-button v-b-toggle="c.id" block variant="primary">
            {{ c.name }}
          </b-button>
        </b-card-header>
        <b-collapse :id="c.id" accordion="my-accordion" role="tabpanel">
          <b-button-toolbar justify>
            <b-button-group>
              <b-button variant="primary" @click="() =>collectionSetIds(c)">
                copy all set's id
              </b-button>
              <b-button variant="info" @click="() =>collectionSetLinks(c)">
                copy all set's link
              </b-button>
              <b-button variant="warning" @click="() =>collectionBeatmapIds(c)">
                copy all map's id
              </b-button>
              <b-button variant="danger" @click="() =>collectionBeatmapLinks(c)">
                copy all map's link
              </b-button>
            </b-button-group>
            <b-button-group>
              <b-button variant="dark" @click="() =>copySomething(JSON.stringify(c))">
                copy as JSON Format
              </b-button>
            </b-button-group>
          </b-button-toolbar>
          <b-form-checkbox
            :id="`${c.name}-upload`"
            v-model="c.upload"
          >
            upload
          </b-form-checkbox>
          <beatmapset-list-item v-for="(set) of c.mapsets" :key="`${c.name}-${set.id}`" :set="set" />
        </b-collapse>
      </card>
    </section-layout>
  </profile-layout>
</template>
<script>
import axios from 'axios'
// import BeatmapsetCard from '@/components/BeatmapsetCard'
import BeatmapsetListItem from '@/components/components/BeatmapsetListItem'
// import RecentCard from '@/components/sb-components/RecentCard'
import SectionLayout from '@/components/sb-layouts/components/SectionLayout'
import TopSectionLayout from '@/components/sb-layouts/components/TopSectionLayout'
import ProfileLayout from '@/components/sb-layouts/ProfileLayout'
const debounce = require('lodash.debounce')
const OsuDBParser = require('osu-db-parser')
export default {
  components: {
    BeatmapsetListItem,
    SectionLayout,
    ProfileLayout,
    TopSectionLayout
  },
  data () {
    return {
      username: 'Unknown',
      collection: {
        name: '',
        slug: ''
      },
      compiledCollectionData: [],
      collectionDB: undefined,
      collectionDBBuffer: undefined,
      osuDB: undefined,
      osuDBBuffer: undefined,
      osuCollectionData: undefined,
      osuDBData: undefined,
      uploadResult: undefined,
      onlyShowUploading: false
    }
  },
  computed: {
    uploadingCollections () {
      if (this.onlyShowUploading) { return this.compiledCollectionData.filter(collection => collection.upload) }
      return this.compiledCollectionData
    }
  },
  watch: {
    'collection.name': debounce(async function (newVal) {
      const result = await this.convSlugApi(newVal)
      if (result.sameCollectionsDBExists) {
        this.collection.slug = result.nextAvailable
        // this.collection.description = this.collection.slug
      } else {
        this.collection.slug = result.slug
        // this.collection.description = `will be created as ${this.collection.slug}`
      }
    }, 300),
    async collectionDB (file) {
      this.collectionDBBuffer = await this.readUploadedFileAsBuffer(file)
    },
    async osuDB (file) {
      this.osuDBBuffer = await this.readUploadedFileAsBuffer(file)
      console.log('done')
    }
  },
  mounted () {

  },
  methods: {
    readUploadedFileAsBuffer (inputFile) {
      const temporaryFileReader = new FileReader()

      return new Promise((resolve, reject) => {
        temporaryFileReader.onerror = () => {
          temporaryFileReader.abort()
          reject(new DOMException('Problem parsing input file.'))
        }

        temporaryFileReader.onload = () => {
          resolve(temporaryFileReader.result)
        }
        temporaryFileReader.readAsArrayBuffer(inputFile)
      })
    },
    readData () {
      if (!this.osuDBBuffer || !this.collectionDBBuffer) {
        return console.log('sth went wrong')
      }

      const ultimateDB = new OsuDBParser(this.osuDBBuffer, this.collectionDBBuffer)

      this.osuDBData = ultimateDB.getOsuDBData()
      this.osuCollectionData = ultimateDB.getCollectionData()
      // console.log({ osuCollectionData, osuDBData })
      this.username = this.osuDBData.username
      if (this.collection.name === '') { this.collection.name = `${this.osuDBData.username}'s collection` }
    },
    compileData () {
      const collections = this.osuCollectionData.collection.map((collection) => {
        return {
          name: collection.name,
          id: collection.name.replace(' ', '_'),
          maps: collection.beatmapsMd5.map(md5 => this.findMapInOsuDB({ md5 }) || { md5, unknown: true })
        }
      }).filter(collection => collection.maps.length)
      this.compiledCollectionData = collections.map((collection) => {
        return {
          name: collection.name,
          id: collection.id,
          mapsets: this.mapListToMapsetList(collection.maps).sort((a, b) => a.beatmap_id - b.beatmap_id),
          upload: true
        }
      })
      console.log(this.compiledCollectionData)
    },
    upload () {
      axios.post('/api/collectionDB/upload', {
        collectionDB: {
          name: this.collection.name,
          slug: this.collection.slug
        },
        user: {
          name: this.username
        },
        compiledCollectionData: this.compiledCollectionData
      }).then((res) => { this.uploadResult = res.data }).catch(err => console.warn(err))
    },
    convert () {
      const collections = this.osuCollectionData.collection.map((collection) => {
        return {
          name: collection.name,
          id: collection.name.replace(' ', '_'),
          maps: collection.beatmapsMd5.map(md5 => this.findMapInOsuDB({ md5 }) || { md5, unknown: true })
        }
      }).filter(collection => collection.maps.length)
      this.compiledCollectionData = collections.map((collection) => {
        return {
          name: collection.name,
          id: collection.id,
          mapsets: this.mapListToMapsetList(collection.maps).sort((a, b) => a.beatmap_id - b.beatmap_id)
        }
      })
      console.log(this.compiledCollectionData)
    },
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
    },
    beatmapsetLink (set) {
      return `https://osu.ppy.sh/beatmapsets/${set.id}`
    },
    beatmapLink (beatmap) {
      return `https://osu.ppy.sh/b/${beatmap.beatmap_id}`
    },
    collectionSetIds (collection) {
      this.copySomething(`${collection.name}\n${collection.mapsets.map(set => set.id).join('\n')}`)
    },
    collectionBeatmapIds (collection) {
      this.copySomething(`${collection.name}\n${collection.mapsets.map(set => set.maps.map(map => map.beatmap_id).join('\n')).join('\n')}`)
    },
    collectionSetLinks (collection) {
      this.copySomething(`${collection.name}\n${collection.mapsets.map(set => this.beatmapsetLink(set)).join('\n')}`)
    },
    collectionBeatmapLinks (collection) {
      this.copySomething(`${collection.name}\n${collection.mapsets.map(set => set.maps.map(map => this.beatmapLink(map)).join('\n')).join('\n')}`)
    },
    async copySomething (text) {
      try {
        await this.$copyText(text)
      } catch (e) {
        console.error(e)
      }
    },
    async convSlugApi (name) {
      return await axios.get('/api/slug/' + name).then(res => res.data)
    }
  }
}
</script>
<style>
.hover-big-shadow::before {
  content: "";
  height: 100%;
  width: 100%;
  /* display: inline-block; */
  position: absolute;
  background-image: linear-gradient(
    -90deg,
    #d077f3 0%,
    #009bff 47%,
    #2ac9db 100%
  );
  opacity: 0;
  border-radius: 100px;
  filter: blur(5em);
  z-index: -1;
  transition: all 0.15s ease;
}
.hover-big-shadow:hover::before {
  content: "";
  opacity: 0.3;
  transition: all 0.15s ease;
}
</style>
