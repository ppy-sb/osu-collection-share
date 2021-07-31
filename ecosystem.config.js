module.exports = {
  apps: [
    {
      name: 'osu-collection-share/api',
      script: 'npm',
      args: 'run express-api'
    },
    {
      name: 'osu-collection-share/frontend',
      script: 'npm',
      exec_mode: 'cluster',
      args: 'start'
    }
  ]
}
