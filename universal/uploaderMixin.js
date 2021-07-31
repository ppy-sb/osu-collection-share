module.exports = {
  uploaderLink (collection) {
    if (!collection.user || collection.user.anonymous !== false) {
      if (collection.uploader) {
        return collection.uploader.link || '#'
      } else { return '#' }
    } else { return collection.user.link || '#' }
  },
  uploaderName (collection) {
    if (!collection.user || collection.user.anonymous !== false) {
      if (collection.uploader) {
        return collection.uploader.name || 'Guest'
      } else { return 'Guest' }
    } else { return collection.user.name || 'Unknown' }
  },
  uploaderAvatarSrc (collection) {
    if (!collection.user || collection.user.anonymous !== false) {
      return collection.uploader && collection.uploader.avatar
    } else { return collection.user.avatar || '#' }
  }
}
