import Vue from 'vue'

Vue.mixin({
  methods: {
    loadTwitter(target) {
      process.browser && twttr && twttr.widgets.load(target)
    }
  }
})
