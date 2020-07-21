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
            <el-col :span="15" style="padding-right:6px">
              <el-input
                v-model="ruleForm.code"
                maxlength="6"
                minlength="5"
              ></el-input>
            </el-col>
            <el-col :span="9" style="padding-left:7px;">
              <el-button
                type="success"
                class="block"
                @click="getSms()"
                :disabled="btnCode.status"
                >{{ btnCode.text }}
              </el-button>
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
import { GetSms, Register, Login } from '@/api/login'
import sha1 from 'sha1'
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
        updatebtnStatus()
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
        updatebtnStatus()
      }
    }
    var passwords = (rule, value, callback) => {
      if (btnType.value === 'login') {
        callback()
        updatebtnStatus()
      }
      ruleForm.passwords = stripscript(value)
      value = ruleForm.passwords
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value !== ruleForm.password) {
        callback(new Error('两次密码输入不一致'))
      } else {
        callback()
        updatebtnStatus()
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
        updatebtnStatus()
      }
    }
    const menuArr = reactive([
      { txt: '登录', current: false, type: 'login' },
      { txt: '注册', current: true, type: 'register' },
    ])
    /**
     * 用来判断当前登录或注册的状态
     */
    const btnType = ref('register')
    /**
     * 用来控制表单提交按钮的可用性
     */
    const btnStatus = ref(true)
    /**
     * 定义计时时间
     */
    const timer = ref(null)
    /**
     * 初始化获取验证码按钮的值
     */
    const btnCode = reactive({
      status: false,
      text: '获取验证码',
    })
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
    /**
     * 切换验证码按钮状态
     */
    const updateCodeBtn = (params) => {
      btnCode.status = params.status
      btnCode.text = params.text
    }
    /**
     * 重置表单数据
     */
    const restForm = (formName) => {
      refs[formName].resetFields()
    }
    /**
     * 切换登录、注册按钮
     */
    const toggleTab = (data) => {
      menuArr.forEach((element) => {
        element.current = false
      })
      data.current = true
      btnType.value = data.type
      btnStatus.value = true
      restForm('ruleForm') //重置表单数据
      clearCountDown()
      updateCodeBtn({
        status: false,
        text: '获取验证码',
      })
    }
    /**
     * 获取验证码
     */
    const getSms = () => {
      if (ruleForm.userName === '') {
        root.$message({
          message: '用户名不能为空',
          type: 'error',
        })
        return false
      }
      if (!validate(ruleForm.userName, 'userName')) {
        root.$message({
          message: '输入格式不规范',
          type: 'error',
        })
        return false
      }
      updateCodeBtn({
        status: true,
        text: '发送中',
      })
      const data = {
        username: ruleForm.userName,
        module: btnType.value,
      }
      //延时操作
      setTimeout(() => {
        GetSms(data)
          .then((res) => {
            console.log(res.data)
            root.$message({
              message: '验证码已发送',
              type: 'success',
            })
            countDown(20)
          })
          .catch((error) => {
            root.$message({
              message: error.message,
              type: 'error',
            })
            updateCodeBtn({
              status: false,
              text: '获取验证码',
            })
          })
      }, 1000)
    }
    /**
     * 定时器
     */
    const countDown = (number) => {
      let time = number
      timer.value = setInterval(() => {
        time--
        if (time === 0) {
          clearCountDown()
          updateCodeBtn({
            status: false,
            text: '再次获取',
          })
        } else {
          updateCodeBtn({
            status: true,
            text: `已发送${time}秒`,
          })
        }
      }, 1000)
    }
    /**
     * 清除定时器
     */
    const clearCountDown = () => {
      clearInterval(timer.value)
    }
    /**
     * 更新提交表单按钮状态
     */
    const updatebtnStatus = () => {
      if (
        btnType.value === 'login' &&
        ruleForm.userName &&
        ruleForm.password &&
        ruleForm.code
      ) {
        btnStatus.value = false
      }
      if (
        btnType.value === 'register' &&
        ruleForm.userName &&
        ruleForm.password &&
        ruleForm.code &&
        ruleForm.passwords
      ) {
        btnStatus.value = false
      }
    }
    /**
     * 提交表单
     */
    const submitForm = (formName) => {
      refs[formName].validate((valid) => {
        if (valid) {
          const data = {
            userName: ruleForm.userName,
            password: sha1(ruleForm.password),
            code: ruleForm.code,
          }
          if (btnType.value === 'login') {
            Login(data)
              .then((res) => {
                root.$message({
                  message: '登录成功',
                  type: 'success',
                })
              })
              .catch((error) => {
                root.$message({
                  message: error.message,
                  type: 'error',
                })
              })
          }
          if (btnType.value === 'register') {
            Register(data)
              .then((res) => {
                root.$message({
                  message: '注册成功',
                  type: 'success',
                })
              })
              .catch((error) => {
                root.$message({
                  message: error.message,
                  type: 'error',
                })
              })
          }
        } else {
          return false
        }
      })
    }
    return {
      //方法
      userName,
      password,
      passwords,
      code,
      toggleTab,
      submitForm,
      restForm,
      getSms,
      //数据
      timer,
      menuArr,
      btnType,
      btnStatus,
      btnCode,
      ruleForm,
      rules,
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
