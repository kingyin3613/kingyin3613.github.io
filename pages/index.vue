<template>
  <div>
    <nuxt-content :document="page" />
    <Tutorial />
  </div>
</template>

<script>
export default {
  name: "IndexPage",
  async asyncData({ $content }) {
    const page = await $content("hello").fetch();

    return {
      page,
    };
  },
};
</script>
