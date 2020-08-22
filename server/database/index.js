
export default ({ app }, inject) => {
  const models = require('./models')
  const db = require('./connect')
  inject('mongoose', db)
  inject('models', models)
}
