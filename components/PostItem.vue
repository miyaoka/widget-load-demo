<template>
  <article class="postItem">
    <h2 class="title"><nuxt-link :to="{
      name: 'posts-id',
      params: {
        id: post.number
      }
    }">{{post.title}}</nuxt-link></h2>

    <div class="body">
      <div ref="marked">
        <vue-markdown
          class="marked"
          :source="previewBody"
          :anchorAttributes="{
            target: '_blank',
            rel: 'noopener'
          }"
          @rendered="rendered"
        />
      </div>
      <div>
        <textarea v-model="editBody"/>
        <button @click="updateBody">Update preview</button>
      </div>
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
  data() {
    return {
      previewBody: '',
      editBody: ''
    }
  },
  created() {
    this.previewBody = this.editBody = this.post.body
  },
  methods: {
    updateBody() {
      this.previewBody = this.editBody
    },
    rendered() {
      this.$nextTick(() => {
        this.loadTwitter(this.$refs.marked)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.postItem {
  border: 1px solid $clr-b;
  border-radius: 1rem;
  padding: 1rem;
  overflow: hidden;
}
.title {
  background: $clr-w-d;
  margin: -1rem -1rem 1rem -1rem;
  padding: 0.5rem;
}
.body {
  display: grid;
  grid-template-columns: 50% 50%;
  grid-gap: 1rem;

  textarea {
    display: block;
    width: 100%;
    height: 10rem;
  }
}
</style>
