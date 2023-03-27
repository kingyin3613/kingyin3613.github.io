<template>
  <div>
    <Header />
    <script type="text/x-mathjax-config">
         if(MathJax){
        MathJax.Hub.Config({
          jax: ["input/TeX","output/HTML-CSS", "output/PreviewHTML"],  //输出格式配置：latex 解析为 DOM结构
          tex2jax: {
            inlineMath: [['$','$']],
            displayMath: [ ['$$','$$'], ["\\[","\\]"] ]
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
    </script>
    <div class="outercontainer">
      <div class="container body md-body" id="mdContainer">
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
    console.log(page);
    return {
      page,
    };
  },
  mounted() {
    setTimeout(() => {
      // if (window.isMathjaxConfig === false) {
      //   // 如果：没有配置MathJax
      //   window.initMathjaxConfig();
      // }
      // // 如果，不传入第三个参数，则渲染整个document
      // // 因为使用的Vuejs，所以指明#app，以提高速度
      // window.MathJax.Hub.Queue([
      //   "Typeset",
      //   MathJax.Hub,
      //   document.getElementById("mdContainer"),
      // ]);
    }, 10000000);
  },
};
</script>
<style lang="less" scoped>
@import url("./css/md.less");
</style>
