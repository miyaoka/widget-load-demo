<template>
  <div>
    <h2>Post</h2>
    <PostItem
      :post="issue"
    />
  </div>
</template>

<script>
import PostItem from '~/components/PostItem.vue'
import getIssue from '~/apollo/queries/getIssue'

export default {
  components: {
    PostItem
  },
  async asyncData({ app, env, params, payload }) {
    if (payload) return { post: payload }
    console.log(params)
    try {
      const { data } = await app.apolloProvider.defaultClient.query({
        query: getIssue,
        variables: {
          repoOwner: env.GH_REPO_OWNER,
          repoName: env.GH_REPO_NAME,
          issueNumber: Number(params.id)
        }
      })
      return {
        issue: data.repository.issue
      }
    } catch (err) {
      console.error(err)
    }
  }
}
</script>

<style>

</style>
