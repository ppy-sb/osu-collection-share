<template>
  <card no-body>
    <b-list-group flush>
      <b-list-group-item v-for="collection in list" :key="collection._id">
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">
            <nuxt-link :to="localePath({name:'collections-slug', params: {slug: collection.slug}})">
              {{ collection.name }}
            </nuxt-link>
          </h5>
          <small>{{ moment(dateFromObjectId(collection._id)) | fromNow }} | <i class="fas fa-eye" /> {{ collection.count.view }}</small>
        </div>

        <p class="mb-1" v-html="bbcode(collection.description)" />

        <small>{{ $t('user.uploadedBy') }}
          <!-- <a
            :href="
              (collection.uploader &&
                (collection.uploader.link
                  || (collection.uploader.name &&
                    `https://osu.ppy.sh/users/${collection.uploader.name}`)))
                || `https://osu.ppy.sh/users/${collection.user.name}`"
          >{{ (collection.uploader && collection.uploader.name)
            || collection.user.name }}</a> -->
          <a :href="uploaderLink(collection)">{{ uploaderName(collection) }}</a>
        </small>
      </b-list-group-item>
    </b-list-group>
  </card>
</template>

<script>
export default {
  filters: {
    fromNow (moment) {
      return moment.fromNow()
    }
  },
  props: {
    list: {
      type: Array,
      default: () => []
    }
  },

  methods: {
    dateFromObjectId (objectId) {
      return new Date(parseInt(objectId.substring(0, 8), 16) * 1000)
    },
    bbcode (str) {
      return str
    },
    uploaderLink (collection) {
      if (!collection.user || collection.user.anonymous) {
        if (collection.uploader) {
          return collection.uploader.link || '#'
        } else { return '#' }
      } else { return collection.user.link || '#' }
    },
    uploaderName (collection) {
      if (!collection.user || collection.user.anonymous) {
        if (collection.uploader) {
          return collection.uploader.name || 'Guest'
        } else { return 'Guest' }
      } else { return collection.user.name || 'Unknown' }
    }
  }
}
</script>
