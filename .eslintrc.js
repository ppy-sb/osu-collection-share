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
    'plugin:nuxt/recommended'
  ],
  plugins: [
  ],
  // add your custom rules here
  rules: {},
  ignorePatterns: ['components/argon/*', 'components/argon-components/*', 'components/argon-demo/*', 'components/argon-layout/*', 'components/sb-components/*', 'components/sb-layouts/*', 'components/sb-layouts/components/*']
}
