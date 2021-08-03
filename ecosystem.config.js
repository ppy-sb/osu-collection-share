module.exports = {
  apps: [
    {
      name: 'osu-collection-share/api',
      script: 'npm',
      args: 'run express-api',
      exec_mode: 'cluster',
      instances: 4
    },
    {
      name: 'osu-collection-share/frontend',
      script: './node_modules/nuxt/bin/nuxt.js',
      exec_mode: 'cluster',
      instances: 4
    }
  ]
}
