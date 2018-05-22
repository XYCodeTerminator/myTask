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
                <v-form v-model="valid" ref="loginForm" lazy-validation>
                  <v-text-field prepend-icon="person" name="login" label="用户名" type="text" v-model="username" :rules="usernameRules"></v-text-field>
                  <v-text-field prepend-icon="lock" name="password" label="密码" id="password" v-model="password"  
                    :append-icon="hidePwd ? 'visibility_off' : 'visibility'" :append-icon-cb="() => (hidePwd = !hidePwd)"
                    :type="hidePwd ? 'password' : 'text' " :rules="passwordRules">   
                  </v-text-field>             
                </v-form>
                <v-alert v-model="errorAlert" type="error" transition="scale-transition" dismissible >
                  {{ loginMsg }}
                </v-alert>
              </v-card-text>
              <v-card-actions>
                <!-- <v-btn block color="primary" @click="login">登录</v-btn> -->
                <!-- <v-spacer></v-spacer> -->
                <v-container grid-list-md text-xs-center>
                  <v-layout row wrap>
                    <v-flex xs10 sm10 md10 offset-xs1>
                      <v-btn block color="primary" @click="login" :disabled="!valid">登录</v-btn>
                    </v-flex>
                    <v-flex xs10 sm10 md10 offset-xs1>
                      <v-btn block flat small color="error" to="/register">没有账号注册？</v-btn>
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-card-actions>
              <v-progress-linear :indeterminate="true" :active="showProgress"></v-progress-linear>
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
      errorAlert: false,
      showProgress: false,
      loginMsg: '',
      username: "",
      usernameRules: [ 
        v => !!v || '用户名不能为空！'
      ],
      password: "",
      passwordRules: [ v => !!v || '密码不能为空!'],
      hidePwd: true
    }),
    props: {
      source: String
    },
    beforeCreate() {
      this.$http.get('/verify')
      // this.$http.get('/api/verify')
      .then(res => {
        if (res.data.isLogin) {
          this.$router.push('/main/bookDisplay');
        }
      })
      .catch(err => {
        console.log(err);
      })
    },
    methods: {
        login() {
            this.valid = false;
            if (this.$refs.loginForm.validate()) {
              this.showProgress = true;
              this.$http.post("/login", { "username": this.username, "password": this.password }) 
              // this.$http.post("/api/login", { "username": this.username, "password": this.password })                   
              .then(res => {
                  // console.log(res.data);
                  this.showProgress = false;
                  if (res.data.isLogin) { // 登录成功
                    this.$router.push("/main/bookDisplay");
                  } else { // 登录失败
                    this.errorAlert = true;
                    this.loginMsg = res.data.msg;
                    this.valid = true;
                  }
              })
              .catch(err => {
                console.log(err);
                this.showProgress = false;
              })
          }
        }
    }
  }






  // // 强制转换为Boolean 用 !!
  // var bool = !!"c";
  // console.log(typeof bool); // boolean

  // // 强制转换为Number 用 +
  // var num = +"1234";
  // console.log(typeof num); // number

  // // 强制转换为String 用 ""+
  // var str = ""+ 1234;
  // console.log(typeof str); // string
</script>