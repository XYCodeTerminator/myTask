<template>
  <q-page padding>
    <!-- content -->
    <div class="row justify-center">
      <q-input class="col-xs-11 q-mb-md" v-model="name" float-label="联系人" placeholder="请输入联系人" :before="[{icon: 'person'}]" />
      <q-input class="col-xs-11 q-mb-md" v-model="phone" float-label="手机号" placeholder="请输入手机号" :before="[{icon: 'phone'}]" />
      <q-input class="col-xs-11 q-mb-lg" v-model="plateNum" float-label="车牌号" placeholder="请输入车牌号" :before="[{icon: 'drive_eta'}]" />
      <q-select 
        class="col-xs-11 q-mb-lg"
        v-model="orderType"
        float-label="预约类型"
        :options="selectOptions"
        :before="[{icon: 'format_list_bulleted'}]"
        clearable
      />
      <q-datetime 
        class="col-xs-11 q-mb-lg" clearable 
        float-label="预约时间" v-model="orderDate" 
        type="datetime" :before="[{icon: 'date_range'}]" 
        :first-day-of-week="1" color="light-blue"
      />
      <div class="row q-mb-lg gutter-xl">
        <q-radio class="col" v-model="paymentMethod" val="网上缴费" color="amber" left-label label="网上缴费" />
        <q-radio class="col" v-model="paymentMethod" val="现场缴费" color="amber" left-label label="现场缴费" />
      </div>
      
      <q-btn :loading="btnLoading" color="positive" class="col-xs-11 full-width" size="17px" @click="order" label="预约" />
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
    orderType: '',
    selectOptions: [
      { label: '小型车年审预约', value: '小型车年审预约' },
      { label: '大型车年审预约', value: '大型车年审预约' },
      { label: '新车挂牌预约', value: '新车挂牌预约' }
    ],
    orderDate: null,
    paymentMethod: '',
    btnLoading: false
  }),
  methods: {
    order() {
      // console.log(this.date);
      if (this.paymentMethod == '网上缴费') {
        // this.$http.post(
        //   'order',
        //   {
        //     "name": this.name,
        //     "phone": this.phone,
        //     "plateNum": this.plateNum,
        //     "orderType": this.orderType,
        //     "date": this.date,
        //     "paymentMethod": this.paymentMethod
        //   }
        // )
        // .then(res => {

        // })
        // .catch(err => {

        // })
        this.$q.notify({
          message: `预约失败！请重新预约`,
          timeout: 1000,
          type: 'negative',
          color: 'negative',
          icon: 'sentiment_very_dissatisfied',
          position: 'center'
        });
      } else if (this.paymentMethod == '现场缴费') {
        this.$router.push('orderRecord');
      }
    }
  }
}
</script>

<style>
</style>
