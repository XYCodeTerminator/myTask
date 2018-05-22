<template>
  <v-app id="inspire">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title>图书管理系统</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form v-model="valid" ref="registerForm" lazy-validation>
                  <v-text-field prepend-icon="person" name="login" label="用户名" type="text" v-model="username" :rules="usernameRules" :counter="13"></v-text-field>
                  <v-text-field prepend-icon="lock" name="password" label="密码" id="password" v-model="password"  
                    :append-icon="hidePwd ? 'visibility_off' : 'visibility'" :append-icon-cb="() => (hidePwd = !hidePwd)"
                    :type="hidePwd ? 'password' : 'text' " :rules="passwordRules">
                  </v-text-field>
                  <v-text-field prepend-icon="lock" name="confirmPassword" label="确认密码" id="confirmPassword" v-model="confirmPassword" 
                    :append-icon="hideConfirmPwd ? 'visibility_off' : 'visibility'" :append-icon-cb="() => (hideConfirmPwd = !hideConfirmPwd)"
                    :type="hideConfirmPwd ? 'password' : 'text' " :rules="confirmPasswordRules">
                  </v-text-field>
                  <v-text-field prepend-icon="phone" name="phone" label="手机号" id="phone" v-model="phone" :rules="phoneRules"></v-text-field>
                </v-form>
                <v-alert v-model="errorAlert" type="error" transition="scale-transition" dismissible >
                  {{ registerMsg }}
                </v-alert>
                <v-alert :value="successAlert" type="success" transition="scale-transition">
                  {{ registerMsg }}
                </v-alert>
              </v-card-text>
              <v-card-actions>
                <v-container grid-list-md text-xs-center>
                  <v-layout row wrap>
                    <v-flex xs10 sm10 md10 offset-xs1>
                      <v-btn block color="primary" @click="register" :disabled="!valid" :loading="loading">注册</v-btn>
                    </v-flex>
                    <v-flex xs10 sm10 md10 offset-xs1>
                      <v-btn block flat small color="error" to="/">已有账号登录？</v-btn>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
  export default {
    data: () => ({
      drawer: null,
      valid: false,
      loading: false,
      errorAlert: false,
      successAlert: false,
      registerMsg: '',
      username: "",
      usernameRules: [
        v => !!v || '用户名不能为空！',
        v => (v && v.length <= 13) || '用户名不能超过13个字！'
      ],
      password: "",
      passwordRules: [ v => !!v || '密码不能为空！' ],
      confirmPassword: "",
      confirmPasswordRules: [ 
        v => !!v || '密码不能为空！',
        v => (v == password.value) || '两次输入的密码不一致！' 
        // function(v) {
        //   return password.value
        // }
      ],
      hidePwd: true,
      hideConfirmPwd: true,
      phone: "",
      phoneRules: [
        v => !!v || '电话不能为空',
        v => /^1\d{10}$/.test(v) || '手机号不否和规则！'
      ]
    }),
    props: {
      source: String
    },
    methods: {
        register() { 
          this.valid = false;
          this.loading = true;
          if (this.$refs.registerForm.validate()) {
            this.$http.post("/register", { 
              "username": this.username, "password": this.password,
              "phone": this.phone,
              "role": { "roleName": "user", "roleDescribe": "普通用户" }
            })  
            // this.$http.post("/api/register", { 
            //   "username": this.username, "password": this.password,
            //   "phone": this.phone,
            //   "role": { "roleName": "user", "roleDescribe": "普通用户" }
            // })                   
            .then(res => {
                console.log(res.data);
                if (res.data.isRegister) { // 注册成功，跳转到登录界面
                  this.successAlert = true;
                  this.registerMsg = res.data.msg;
                  setTimeout(() => {
                    this.successAlert = false;
                    this.$router.push("/");
                  },2000)
                  
                } else { // 注册失败，提示失败原因
                  this.errorAlert = true;
                  this.loading = false;
                  this.valid = true;
                  this.registerMsg = res.data.msg;
                }
            })
          }    
        }
        
    }
  }
</script>