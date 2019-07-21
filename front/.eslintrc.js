module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  },
  env: {
    node: true,
    browser: true
  },
  plugins: [
    'vue'
  ],
  extends: [
    'standard',
    'plugin:vue/recommended'
  ],
  // custom rules
  'rules': {
    'vue/max-attributes-per-line': [2, { 'singleline': 5, 'multiline': 4 }]
  },
  globals: {
    moment: true
  }
}
