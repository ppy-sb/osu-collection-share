// self.addEventListener('message', (message) => {
//   const { osuDBBuffer, collectionDBBuffer } = message.data
//   const ultimateDB = new OsuDBParser(osuDBBuffer, collectionDBBuffer)

//   const osuDBData = ultimateDB.getOsuDBData()
//   const osuCollectionData = ultimateDB.getCollectionData()
//   self.postMessage({ osuDBData, osuCollectionData })
// })
function setIdGuessFromFolderName (name) {
  name = name.split(' ')
  if (!Number.isInteger(parseInt(name[0]))) { return null }
  const conjectureSid = parseInt(name[0])
  return conjectureSid
}

function mapListToMapsetList (mapset) {
  const result = mapset.reduce((acc, beatmap, index) => {
    self.postMessage(['report-progress', { processing: `${beatmap.artist_name} - ${beatmap.song_title}`, job: 'recreate-beatmapset', current: index + 1, total: mapset.length }])
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
self.addEventListener('message', ({ data: [osuDBData, osuCollectionData] }) => {
  self.postMessage(['report-progress', { processing: 'beatmaps', job: 'create-osu-database-index' }])
  const beatmapsMap = new Map(osuDBData.beatmaps.map(beatmap => [beatmap.md5, beatmap]))

  const collections = osuCollectionData.collection.map((collection, index) => {
    self.postMessage(['report-progress', { processing: collection.name, job: 'create-collection-root', current: index, total: osuCollectionData.collection.length }])
    return {
      name: collection.name,
      id: collection.name.split(' ').join('-'),
      maps: collection.beatmapsMd5.map(md5 => beatmapsMap.get(md5) || { md5, unknown: true })
    }
  }).filter(collection => collection.maps.length)

  self.postMessage(['result', collections.map((collection) => {
    return {
      name: collection.name,
      id: collection.id,
      slug: collection.id,
      mapsets: mapListToMapsetList(collection.maps),
      mod: [],
      upload: true
    }
  })])
})
