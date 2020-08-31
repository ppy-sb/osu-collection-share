<template>
  <profile-layout>
    <top-section-layout>
      <b-overlay
        :show="onJob"
        rounded
        spinner
        opacity="0.6"
        spinner-variant="primary"
      >
        <card shadow class="card-profile mt--300">
          <b-card-text>
            {{ $t('upload.disclaimer') }}
          </b-card-text>
          <b-form-group
            label-cols-sm="3"
            :label="$t('upload.form.label.collectionName')"
            label-align-sm="right"
            label-for="collectionName"
            :description="collection.slug"
          >
            <b-form-input id="collectionName" v-model="collection.name" :placeholder="$t('upload.form.placeholder.myCollection')" />
          </b-form-group>
          <b-form-group
            label-cols-sm="3"
            :label="$t('upload.form.label.collectionDB')"
            label-align-sm="right"
            label-for="collectionDB"
          >
            <b-form-file
              id="collectionDB"
              v-model="collectionDB"
              :state="Boolean(collectionDB)"
              :placeholder="$t('upload.form.placeholder.collectionDB')"
              :drop-placeholder="$t('upload.form.placeholder.dropFile')"
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
              :placeholder="$t('upload.form.placeholder.osuDB')"
              :drop-placeholder="$t('upload.form.placeholder.dropFile')"
            />
          </b-form-group>
          <b-form-group
            label-cols-sm="3"
            :label="$t('upload.form.label.collectionDescription')"
            label-align-sm="right"
            label-for="description"
          >
            <b-form-textarea
              id="description"
              v-model="collection.description"
              :placeholder="$t('upload.form.placeholder.descriptionPlaceholder')"
              rows="3"
              max-rows="6"
            />
          </b-form-group>
          <b-button-group>
            <b-button :variant="osuCollectionData ? 'success' : 'primary'" @click="readData">
              {{ $t('upload.parse') }}
            </b-button>
            <b-button v-if="osuCollectionData" :variant="compiledCollectionData.length ? 'success' : 'primary'" @click="compileData">
              {{ $t('upload.compile') }}
            </b-button>
            <b-button v-if="compiledCollectionData.length" variant="primary" @click="upload">
              {{ $t('upload.upload') }}
            </b-button>
          </b-button-group>
        </card>
      </b-overlay>
    </top-section-layout>
    <section-layout
      :contained="undefined"
      bg-variant="warning"
      skew
      shaped
      last
    >
      <card shadow no-body>
        <b-card-body>
          <b-card-text>
            <b-form-checkbox
              v-show="!uploadResult"
              v-model="onlyShowUploading"
            >
              {{ $t('upload.onlyShowUploadingCollections') }}
            </b-form-checkbox>
            <div v-if="uploadResult">
              <b-card-title>
                {{ $t('upload.done') }}
              </b-card-title>
              <b-card-text>
                <nuxt-link :to="`/collections/${uploadResult.collectionDB.slug}`">
                  {{ $t('upload.collectionLink') }}
                </nuxt-link>
              </b-card-text>
            </div>
          </b-card-text>
        </b-card-body>
        <b-card
          v-for="(c) of uploadingCollections"
          :key="c.id"
          no-body
          class="mb-1"
          :name="c.id"
        >
          <b-card-header header-tag="header" class="p-1" role="tab">
            <b-button v-b-toggle="c.id" block variant="info">
              {{ c.name }}
            </b-button>
          </b-card-header>
          <b-collapse :id="c.id" accordion="my-accordion" role="tabpanel">
            <b-card-body>
              <b-form-checkbox
                :id="`${c.name}-upload`"
                v-model="c.upload"
              >
                {{ $t('upload') }}
              </b-form-checkbox>
            </b-card-body>
            <beatmapset-list-item v-for="(set) of c.mapsets" :key="`${c.name}-${set.id}`" :set="set" class="border-right-0 border-left-0" />
          </b-collapse>
        </b-card>
      </card>
    </section-layout>
  </profile-layout>
</template>
<script>
import axios from 'axios'
// import BeatmapsetCard from '@/components/BeatmapsetCard'
import BeatmapsetListItem from '@/components/sb-components/BeatmapsetListItem'
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
      onJob: false,
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
      this.onJob = true
      if (!this.osuDBBuffer || !this.collectionDBBuffer) { return console.log('sth went wrong') }

      const ultimateDB = new OsuDBParser(this.osuDBBuffer, this.collectionDBBuffer)

      this.osuDBData = ultimateDB.getOsuDBData()
      this.osuCollectionData = ultimateDB.getCollectionData()
      this.username = this.osuDBData.username
      if (this.collection.name === '') { this.collection.name = `${this.osuDBData.username}'s collection` }
      this.onJob = false
    },
    async compileData () {
      this.onJob = true
      this.compiledCollectionData = await this.$worker.run((osuDBData, osuCollectionData) => {
        function mapListToMapsetList (mapset) {
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

        const collections = osuCollectionData.collection.map((collection) => {
          return {
            name: collection.name,
            id: collection.name.replace(' ', '_'),
            maps: collection.beatmapsMd5.map(md5 => osuDBData.beatmaps.find(beatmap => beatmap.md5 === md5) || { md5, unknown: true })
          }
        }).filter(collection => collection.maps.length)
        return collections.map((collection) => {
          return {
            name: collection.name,
            id: collection.id,
            mapsets: mapListToMapsetList(collection.maps),
            upload: true
          }
        })
      }, [this.osuDBData, this.osuCollectionData])
      this.onJob = false
    },
    upload () {
      this.onJob = true
      axios.post('/api/collectionDB/upload', {
        collectionDB: {
          name: this.collection.name,
          slug: this.collection.slug,
          description: this.collection.description
        },
        user: {
          name: this.username
        },
        compiledCollectionData: this.uploadingCollections
      }).then((res) => { this.uploadResult = res.data }).catch(err => console.warn(err)).then(() => { this.onJob = false })
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
