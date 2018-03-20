<template>
  <article class="postItem">
    <h2><nuxt-link :to="{
      name: 'posts-id',
      params: {
        id: post.number
      }
    }">{{post.title}}</nuxt-link></h2>
    <div>
      <vue-markdown
        class="marked"
        :source="post.body"
        :anchorAttributes="{
          target: '_blank',
          rel: 'noopener'
        }"
        @rendered="rendered"
      />
    </div>
  </article>
</template>

<script>
import VueMarkdown from 'vue-markdown'
import PostItem from '~/components/PostItem.vue'

export default {
  components: {
    VueMarkdown
  },
  props: {
    post: { type: Object, required: true }
  },
  methods: {
    rendered() {
      console.log('rendered')
    }
  }
}
</script>

<style>
.postItem {
  border: 1px solid #000;
}
</style>
