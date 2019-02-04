<style lang="scss" scoped>
.logos {
  display: grid;
  grid-gap: $gutter;
  grid-template-columns: repeat(2, 48.5%);

  img {
    max-height: 59px;
  }

  @include respond-to(med) {
    grid-gap: $gutter * 1.5;
    grid-template-columns: repeat(3, 31.5%);

    img {
      max-height: 74px;
    }
  }
}
</style>

<template>
  <div>
    <div class="logos">
      <div class="fill-white is-rounded sml-pad-1" v-for="logo in logos" :key="logo.image">
        <img :src="logo.image" :alt="logo.name" class="grid-center">
      </div>
    </div>
  </div>
</template>

<script>
import logos from '~/data/logos'

export default {
  computed: {
    logos: () => logos
  }
}
</script>
