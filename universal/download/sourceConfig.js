export default {
  bancho: {
    downloadLink: (sid, { version = 'novideo' } = {}) => `https://osu.ppy.sh/beatmapsets/${sid}/download?noVideo=${version === 'noVideo'}`,
    thumb: sid => `https://b.ppy.sh/thumb/${sid}l.jpg`,
    set: sid => `https://osu.ppy.sh/beatmapsets/${sid}`,
    disabled: true,
    displayName: 'osu.ppy.sh'
  },
  'chimu.moe': {
    downloadLink: (sid, { version = 'novideo' } = {}) => `https://api.chimu.moe/v1/download/${sid}?n=${version === 'noVideo'}`,
    concurrency: 1,
    safeConcurrency: 1,
    shortBurstDownloadSize: 4,
    shortBurstConcurrency: 2,
    mirror: true,
    version: ['full', 'novideo'],
    note: ['1 concurrent download', 'higher rate is possible but don\'t']
  },
  'osu.sayobot.cn': {
    downloadLink: (sid, { version = 'novideo' } = {}) => {
      if (version === 'novideo') {
        return `https://dl.sayobot.cn/beatmaps/download/novideo/${sid}`
      } else if (version === 'mini') {
        return `https://dl.sayobot.cn/beatmaps/download/mini/${sid}`
      } else {
        return `https://dl.sayobot.cn/beatmaps/download/full/${sid}`
      }
    },
    version: ['full', 'novideo', 'mini'],
    concurrency: 10,
    mirror: true,
    note: ['higher fail rate outside from China', 'cancel then start again helps']
  },
  'beatconnect.io': {
    downloadLink: (sid, { version = 'full' } = {}) => {
      // const { uniqueId } = await this.$axios.get(`/api/beatconnect.io/download/${this.version}/${sid}`).then(res => res.data)
      // return `https://beatconnect.io/${sid}/${uniqueId}/`
      return `/api/beatconnect.io/download/${this.version}/${sid}`
    },
    concurrency: 1,
    safeConcurrency: 1,
    shortBurstDownloadSize: 4,
    shortBurstConcurrency: 2,
    mirror: true,
    version: ['full'],
    note: ['1 concurrent download'],
    disabled: false
  }
}
