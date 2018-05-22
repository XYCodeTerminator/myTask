<template>
  <q-page padding>
    <!-- content -->
    <div class="row justify-center">
      <q-input class="col-xs-11 q-mb-md" v-model="name" float-label="姓名" placeholder="请输入姓名" :before="[{icon: 'person'}]" />
      <q-input class="col-xs-11 q-mb-md" v-model="phone" float-label="手机号" placeholder="请输入手机号" :before="[{icon: 'phone'}]" />
      <q-input class="col-xs-11 q-mb-lg" v-model="plateNum" float-label="车牌号" placeholder="请输入车牌号" :before="[{icon: 'drive_eta'}]" />
      <q-uploader class="col-xs-11 q-mb-lg" multiple stack-label="图片上传" auto-expand url="upload" @add="addFile" @finish="finishUpload"/>  
      <q-btn :loading="btnLoading" color="positive" class="col-xs-11 full-width" size="16px" @click="register" label="登记" />
    </div>
    
  </q-page>
</template>

<script>
export default {
  // name: 'PageName',
  data: () => ({
    name: '',
    phone: '',
    plateNum: '',
    files: [],
    btnLoading: false
  }),
  methods: {
    finishUpload(op) {
      console.log('finishUpload: ', op);
    },
    addFile(files) {
      console.log('files: ', files);
    },
    register() {
      this.btnLoading = true;
      this.$http.post(
        'register', 
        { 
          "name": this.name, 
          "phone": this.phone,
          "plateNum": this.plateNum,
          "files": this.files
        } 
      )
      .then(res => {
        // this.btnLoading = false;
      })
      .catch(err => {
        // this.btnLoading = false;
      })
    }
  }
}
</script>

<style>
</style>
