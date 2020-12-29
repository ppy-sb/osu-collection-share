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
            :description="notices.describeSlug"
          >
            <b-form-input id="collectionName" v-model="collection.name" :placeholder="$t('upload.form.placeholder.myCollection')" debounce="300" />
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
            <b-form-checkbox
              v-show="!uploadResult"
              v-model="isTournamentPool"
            >
              {{ $t('upload.isTournamentPool') }}
            </b-form-checkbox>
            <b-button-toolbar class="pt-2">
              <b-button-group size="sm">
                <b-button variant="info" @click="() => compiledCollectionData.map(c => c.upload = true)">
                  {{ $t('upload.checkAll') }}
                </b-button>
                <b-button variant="success" @click="() => compiledCollectionData.map(c => c.upload = false)">
                  {{ $t('upload.uncheckAll') }}
                </b-button>
              </b-button-group>
            </b-button-toolbar>
            <div v-if="uploadResult">
              <b-card-title>
                {{ $t('upload.done') }}
              </b-card-title>
              <b-card-text>
                <nuxt-link :to="{name: 'collections-slug', params:{ slug: uploadResult.collectionDB.slug }}">
                  {{ $t('upload.collectionLink') }}
                </nuxt-link>
              </b-card-text>
            </div>
          </b-card-text>
        </b-card-body>
        <collection-section
          v-for="(c) of compiledCollectionData"
          v-show="c.upload || !onlyShowUploading"
          :key="`collection-${c.slug}`"
          style="border: 0"
          :collection="c"
          :title-button-variant="c.upload ? 'success' :'danger'"
          :edit="true"
          :tournament="isTournamentPool"
          :mod="c.mod || []"
          @updateIndex="(result) => updateIndex(c, result)"
        >
          <template #heading>
            <b-card-body>
              <b-form-group
                label="Upload Collection"
                :label-for="`collection-${c.slug}-upload`"
                label-cols="3"
              >
                <b-form-checkbox
                  :id="`collection-${c.slug}-upload`"
                  v-model="c.upload"
                  class="pt-2"
                >
                  {{ $t('upload.upload') }}
                </b-form-checkbox>
              </b-form-group>
              <div v-if="isTournamentPool">
                <b-form-group
                  label="Mod"
                  :label-for="`collection-${c.slug}-mod`"
                  label-cols="3"
                  :state="c.modstate"
                  invalid-feedback="This field is required"
                >
                  <b-form-checkbox-group
                    :id="`collection-${c.slug}-mod`"
                    v-model="c.mod"
                    class="pt-2"
                    :state="c.modState"
                    :options="existMods"
                  />
                </b-form-group>
                <b-form-group
                  label="Scoring"
                  :label-for="`collection-${c.slug}-scoring`"
                  label-cols="3"
                  :state="c.scoreState"
                  invalid-feedback="This field is required"
                >
                  <b-form-radio-group
                    :id="`collection-${c.slug}-scoring`"
                    v-model="c.scoreType"
                    class="pt-2"
                    :state="c.scoreState"
                    :options="existScoreType"
                  />
                </b-form-group>
              </div>
            </b-card-body>
          </template>
        </collection-section>
        <!-- <b-card
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
                {{ $t('upload.upload') }}
              </b-form-checkbox>
            </b-card-body>
            <beatmapset-list-item v-for="(set) of c.mapsets" :key="`${c.name}-${set.id}`" :set="set" class="border-right-0 border-left-0" />
          </b-collapse>
        </b-card> -->
      </card>
    </section-layout>
  </profile-layout>
</template>
<script>
import axios from 'axios'
// import BeatmapsetCard from '@/components/BeatmapsetCard'
// import BeatmapsetListItem from '@/components/sb-components/BeatmapsetListItem'
// import RecentCard from '@/components/sb-components/RecentCard'
import SectionLayout from '@/components/sb-layouts/components/SectionLayout'
import TopSectionLayout from '@/components/sb-layouts/components/TopSectionLayout'
import ProfileLayout from '@/components/sb-layouts/ProfileLayout'

import CollectionSection from '@/components/CollectionSection'
// const OsuDBParser = require('osu-db-parser')
// const OsuDBParserWorker = require('@/assets/scripts/parseDB.worker.js')
import OsuDBParserWorker from '@/assets/scripts/parseDB.worker.js'
// const debounce = require('lodash.debounce')
export default {
  components: {
    // BeatmapsetListItem,
    SectionLayout,
    ProfileLayout,
    TopSectionLayout,
    CollectionSection
  },
  data () {
    return {
      username: 'Unknown',
      onJob: false,
      collection: {
        name: '',
        slug: ''
      },
      notices: {
        describeSlug: ''
      },
      existMods: [
        'NM',
        'EZ',
        'NF',
        'HT',
        'HR',
        'DT',
        'NC',
        'HD',
        'FL',
        'FM',
        'RX',
        'TB'
      ],
      existScoreType: [
        'Score',
        'ScoveV2',
        'Accuracy'
      ],
      compiledCollectionData: [],
      collectionDB: undefined,
      collectionDBBuffer: undefined,
      osuDB: undefined,
      osuDBBuffer: undefined,
      osuCollectionData: undefined,
      osuDBData: undefined,
      uploadResult: undefined,
      onlyShowUploading: false,
      isTournamentPool: false
    }
  },
  computed: {
    uploadingCollections () {
      return this.compiledCollectionData.filter(collection => collection.upload)
    }
  },
  watch: {
    async 'collection.name' (newVal) {
      const result = await this.convSlugApi(newVal)
      if (result.sameCollectionDBExists) {
        this.collection.slug = result.nextAvailable
        this.notices.describeSlug = `will be created as ${this.collection.slug}`
      } else {
        this.collection.slug = result.slug
        this.notices.describeSlug = this.collection.slug
      }
    },
    async collectionDB (file) {
      this.collectionDBBuffer = await this.readUploadedFileAsBuffer(file)
    },
    async osuDB (file) {
      this.osuDBBuffer = await this.readUploadedFileAsBuffer(file)
    }
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
    async readData () {
      this.onJob = true
      if (!this.osuDBBuffer || !this.collectionDBBuffer) { return console.log('sth went wrong') }

      // const { osuDBData, osuCollectionData } =
      const worker = new OsuDBParserWorker()
      const resultPromise = new Promise((resolve, reject) => {
        worker.onmessage = result => resolve(result.data)
      })
      worker.postMessage({ osuDBBuffer: this.osuDBBuffer, collectionDBBuffer: this.collectionDBBuffer })

      const { osuDBData, osuCollectionData } = await resultPromise
      worker.terminate()

      this.osuDBData = osuDBData
      this.osuCollectionData = osuCollectionData
      this.username = this.osuDBData.username

      if (this.collection.name === '') { this.collection.name = `${this.osuDBData.username}'s collection` }
      this.onJob = false
    },

    async compileData () {
      this.onJob = true
      this.compiledCollectionData = await this.$worker.run((osuDBData, osuCollectionData) => {
        function setIdGuessFromFolderName (name) {
          name = name.split(' ')
          if (!Number.isInteger(parseInt(name[0]))) { return null }
          const conjectureSid = parseInt(name[0])
          return conjectureSid
        }

        function mapListToMapsetList (mapset) {
          return mapset.reduce((acc, beatmap) => {
            if (beatmap.unknown) {
              console.log('unknown beatmap', beatmap.md5)
              return acc
            }
            let set = acc.find((set) => {
              if (beatmap.beatmapset_id !== -1) { return set.id === beatmap.beatmapset_id } else { return set.folderName === beatmap.folder_name }
            })
            // if (set) { set.maps.push(beatmap) }
            if (!set) {
              set = {
                id: beatmap.beatmapset_id === -1 ? setIdGuessFromFolderName(beatmap.folder_name) : beatmap.beatmapset_id,
                folderName: beatmap.folder_name,
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
            slug: collection.id,
            mapsets: mapListToMapsetList(collection.maps),
            mod: [],
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
          description: this.collection.description,
          tournament: this.isTournamentPool
        },
        user: {
          name: this.username
        },
        compiledCollectionData: this.uploadingCollections
      }).then((res) => { this.uploadResult = res.data }).catch(err => console.warn(err)).then(() => { this.onJob = false })
    },
    updateIndex (collection, result) {
      const set = collection.mapsets[result.setIndex]
      const map = set.maps[result.mapIndex]
      this.$set(map, 'index', result.value)
      this.recalculateMapIndexStatus(collection, map)
    },
    recalculateMapIndexStatus (collection) {
      collection.mapsets.map(set => set.maps.map((map) => {
        if (map.index === undefined || map.index === '') { return this.$set(map, 'indexStatus', false) }
        const conflict = collection.mapsets.find(set => set.maps.find(foreignMap => foreignMap !== map && foreignMap.index === map.index)) !== undefined
        this.$set(map, 'indexStatus', !conflict)
      }))
    },
    beatmapsetLink (set) {
      return `https://osu.ppy.sh/beatmapsets/${set.id}`
    },
    beatmapLink (beatmap) {
      return `https://osu.ppy.sh/b/${beatmap.beatmap_id}`
    },
    // collectionSetIds (collection) {
    //   this.copySomething(`${collection.name}\n${collection.mapsets.map(set => set.id).join('\n')}`)
    // },
    // collectionBeatmapIds (collection) {
    //   this.copySomething(`${collection.name}\n${collection.mapsets.map(set => set.maps.map(map => map.beatmap_id).join('\n')).join('\n')}`)
    // },
    // collectionSetLinks (collection) {
    //   this.copySomething(`${collection.name}\n${collection.mapsets.map(set => this.beatmapsetLink(set)).join('\n')}`)
    // },
    // collectionBeatmapLinks (collection) {
    //   this.copySomething(`${collection.name}\n${collection.mapsets.map(set => set.maps.map(map => this.beatmapLink(map)).join('\n')).join('\n')}`)
    // },
    // async copySomething (text) {
    //   try {
    //     await this.$copyText(text)
    //   } catch (e) {
    //     console.error(e)
    //   }
    // },
    async convSlugApi (name) {
      return await axios.get('/api/slug/' + name).then(res => res.data)
    }
  }
}
</script>
<style lang="scss">
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
.section-shaped .shape.shape-skew + .container .bv-no-focus-ring {
  margin-top: 0 !important;
}
</style>
