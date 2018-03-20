<template>
  <article>
    <h3><nuxt-link :to="{
      name: 'posts-id',
      params: {
        id: post.number
      }
    }">{{post.title}}</nuxt-link></h3>
    <div>
      {{post.body}}
    </div>
  </article>
</template>

<script>
import PostItem from '~/components/PostItem.vue'

export default {
  props: {
    post: { type: Object, required: true }
  }
}
</script>

<style>

</style>
