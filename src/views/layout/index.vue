<template>
  <div>
    <LayoutHeader />
    <LayoutMenu />
    <LayoutMain />
  </div>
</template>
<script>
import LayoutHeader from "./components/header";
import LayoutMenu from "./components/nav";
import LayoutMain from "./components/main";
export default {
  name: "Layout",
  components: { LayoutHeader, LayoutMenu, LayoutMain },
  setup() {}
};
</script>
<style lang="scss" scoped>
</style>