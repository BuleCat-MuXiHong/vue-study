<template>
  <div>
    <!--  面包屑  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图 -->
    <el-card>
      <!-- 添加角色 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

    </el-card>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      //所有角色的列表数据
      roleList: []
    }
  },
  methods: {
    async getRoleList() {
      const {data: res} = await this.$http.get('roles')
      if (res.meta.status!==200){
        this.$message.error("获取权限列表失败！")
      }
      this.roleList=res.data
      console.log(this.roleList)
    }
  },
  created() {
    this.getRoleList()
  }
}
</script>

<style scoped>

</style>