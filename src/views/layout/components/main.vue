<template>
  <div id="main-wrap">
    <router-view />
  </div>
</template>
<script>
export default {
  name: "Main"
};
</script>
<style lang="scss" scoped>
@import "../../../styles/config.scss";
#main-wrap {
  position: fixed;
  left: $navWidth;
  top: 75px;
  right: 0;
  bottom: 0;
  background-color: #ffffff;
  border: 30px solid #f7f7f7;
  border-bottom: none;
  -webkit-box-sizing: border;
}
</style>