<template>
  <div id="nav-wrap">
    <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
      <el-radio-button :label="false">展开</el-radio-button>
      <el-radio-button :label="true">收起</el-radio-button>
    </el-radio-group>

    <el-menu
      default-active="1-4-1"
      class="el-menu-vertical-demo"
      @open="handleOpen"
      @close="handleClose"
      :collapse="isCollapse"
      text-color="#fff"
      active-text-color="#fff"
      background-color="transparent"
      router
    >
      <template v-for="(item, index) in routers">
        <el-submenu :index="index + ''" :key="item.id" v-if="!item.hidden">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span slot="title">{{ item.meta.name }}</span>
          </template>

          <el-menu-item
            :index="subItem.path"
            v-for="subItem in item.children"
            :key="subItem.id"
            >{{ subItem.meta.name }}</el-menu-item
          >
        </el-submenu>
      </template>
    </el-menu>
  </div>
</template>
<script>
import { reactive, ref } from "@vue/composition-api";
export default {
  name: "Menu",
  setup(props, { root, refs }) {
    console.log(root.$router.options);
    const routers = reactive(root.$router.options.routes);
    const isCollapse = ref(false);
    const handleOpen = (key, keyPath) => {
      console.log(key, keyPath);
    };
    const handleClose = (key, keyPath) => {
      console.log(key, keyPath);
    };
    return {
      routers,
      isCollapse,
      handleOpen,
      handleClose
    };
  }
};
</script>
<style lang="scss" scoped>
@import "../../../styles/config.scss";
#nav-wrap {
  position: fixed;
  top: 0;
  left: 0;
  width: $navWidth;
  height: 100vh;
  background-color: #344a5f;
}
</style>