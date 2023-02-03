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
      <el-table :data="roleList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row :class="['bdbuttom',i1===0?'bdtop':'','vcenter']" v-for="(item,i1) in scope.row.children"
                    :key="item.id">
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag closable
                        @close="removeRightById(scope.row,item.id)">{{ item.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限 --><!-- 三级权限 -->
              <el-col :span="19">
                <!-- 通过for渲染二级权限 -->
                <el-row :class="[i2===0?'':'bdtop','vcenter']" v-for="(item2,i2) in item.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success"
                            closable
                            @close="removeRightById(scope.row,item2.id)">{{ item.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(item3,i3) in item2.children" :key="item3.id"
                            :class="[i3===0?'':'bdtop']"
                            closable
                            @close="removeRightById(scope.row,item3.id)">
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>

            </el-row>
            <!--            {{scope.row}}-->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="minni" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="minni" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button size="minni" type="warning" icon="el-icon-setting" @click="showSetRightDialog">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分配权限 -->
      <el-dialog
          title="提示"
          :visible.sync="showSetDialogVisible"
          width="50%">
        <span>这是一段信息</span>
        <span slot="footer" class="dialog-footer">
    <el-button @click="IsShowSetDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="IsShowSetDialogVisible = false">确 定</el-button>
  </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    return {
      //所有角色的列表数据
      roleList: [],
      //控制分配权限的对话框是否隐藏
      IsShowSetDialogVisible:false
    }
  },
  methods: {
    //获取权限
    async getRoleList() {
      const {data: res} = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        this.$message.error("获取权限列表失败！")
      }
      this.roleList = res.data
      console.log(this.roleList)
    },
    //删除权限
    async removeRightById(role, rightId) {
      const confirmResult = await this.$confirm('此操作将永久删除该该权限, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消操作")
      }

      const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status!==200){
        this.$message.error("删除权限失败！")
      }
      //刷新角色   不走请求，返回值有数据，直接更新数据可以避免显示页面折叠
      role.children=res.data;
    },
    //展示分配权限的对话框
    showSetRightDialog(){

    }


  },
  created() {
    this.getRoleList()
  }
}
</script>

<style scoped>
.el-tag {
  margin: 7px;
}

.bdtop {
  border-top: 1px solid #eee;
}

.bdbuttom {
  border-bottom: 1px solid #eee;
}

.vcenter {
  display: flex;
  align-items: center;
}
</style>