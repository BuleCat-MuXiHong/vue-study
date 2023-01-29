<template>
  <!--  头部区域  -->
  <el-container class="home_container">
    <el-header>
      <div>
        <img src="../assets/img/2068628808_7761ac9d884abca6c0871c11156bf632.jpg" alt="">
        <span>后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!--   页面区域   -->
    <el-container>
      <!--    侧边栏    -->
      <el-aside :width="isCollapse? '18px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!--   侧边栏菜单    unique-opened每次只能展开一个菜单  -->
        <el-menu background-color="#333744"
                 text-color="#fff"
                 active-text-color="#409eff" unique-opened
                 :collapse="isCollapse"
                 :el-collapse-transition="false"
                 router :default-active="activePath">
          <!--    一级菜单      -->
          <el-submenu :index="item.id+''" v-for='item in menuList' :key="item.id">
            <!--     一级菜单模板区       -->
            <template slot="title">
              <!--图标-->
              <i class="el-icon-location"></i>
              <!--文本-->
              <span>{{ item.authName }}</span>
            </template>

            <!--二级菜单-->
            <el-menu-item :index="'/'+subItem.path"
                          v-for="subItem in item.children"
                          :key="subItem.id" @click="saveNavState('/'+subItem.path)">
              <template slot="title">
                <!--图标-->
                <i class="el-icon-menu"></i>
                <!--文本-->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--   右侧内容     -->
      <el-main>
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data(){
    return{
      //左侧菜单数据
      menuList:[],
      isCollapse:false,
      //被激活的链接地址
      activePath:''
    }
  },
  methods: {
    //登出
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    //获取全部的菜单
    async getMenuList(){
      const {data:res} = await this.$http.get('menus')
      if (res.meta.status !==200) return this.$message.error(res.meta.msg)
      this.menuList = res.data
      console.log(res)
    },
    //点击按钮切换菜单的折叠
    toggleCollapse(){
      this.isCollapse=!this.isCollapse;
    },
    //保存链接的激活状态
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath=activePath
    }
  },
  created() {
    this.getMenuList()
    this.activePath=window.sessionStorage.getItem('activePath')
  }
}
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
}

.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;

  > div {
    display: flex;
    align-items: center;

    span {
      margin-left: 15px;
    }

    > img {
      height: 50px;
      height: 61px;
      margin-left: 0px;
    }
  }
}

.el-aside {
  background-color: #333744;
  .el-menu{
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}
.toggle-button{
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
}
</style>