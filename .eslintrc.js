module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'plugin:nuxt/recommended',
    'standard'
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {},
  ignorePatterns: ['client/components/argon/*', 'client/components/argon-components/*', 'client/components/argon-demo/*', 'client/components/argon-layout/*', 'client/views/**/*']
}
