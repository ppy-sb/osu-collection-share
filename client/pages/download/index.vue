<template>
  <section-layout
    :contained="undefined"
    bg-variant="warning"
    skew
    shaped
    class="pt-100"
  >
    <b-card class="shadow">
      <b-form-group
        label-cols-sm="3"
        label="prefix"
        label-align="right"
        label-for="prefix"
      >
        <b-form-input
          id="prefix"
          v-model.lazy.trim="prefix"
          debounce="300"
        />
      </b-form-group>
      <b-form-group
        label-cols-sm="3"
        label="sid(s) seprated by new line"
        label-align="right"
        label-for="sid"
      >
        <b-form-textarea
          id="sid"
          v-model.lazy.trim="idString"
          placeholder="1
2"
          rows="3"
          max-rows="20"
        />
      </b-form-group>
      <b-form-group
        label-cols-sm="3"
        label="download source"
        label-align="right"
        label-for="source"
      >
        <b-form-select id="source" v-model="source">
          <template v-for="(site, name) in sourceConfig">
            <b-form-select-option v-if="!site.mirror" :key="`selector-source-${name}`" :value="name" :disabled="site.disabled">
              {{ site.displayName || name }} {{ site.note ? ` | ${site.note.join(' | ')}` : "" }}
            </b-form-select-option>
          </template>
          <b-form-select-option-group label="- Mirror Sites">
            <template v-for="(site, name) in sourceConfig">
              <b-form-select-option v-if="site.mirror" :key="`selector-source-${name}`" :value="name" :disabled="site.disabled">
                {{ site.displayName || name }} {{ site.note ? ` | ${site.note.join(' | ')}` : "" }}
              </b-form-select-option>
            </template>
            <!-- <b-form-select-option value="osu.sayobot.cn">
              osu.sayobot.cn
            </b-form-select-option> -->
          </b-form-select-option-group>
        </b-form-select>
      </b-form-group>
      <b-form-group
        label-cols-sm="3"
        label="version"
        label-align="right"
        label-for="version"
      >
        <b-form-select id="version" v-model="version" :options="currentSource.version" />
      </b-form-group>
      <b-form-group
        label-cols-sm="3"
        label="simultaneous downloads"
        label-align="right"
        label-for="concurrency"
        :invalid-feedback="`Exceed the recommended concurrency limit (which is ${currentSource.safeConcurrency}). You are at the risk of being banned from this source.`"
        :state="safeConcurrency"
      >
        <b-form-input
          id="concurrency"
          v-model.lazy="concurrency"
          type="number"
        />
      </b-form-group>
      <div class="d-flex">
        <b-button :disabled="job" variant="primary" class="ml-auto" @click="download">
          start
        </b-button>
      </div>
    </b-card>
    <b-collapse :visible="job" class="pt-2">
      <b-card class="shadow">
        <b-progress :max="status.total" hieght="2em">
          <b-progress-bar :value="status.successed" variant="success" />
          <b-progress-bar :value="status.downloading.length" variant="primary" />
          <b-progress-bar :value="status.errored.length" variant="danger" />
        </b-progress>
        <div class="d-flex">
          <b-button-group class="ml-auto pt-2 pb-4">
            <b-button :disabled="!job" @click="() => paused ? resume() : pause()">
              {{ paused ? "resume" : "pause" }}
            </b-button>
            <b-button :disabled="!job" variant="danger" @click="clear">
              cancel
            </b-button>
          </b-button-group>
        </div>
        <div v-for="file in status.downloading" :key="`progress-download-${file.sid}`">
          <b-progress :max="file.total" height="3em">
            <b-progress-bar :value="file.loaded">
              <div class="d-flex align-items-center">
                <bs-image :src="thumbSrc(file.sid)" style="height:3em" class="pr-2" />
                <strong v-if="file.lastTimeStamp" class="text-center">
                  {{ readableFileSize((file.loaded - file.lastLoaded) / (file.timeStamp - file.lastTimeStamp) * 1000) }} / s<br>
                  {{ readableFileSize(file.loaded) }} / {{ readableFileSize(file.total) }}
                </strong>
              </div>
            </b-progress-bar>
          </b-progress>
        </div>
      </b-card>
    </b-collapse>
    <b-collapse :visible="Boolean(status.errored.length)" class="pt-2">
      <b-card no-body class="shadow">
        <b-card-header>
          failed
        </b-card-header>
        <b-list-group flush>
          <b-list-group-item v-for="(f) in status.errored" :key="`failed-download-${f.sid}`" :href="currentSource.set(f.sid)">
            <bs-image :src="thumbSrc(f.sid)" />
          </b-list-group-item>
        </b-list-group>
      </b-card>
    </b-collapse>
  </section-layout>
</template>

<script>
import SectionLayout from '@/components/sb-layouts/components/SectionLayout'
import JsFileDownloader from 'js-file-downloader'
import PQueue from 'p-queue'
import readableFileSize from '~universal/readableFileSize'
import Image from '~/components/sb-components/Image.vue'
import sourceConfig from '~universal/download/sourceConfig.js'

export default {
  components: {
    SectionLayout,
    BsImage: Image
  },
  data () {
    return {
      version: 'novideo',
      queue: undefined,
      idString: '',
      sids: [],
      prefix: `batch-${new Date().toISOString()}`,
      job: false,
      paused: false,
      status: {
        total: 0,
        // errored: 0,
        successed: 0,
        downloading: [{ sid: -1, total: 0, loaded: 0, downloader: undefined, lastLoaded: 0, timeStamp: 0, lastTimeStamp: 0 }],
        errored: []
      },
      source: 'osu.sayobot.cn',
      sourceConfig
    }
  },
  computed: {
    currentSource: {
      get () {
        let ret = { ...this.sourceConfig.bancho }
        if (this.sourceConfig[this.source]) ret = { ...ret, ...this.sourceConfig[this.source] }
        return ret
      },
      set (val) {
        this.sourceConfig[this.source] = val
      }
    },
    concurrency: {
      get () {
        return this.currentSource.concurrency
      },
      set (val, old) {
        if (Number.isNaN(val)) return old
        val = parseInt(val)
        if (val <= 0) return
        this.sourceConfig[this.source].concurrency = val
        if (this.queue && this.currentSource.safeConcurrency >= val) this.queue.concurrency = val
      }
    },
    safeConcurrency () {
      return Boolean(!this.currentSource.safeConcurrency || this.currentSource.concurrency <= this.currentSource.safeConcurrency)
    }
  },
  watch: {
    currentSource (newVal) {
      if (!newVal.version.includes(this.version)) this.version = newVal.version[0]
    }
  },

  created () {
    this.resetStatus()
    const query = this.$route.query
    if (query.sid) {
      const sid = query.sid
      if (Array.isArray(sid)) this.idString = sid.join('\n')
      else this.idString = sid
    }

    if (query.prefix) {
      this.prefix = query.prefix
    }

    if (query.source) {
      if (Object.keys(this.sourceConfig).includes(query.source)) this.source = query.source
    }
  },

  methods: {
    thumbSrc (sid) {
      return this.currentSource.thumb(sid)
    },
    getLink (sid, options) {
      return this.currentSource.downloadLink(sid, options)
    },
    resetStatus () {
      // this.status.total = 0
      this.status.errored = []
      this.status.downloaded = 0
      this.status.downloading = []
      this.status.total = this.sids.length
    },
    idFromString (str) {
      const lines = str.split(/\r?\n/)
      return lines.map(line => line.trim()).filter(line => !isNaN(line) && line)
    },
    pause () {
      if (!this.queue) return
      this.queue.pause()
      this.paused = true
    },
    resume () {
      if (!this.queue) return
      this.queue.start()
      this.paused = false
    },
    clear () {
      this.queue.clear()
      this.resetStatus()
      this.queue = undefined
      this.job = false
    },
    download () {
      this.job = true
      this.sids = this.idFromString(this.idString)
      this.resetStatus()
      this.queue = new PQueue({
        concurrency:
      isNaN(this.currentSource.safeConcurrency)
        ? this.concurrency
        : this.concurrency < this.currentSource.safeConcurrency
          ? this.concurrency
          : this.sids.length > this.currentSource.shortBurstDownloadSize || 0
            ? this.currentSource.safeConcurrency
            : this.concurrency > this.currentSource.shortBurstConcurrency // allow for small size collections burst
              ? this.currentSource.shortBurstConcurrency || this.currentSource.safeConcurrency * 2 // max is 2 times of the rated limit or specified rate
              : this.concurrency
      })
      this.queue.addAll(this.sids.map(sid => async () => {
        const url = await this.getLink(sid, { version: this.version })
        const downloadTracker = {
          sid,
          url,
          total: 0,
          loaded: 0,
          currentEvent: undefined,
          lastEvent: undefined
        }
        const updateStatus = (event) => {
          const current = downloadTracker
          current.lastLoaded = current.loaded
          current.lastTimeStamp = current.timeStamp
          if (!event.lengthComputable) return // guard
          if (current.total !== event.total) current.total = event.total // prevent update if unnecessarily
          current.loaded = event.loaded
          // current.currentEvent = event
          current.timeStamp = event.timeStamp
        }
        const downloader = new JsFileDownloader({ url, process: updateStatus, filename: `${this.prefix}-${sid}.osz`, timeout: 10000000 })
          .then(() => {
            this.status.successed += 1
            const left = this.idString.split(/\r?\n/).filter(s => s !== downloadTracker.sid)
            this.idString = left.join('\n')
          })
          .catch(() => {
            this.status.errored.push(downloadTracker)
          })
          .finally(() => {
            this.status.downloading.splice(this.status.downloading.findIndex(i => i === downloadTracker), 1)
          })
        downloadTracker.downloader = downloader
        this.status.downloading.push(downloadTracker)
        await downloader
      }))
      this.queue.onIdle(() => {
        this.job = false
        this.queue = undefined
      })
    },
    readableFileSize
  }
}
</script>
