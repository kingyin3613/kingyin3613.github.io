<template>
  <div>
    <Header />
    <!-- <script type="text/x-mathjax-config">
         if(MathJax){
        MathJax.Hub.Config({
          jax: ["input/TeX","output/HTML-CSS", "output/PreviewHTML"],  //输出格式配置：latex 解析为 DOM结构
          tex2jax: {
            inlineMath: [['$','$']],
            displayMath: [ ['$$','$$']]
          },
          "HTML-CSS": {
            showMathMenu: false,            // 隐藏右键菜单展示
            linebreaks: {
              automatic: true,  //超长公式换行处理（默认是false不换行）
              width: "80%"      //设置换行的点，默认是遇到等号=换行
            }
          },
        });
      }
    </script> -->
    <div class="outercontainer">
      <div class="container body md-body" id="mdContainer">
        <nuxt-content v-if="page" v-katex :document="page" />
        <div v-else>暂无数据</div>
      </div>
    </div>
  </div>
</template>

<script>
import katex from "katex";
// const katex = require('katex');
// require('katex/contrib/mhchem');
export default {
  name: "paperDetail",
  async asyncData({ $content, query }) {
    let page = "";
    try {
      if (query.paper) page = await $content(query.paper).fetch();
    } catch (e) {}
    console.log(page);
    return {
      page,
    };
  },
  async mounted() {
    // With `nuxt generate` the pre-rendered /paper-detail page has no query
    // string, so its payload is empty; fetch the document on the client.
    if (!this.page || !this.page.body) {
      const paper = this.$route.query.paper;
      if (paper) {
        try {
          this.page = await this.$content(paper).fetch();
        } catch (e) {}
      }
    }
    this.$nextTick(() => {
      setTimeout(() => {
        const content = document.getElementsByClassName("nuxt-content")[0];
        if (!content) return;
        try {
          content.innerHTML = katex.renderToString(content.innerHTML);
        } catch (e) {}
      }, 100);
    });
  },
};
</script>
<style lang="less" scoped>
@import url("./css/md.less");
</style>
