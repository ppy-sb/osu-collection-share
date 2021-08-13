# osu-collection-share

## Build Setup

### database
create .env file contains database connect uri
```
DB_URI=''

SESSION_COLLECTION=sessions
SESSION_SECRET=osu-collection-share-secret-very-long-string

#API_SCHEME=http://
API_SCHEME=unix
API_DOMAIN=localhost
API_LISTEN=/tmp/osu-collection-share.sock
```

```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
