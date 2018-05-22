<template>
  <div class="row">
    <baidu-map class="col-xs-12 window-height" :center="center" :zoom="zoom" @ready="handler"> 
      <bm-marker v-if="showDest" :position="center" :dragging="true"></bm-marker>
      <bm-scale anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-scale>
      <bm-geolocation anchor="BMAP_ANCHOR_TOP_RIGHT" :autoLocation="true" :showAddressBar="false" @locationSuccess="loctionSuccess"></bm-geolocation>
      <bm-driving
        :start="startPoint"
        :end="center"
        :auto-viewport="true"
      >
      </bm-driving>
      <bm-control>
        <q-btn color="positive" fab-mini class="q-ma-sm" size="xs" icon="navigation" @click="navigate" />
      </bm-control>
    </baidu-map>
  </div>
  
</template>

<script>
export default {
  data: () => ({
    center: { lng: 121.128602, lat: 37.629496 },
    startPoint: {},
    tempStartPoint: {},
    zoom: 17,
    showDest: true
  }),
  methods: {
    // locationSuccess(point) {
    //   console.log(point);
    //   this.startPoint = point.point;
    //   this.showDest = false;
    // }
    handler({BMap, map}) {
      var geolocation = new BMap.Geolocation();
      geolocation.getCurrentPosition((position) => {
        // console.log(position);
        this.tempStartPoint = position.point;
      },{enableHighAccuracy: true})
    },
    navigate() {
      this.startPoint = this.tempStartPoint;
      this.showDest = false;
    },
    loctionSuccess(location) {
      // console.log(location);
      this.tempStartPoint = location.point;
    }
  }
}
</script>


<style>

</style>