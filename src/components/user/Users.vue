<template>
  <div>
    <!--  面包屑  -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!--  卡片视图区域  -->
    <el-card class="box-card">
      <!--   搜索和添加区   -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
              placeholder="请输入内容"
              class="input-with-select"
              v-model="queryInfo.query"
              clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!--用户列表区-->
      <el-table :data="userList" style="width: 100%" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="180"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="180" >
          <!--     作用域插槽     -->
          <template slot-scope="scope">
            <el-switch
                v-model="scope.row.mg_state"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="userStatusChange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <!--      修改按钮      -->
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <!--      删除按钮      -->
            <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
            <!--      分配角色按钮      -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>

      </el-table>
      <!--   分页区   -->
      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pagenum"
          :page-sizes="[1, 2, 5, 10]"
          :page-size="queryInfo.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </el-card>
<!--  添加用户对话框  -->
    <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="50%"
        @close="addDialogVisibleClosed">
<!--   内容主体区   -->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>


      <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addDialogVisible=false">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "users",
  data() {
    //验证邮箱规则
    let checkEmail=(rule,value,cb)=>{
      const regEmail =/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)){
          //合法邮箱
        return cb()
      }
      cb(new Error("请输入合法邮箱"))
    }
    //验证手机规则
    let checkMobile=(rule,value,cb)=>{
      const regMobile = /^((13[0-9])|(17[0-1,6-8])|(15[^4,\\D])|(18[0-9]))\d{8}$/;
      if (regMobile.test(value)){
        return cb()
      }
      cb(new Error("请输入合法手机号"))
    }
    return {
      //获取用户列表的参数
      queryInfo: {
        query: '',
        //当前页数
        pagenum: 1,
        //当前每页显示多少条数据
        pagesize: 1
      },
      //用户数据
      userList: [],
      total: 0,
      //控制添加用户对话框的显示与隐藏
      addDialogVisible:false,
      //添加用户的表单数据
      addForm:{
        username:'',
        password: '',
        email:'',
        mobile:''
      },
      //添加用户的表单验证
      addFormRules:{
        username:[
          {required:true,message:"请输入用户名",trigger:'blur'},
          {min:3,max:10,message: "用户名长度在3-10之间",trigger:'blur'}
        ],
        password:[
          {required:true,message:"请输入密码",trigger:'blur'},
          {min:8,max:15,message: "密码长度在8-15之间",trigger:'blur'}
        ],
        email:[
          {required:true,message:"请输入邮箱地址",trigger:'blur'},
          {validator:checkEmail,trigger: 'blur'}
        ],
        mobile:[
          {required:true,message:"请输入手机号",trigger:'blur'},
          {validator:checkMobile,trigger: 'blur'}
        ]
      }

    }
  },
  methods: {
    async getUserList() {
      const {data: res} = await this.$http.get("users", {params: this.queryInfo})
      if (res.meta.status !== 200) return this.$message.error("获取用户数据失败")
      this.userList = res.data.users;
      this.total = res.data.total
      console.log(res)
    },
    //监听pagesize改变的事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserList()
      change
    },
    //监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    async userStatusChange(userInfo){
      console.log(userInfo)
      const {data:res} = await this.$http.put(`users/${userInfo.id}/state/${userInfo.mg_state}`)
      console.log(res.meta.status)
      if (res.meta.status!==200){
        userInfo.mg_state=!userInfo.mg_state
        this.$message.error("修改失败")
      }
      this.$message.success("更新成功")
    },
    //监听添加用户对话框的关闭事件
    addDialogVisibleClosed(){
      this.$refs.addFormRef.resetFields()
    }
  },
  created() {
    this.getUserList()
  }
}
</script>

<style scoped>

</style>