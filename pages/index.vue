<template>
  <section>
    <h2>List</h2>
    <PostItem
      v-for="post in nodes"
      :key="post.id"
      :post="post"
      class="post"
    />
  </section>
</template>

<script>
import PostItem from '~/components/PostItem.vue'
import getIssues from '~/apollo/queries/getIssues'

export default {
  components: {
    PostItem
  },
  async asyncData({ app, env }) {
    try {
      const { data } = await app.apolloProvider.defaultClient.query({
        query: getIssues,
        variables: {
          repoOwner: env.GH_REPO_OWNER,
          repoName: env.GH_REPO_NAME,
          fetchIssuePerPage: 5
        }
      })
      const { totalCount, nodes, pageInfo, append } = data.repository.issues
      return {
        totalCount,
        nodes,
        pageInfo,
        append
      }
    } catch (err) {
      console.error(err)
    }
  }
}
</script>

<style lang="scss" scoped>
.post {
  margin-top: 1rem;
}
</style>
