<style lang="scss" scoped>
$bar-height: $gutter*2;

.progress {
  position: relative;
  width: 100%;
  height: $bar-height;
  background: transparentize($white, 0.8);
  border-radius: $bar-height;
}
.progress .progress-bar {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  max-width: 100%;
  background-color: $brand-color;
  border-top-left-radius:    $bar-height;
  border-bottom-left-radius: $bar-height;
  text-indent: 9999em;
}
.progress .progress-bar.percent-100 {
  border-top-right-radius:    $bar-height;
  border-bottom-right-radius: $bar-height;
}
</style>

<template>
  <div>
    <div class="row">
      <h4 class="sml-c6 text-left">{{ numToUSD(currentTotal) }} Raised</h4>
      <h4 class="sml-c6 text-right">{{ numToUSD(goalTotal) }} Goal</h4>
    </div> <!-- .row -->
    <div class="progress">
      <div class="progress-bar"
           :class="[{ 'percent-100': percent >= 100 }]"
           :style="{width: `${percent}%`}">
        {{ percent }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentTotal: {
      type: Number,
      default: 0
    },
    goalTotal: {
      type: Number,
      default: 0
    }
  },

  computed: {
    percent() { return this.currentTotal/this.goalTotal*100 }
  },

  methods: {
    numToUSD(val) {
      // NOTE: Move to a filter if used in more than one component
      let dollars = (val/1).toFixed(0)
      return `$${dollars.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
    }
  }
}
</script>
