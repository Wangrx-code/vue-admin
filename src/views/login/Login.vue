<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li
          v-for="item in menuArr"
          :key="item.id"
          :class="{ current: item.current }"
          @click="toggleTab(item)"
        >
          {{ item.txt }}
        </li>
      </ul>

      <el-form
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        class="login-form"
        size="medium"
      >
        <el-form-item prop="userName" class="login-item">
          <label>邮箱</label>
          <el-input
            type="text"
            v-model="ruleForm.userName"
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item prop="password" class="login-item">
          <label>密码</label>
          <el-input
            type="text"
            v-model="ruleForm.password"
            autocomplete="off"
            maxlength="16"
            minlength="8"
          ></el-input>
        </el-form-item>

        <el-form-item
          prop="passwords"
          class="login-item"
          v-show="btnType === 'register'"
        >
          <label>确认密码</label>
          <el-input
            type="text"
            v-model="ruleForm.passwords"
            autocomplete="off"
            maxlength="16"
            minlength="8"
          ></el-input>
        </el-form-item>

        <el-form-item prop="code" class="login-item">
          <label>验证码</label>
          <el-row :gutter="20">
            <el-col :span="15" style="padding-right:6px"
              ><el-input
                v-model.number="ruleForm.code"
                maxlength="6"
                minlength="6"
              ></el-input
            ></el-col>
            <el-col :span="9" style="padding-left:7px;">
              <el-button type="success" class="block" @click="getSms()"
                >获取验证码</el-button
              >
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item>
          <el-button
            type="danger"
            @click="submitForm('ruleForm')"
            class="block login-btn"
            :disabled="btnStatus"
            >{{ btnType === 'login' ? '登录' : '注册' }}</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { stripscript, validate } from '@/utils/validate'
import { ref, reactive, onMounted } from '@vue/composition-api'
import { GetSms } from '@/api/login'
export default {
  name: 'login',
  setup(props, { root, refs }) {
    var userName = (rule, value, callback) => {
      ruleForm.userName = stripscript(value, 'userName')
      value = ruleForm.userName
      if (value === '') {
        callback(new Error('请输入用户名'))
      } else if (!validate(value, 'userName')) {
        callback(new Error('输入格式不规范'))
      } else {
        callback()
      }
    }
    var password = (rule, value, callback) => {
      ruleForm.password = stripscript(value)
      value = ruleForm.password
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (!validate(value, 'password')) {
        callback(new Error('请输入8-16位包含数字、英文字母的密码'))
      } else {
        callback()
      }
    }
    var passwords = (rule, value, callback) => {
      if (btnType.value === 'login') {
        callback()
      }
      ruleForm.passwords = stripscript(value)
      value = ruleForm.passwords
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value !== ruleForm.password) {
        callback(new Error('两次密码输入不一致'))
      } else {
        callback()
      }
    }
    var code = (rule, value, callback) => {
      ruleForm.code = stripscript(value)
      value = ruleForm.code
      if (!value) {
        return callback(new Error('验证码不能为空'))
      } else if (!validate(value, 'code')) {
        return callback(new Error('验证码格式有误'))
      } else {
        callback()
      }
    }
    const menuArr = reactive([
      { txt: '登录', current: false, type: 'login' },
      { txt: '注册', current: true, type: 'register' },
    ])
    const btnType = ref('register')
    const btnStatus = ref(true)
    const ruleForm = reactive({
      userName: '',
      password: '',
      passwords: '',
      code: '',
    })
    const rules = reactive({
      userName: [{ validator: userName, trigger: 'blur' }],
      password: [{ validator: password, trigger: 'blur' }],
      passwords: [{ validator: passwords, trigger: 'blur' }],
      code: [{ validator: code, trigger: 'blur' }],
    })

    const toggleTab = (data) => {
      menuArr.forEach((element) => {
        element.current = false
      })
      data.current = true
      btnType.value = data.type
    }
    const getSms = () => {
      if (ruleForm.userName === '') {
        root.$message({
          showClose: true,
          message: '用户名不能为空',
          type: 'error',
        })
        return false
      }
      GetSms({
        username: ruleForm.userName,
        module: 'login',
      })
        .then((res) => {
          console.log(res)
        })
        .catch((error) => {
          root.$message({
            showClose: true,
            message: error.message,
            type: 'error',
          })
        })
    }
    const submitForm = (formName) => {
      refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }

    onMounted(() => {})

    return {
      userName,
      password,
      passwords,
      code,
      menuArr,
      btnType,
      btnStatus,
      toggleTab,
      submitForm,
      ruleForm,
      rules,
      getSms,
    }
  },
}
</script>

<style scoped>
#login {
  background-color: #344a5f;
  height: 100vh;
}
.login-wrap {
  width: 329px;
  margin: auto;
}
.menu-tab {
  text-align: center;
  padding-left: 0px;
}
.menu-tab li {
  display: inline-block;
  width: 88px;
  line-height: 36px;
  font-size: 14px;
  color: #fff;
  border-radius: 2px;
  cursor: pointer;
}
.menu-tab .current {
  background-color: rgba(0, 0, 0, 0.1);
}
.login-form {
  margin-top: 28px;
}
.login-form label {
  display: block;
  color: #fff;
  font-size: 14px;
  margin-bottom: 4px;
}
.login-form .login-item {
  margin-bottom: 9px;
}
.login-form .block {
  display: block;
  width: 100%;
}
.login-form .login-btn {
  margin-top: 19px;
}
</style>
