<style lang="scss" scoped>
// Transition
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

// Quotes
.quotes-wrapper {
  // NOTE: Magic numbers. Update them based on the height of the longest quote.
  min-height: 650px;

  @include respond-to(med) {
    min-height: 400px;
  }

  @include respond-to(lrg) {
    min-height: 300px;
  }
}

// Arrows
.arrow {
  display: flex;
  flex: 0 0 30px;
  height:   30px;
  width:    30px;
  background: $grey-color;
  border: none;
  color: $white;
  border-radius: 100%;
  cursor: pointer;

  @include respond-to(med) {
    flex: 0 0 50px;
    height:   50px;
    width:    50px;
  }
}
.arrow:hover,
.arrow:focus {
  background: $brand-dark-color;
}
.arrow img {
  width: 15px;
  height: auto;

  @include respond-to(med) {
    width: 25px;
  }
}
</style>

<template>
  <div class="quotes-wrapper flex-row flex-center">
    <a class="arrow" @click.prevent="prev">
      <img src="~assets/images/arrow-left.svg" alt="Previous" class="grid-center"/>
    </a>
    <transition name="fade" mode="out-in">
      <div :key="`slide-${activeSlide}`">
        <blockquote>&ldquo;{{ quotes[activeSlide].text }}&rdquo;</blockquote>
        <p class="text-brand">
          <strong>— {{ quotes[activeSlide].source }}</strong>&nbsp;
          <a v-if="quotes[activeSlide].link === 'vets'"
             href="https://www.vetsforthe.net/"
             target="_blank">from Vets for the Net</a>
          <a v-if="quotes[activeSlide].link === 'fr'"
             href="https://www.firstrespondersfornetneutrality.com/"
             target="_blank">from First Responders for Net Neutrality</a>
          <a v-if="quotes[activeSlide].link === 'biz'"
             href="https://www.businessesfornetneutrality.com/"
             target="_blank">from Businesses for Net Neutrality</a>
        </p>
      </div>
    </transition>
    <a class="arrow" @click.prevent="next">
      <img src="~assets/images/arrow-right.svg" alt="Next" class="grid-center"/>
    </a>
  </div> <!-- .quotes-wrapper -->
</template>

<script>
import quotes from '~/assets/data/quotes.json'

export default {
  computed: {
    quotes() { return quotes }
  },

  data () {
    return {
      activeSlide: 0
    }
  },

  methods: {
    next() {
      if (this.activeSlide < this.quotes.length - 1) {
        this.activeSlide++
      } else {
        this.activeSlide = 0
      }
    },

    prev() {
      if (this.activeSlide > 0) {
        this.activeSlide--
      } else {
        this.activeSlide = this.quotes.length - 1
      }
    }
  }
}
</script>
