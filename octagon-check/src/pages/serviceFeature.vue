<template>
  <q-page class="row">
    <q-card inline class="col-xs-12">
      <q-card-media>
        <q-carousel
          color="white"
          arrows
          quick-nav
          quick-nav-icon="favorite"
          infinite
          autoplay
          height="170px"
        >
          <q-carousel-slide img-src="statics/banner01.jpg" />
          <q-carousel-slide img-src="statics/banner02.jpg" />
        </q-carousel>
      </q-card-media>
      <q-card-title>
        服务特色:
      </q-card-title>
      <q-card-main></q-card-main>
    </q-card>
  </q-page>
</template>
