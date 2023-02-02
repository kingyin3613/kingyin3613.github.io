<template>
  <div>
    <Header />
    <div class="outercontainer">
      <div class="container body md-body">
        <nuxt-content v-if="page" :document="page" />
        <div v-else>暂无数据</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "paperDetail",
  async asyncData({ $content, query }) {
    let page = "";
    try {
      page = await $content(query.paper).fetch();
    } catch (e) {}

    return {
      page,
    };
  },
};
</script>
<style lang="less" scoped>
@import url("./css/md.less");
</style>
