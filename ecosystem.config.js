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
      script: 'npm',
      exec_mode: 'cluster',
      instances: 4,
      args: 'start'
    }
  ]
}
