module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
    // eslint.vue.js.org查找
    'vue/setup-compiler-macros': true
  },
  extends: [
    // Vue3 语法规范
    'plugin:vue/vue3-recommended',
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  plugins: [
    'vue'
  ],
  rules: {}
}
