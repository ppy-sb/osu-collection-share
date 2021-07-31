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
        <b-card no-body class="shadow card-profile mt--300">
          <h1 class="text-right pr-2 m-0">
            <i v-b-popover.hover.focus.rightbottom.html="$t('upload.disclaimer')" class="fa fa-question-circle" />
          </h1>
          <!-- <b-card-text
            {{ $t('upload.disclaimer') }}
          </b-card-text> -->
          <b-card-body class="pt-1">
            <b-collapse :visible="!osuCollectionDataStat">
              <b-form-group
                label-cols-sm="2"
                :label="$t('upload.form.label.collectionDB')"
                label-align="right"
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
                label-cols-sm="2"
                label="osu.db:"
                label-align="right"
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
            </b-collapse>
            <b-form-group
              label-cols-sm="2"
              :label="$t('upload.form.label.collectionName')"
              label-align="right"
              label-for="collectionName"
              :description="notices.describeSlug"
            >
              <b-form-input
                id="collectionName"
                v-model.lazy.trim="collection.name"
                :placeholder="$t('upload.form.placeholder.myCollection')"
                debounce="300"
              />
            </b-form-group>
            <b-form-group
              label-cols-sm="2"
              :label="$t('upload.form.label.username')"
              label-align="right"
              label-for="username"
            >
              <b-form-input
                id="username"
                v-model.lazy.trim="username"
                :placeholder="$t('upload.form.placeholder.username')"
                debounce="300"
              />
            </b-form-group>
            <b-form-group
              label-cols-sm="2"
              :label="$t('upload.form.label.urlForUsername')"
              label-align="right"
              label-for="usernameURL"
            >
              <b-form-input
                id="usernameURL"
                v-model.lazy.trim="hyperlink"
                :placeholder="$t('upload.form.placeholder.defaultLink') + username"
                debounce="300"
              />
            </b-form-group>
            <b-form-group
              label-cols-sm="2"
              :label="$t('upload.form.label.avatarSrcForUsername')"
              label-align="right"
              label-for="avatarSrc"
            >
              <b-form-input
                id="avatarSrc"
                v-model.lazy.trim="avatarSrc"
                :placeholder="$t('upload.form.placeholder.defaultAvatar')"
                :state="avatarSrcValid"
                debounce="300"
              />
            </b-form-group>
            <b-form-group
              label-cols-sm="2"
              :label="$t('upload.form.label.collectionDescription')"
              label-align="right"
              label-for="description"
            >
              <b-form-textarea
                id="description"
                v-model.lazy.trim="collection.description"
                :placeholder="$t('upload.form.placeholder.descriptionPlaceholder')"
                rows="3"
                max-rows="6"
              />
            </b-form-group>
            <b-form-group
              label-cols-sm="2"
              :label="$t('upload.form.label.config')"
              label-align="right"
              label-for="description"
            >
              <b-form-checkbox
                v-show="!uploadResult"
                v-model="isTournamentPool"
              >
                {{ $t('upload.isTournamentPool') }}
              </b-form-checkbox>
            </b-form-group>
            <b-card-text>
              {{ complaint }}
            </b-card-text>
            <div class="d-flex">
              <b-button-group>
                <b-button variant="primary" class="text-capitalize" :pressed="osuCollectionDataStat" :disabled="osuCollectionDataStat" @click="readData">
                  {{ $t('upload.parse') }}
                </b-button>
                <b-button
                  v-if="osuCollectionDataStat"
                  class="text-capitalize"
                  :pressed="compiledCollectionData.length > 0"
                  :disabled="compiledCollectionData.length > 0"
                  variant="primary"
                  @click="compileData"
                >
                  {{ $t('upload.compile') }}
                </b-button>
                <b-button v-if="compiledCollectionData.length" class="text-capitalize" variant="primary" @click="upload">
                  {{ $t('upload.upload') }}
                </b-button>
              </b-button-group>
              <b-button-group class="ml-auto">
                <b-button variant="warning" @click="reset">
                  {{ $t('upload.restart') }}
                </b-button>
              </b-button-group>
            </div>
          </b-card-body>
        </b-card>
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
            <b-button-toolbar class="pt-2">
              <b-button-group size="sm">
                <b-button variant="info" class="text-capitalize" @click="() => compiledCollectionData.map(c => c.upload = true)">
                  {{ $t('upload.checkAll') }}
                </b-button>
                <b-button variant="success" class="text-capitalize" @click="() => compiledCollectionData.map(c => c.upload = false)">
                  {{ $t('upload.uncheckAll') }}
                </b-button>
              </b-button-group>
            </b-button-toolbar>
            <template v-if="uploadResult">
              <b-card-title>
                {{ $t('upload.done') }}
              </b-card-title>
              <b-card-text>
                <nuxt-link :to="localePath({name: 'collections-slug', params:{ slug: uploadResult.collectionDB.slug }})">
                  {{ $t('upload.collectionLink') }}
                </nuxt-link>
              </b-card-text>
            </template>
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
                label-align="right"
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
                  label-align="right"
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
                  label-align="right"
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
      </card>
    </section-layout>
  </profile-layout>
</template>
<script>
// import axios from 'axios'
import SectionLayout from '@/components/sb-layouts/components/SectionLayout'
import TopSectionLayout from '@/components/sb-layouts/components/TopSectionLayout'
import ProfileLayout from '@/components/sb-layouts/ProfileLayout'

import CollectionSection from '@/components/CollectionSection'
import OsuDBParserWorker from '@/assets/scripts/parseDB.worker.js'

import isUrl from '~/../universal/isUrl'
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
      complaint: '',
      username: '',
      hyperlink: undefined,
      avatarSrc: undefined,
      avatarSrcValid: undefined,
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
        'ScoreV2',
        'Accuracy'
      ],
      compiledCollectionData: [],
      collectionDB: undefined,
      collectionDBBuffer: undefined,
      osuDB: undefined,
      osuDBBuffer: undefined,
      osuCollectionDataStat: false,
      // osuCollectionData: undefined,
      // osuDBData: undefined,
      uploadResult: undefined,
      onlyShowUploading: false,
      isTournamentPool: false
    }
  },
  osuCollectionData: undefined,
  osuDBData: undefined,
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
        // this.notices.describeSlug = `your link will be /${this.collection.slug}`
      } else {
        this.collection.slug = result.slug
        // this.notices.describeSlug = this.collection.slug
      }
      this.notices.describeSlug = `collection's link will be /${this.collection.slug}`
    },
    async collectionDB (file) {
      this.collectionDBBuffer = await this.readUploadedFileAsBuffer(file)
    },
    async osuDB (file) {
      this.osuDBBuffer = await this.readUploadedFileAsBuffer(file)
    },
    avatarSrc (url) {
      this.avatarSrcValid = isUrl(url)
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
    reset () {
      location.reload()
    },
    async readData () {
      this.onJob = true
      if (!this.osuDBBuffer || !this.collectionDBBuffer) {
        this.onJob = false
        this.complaint = 'Please select osu.db and collections.db before parse'
        return console.log('sth went wrong')
      }

      // const { osuDBData, osuCollectionData } =
      const worker = new OsuDBParserWorker()
      const resultPromise = new Promise((resolve, reject) => {
        worker.onmessage = result => resolve(result.data)
      })
      worker.postMessage({ osuDBBuffer: this.osuDBBuffer, collectionDBBuffer: this.collectionDBBuffer })

      const { osuDBData, osuCollectionData } = await resultPromise
      worker.terminate()

      this.$options.osuDBData = osuDBData
      this.$options.osuCollectionData = osuCollectionData
      this.osuCollectionDataStat = Boolean(osuDBData)
      this.username = this.$options.osuDBData.username
      if (!this.hyperlink) { this.hyperlink = `https://osu.ppy.sh/users/${this.username}` }

      if (this.collection.name === '') { this.collection.name = `${this.$options.osuDBData.username}'s collection` }
      this.onJob = false
    },

    async compileData () {
      this.onJob = true
      const compiledCollectionData = this.$worker.run((osuDBData, osuCollectionData) => {
        function setIdGuessFromFolderName (name) {
          name = name.split(' ')
          if (!Number.isInteger(parseInt(name[0]))) { return null }
          const conjectureSid = parseInt(name[0])
          return conjectureSid
        }

        function mapListToMapsetList (mapset) {
          const result = mapset.reduce((acc, beatmap) => {
            if (beatmap.unknown) {
              console.log('unknown beatmap', beatmap.md5)
              return acc
            }
            // let set = acc.find((set) => {
            //   if (beatmap.beatmapset_id !== -1) { return set.id === beatmap.beatmapset_id } else { return set.folderName === beatmap.folder_name }
            // })
            let set = acc.get(beatmap.beatmapset_id) || acc.get(beatmap.folder_name) || undefined
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
              if (beatmap.beatmapset_id && beatmap.beatmapset_id > 0) { acc.set(beatmap.beatmapset_id, set) } else { acc.set(beatmap.folder_name, set) }
            }
            set.maps.push(beatmap)
            return acc
          }, new Map())
          return Array.from(result.values())
        }

        const beatmapsMap = new Map(osuDBData.beatmaps.map(beatmap => [beatmap.md5, beatmap]))

        const collections = osuCollectionData.collection.map((collection) => {
          return {
            name: collection.name,
            id: collection.name.split(' ').join('-'),
            maps: collection.beatmapsMd5.map(md5 => beatmapsMap.get(md5) || { md5, unknown: true })
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
      }, [this.$options.osuDBData, this.$options.osuCollectionData])
      this.$options.osuDBData = undefined
      this.$options.osuCollectionData = undefined
      this.compiledCollectionData = await compiledCollectionData
      this.onJob = false
    },
    upload () {
      this.onJob = true
      this.$axios.post('/api/collectionDB/upload', {
        collectionDB: {
          name: this.collection.name,
          slug: this.collection.slug,
          description: this.collection.description,
          tournament: this.isTournamentPool,
          uploader: {
            link: this.hyperlink,
            avatar: this.avatarSrc,
            name: this.username
          }
        },
        user: {
          // name: this.username
          anonymous: true
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
    async convSlugApi (name) {
      return await this.$axios.get('/api/slug/' + name).then(res => res.data)
    }
  },
  head () {
    return {
      title: `${this.$t('upload.upload')} - ${this.$t('landing.title')}`,
      meta: [{
        hid: 'description',
        name: 'description',
        content: this.$t('upload.description')
      }]
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
