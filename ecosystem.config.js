module.exports = {
  apps: [
    {
      name: 'api',
      script: 'npm',
      args: 'run express-api'
    },
    {
      name: 'frontend',
      script: 'npm',
      exec_mode: 'cluster',
      args: 'start'
    }
  ]
}
