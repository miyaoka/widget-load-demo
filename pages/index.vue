<template>
  <section>
    <h2>List</h2>
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
    console.log(env)
    try {
      const { data } = await app.apolloProvider.defaultClient.query({
        query: getIssues,
        variables: {
          repoOwner: env.GH_REPO_OWNER,
          repoName: env.GH_REPO_NAME,
          fetchIssuePerPage: 5
        }
      })
      console.log(data)

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

<style>

</style>
