<style lang="scss" scoped>
.coin-name {
  overflow: hidden;
}
.coin-logo {
  float: left;
  display: block;
  height: $base-font-size*$base-line-height;
  width: auto;
  margin-right: $gutter;
}
</style>

<template>
  <div>
    <section class="sml-pad-y3 med-pad-y6 fill-top">
      <div class="wrapper">
        <div class="row text-center">
          <div class="sml-c12 lrg-c8 grid-center">
            <h1>
              Donate Cryptocurrency for Net Neutrality
            </h1>
          </div> <!-- .c -->
        </div> <!-- .row -->
      </div> <!-- .wrapper -->
    </section>

    <section id="crypto" class="sml-pad-y3 med-pad-y6">
      <div class="wrapper">
        <div class="row">
          <div class="sml-c12 lrg-c8 grid-center">
            <h2 class="section-title text-center">
              Choose a cryptocurrency
            </h2>
            <p class="sml-push-y2 med-push-y3 text-center">
              Donations let us keep expanding the Internet&rsquo;s power for
              good, through our work defending net neutrality and fighting mass
              surveillance by governments and corporations. We happily accept
              all cryptocurrencies below. Note that it may not be possible to
              give small donations because of high transaction fees, though
              that depends on the currency used.
              <a @click.prevent="scrollTo('#faq')">Frequently Asked Questions</a>
            </p>

            <div v-if="currencies">
              <div v-for="c in currencies" :key="`c-${c.name}`" class="sml-push-y3">
                <p class="coin-name">
                  <img :src="c.logo" :alt="`${c.name}-logo`" class="coin-logo" />
                  {{ c.name }} ({{ c.code }})
                </p>
                <form v-if="c.address" class="sml-push-y1">
                  <input type="text" :value="c.address"/>
                </form>
                <p v-if="c.note" class="sml-push-y1 text-warn">{{ c.note }}</p>
                <form v-if="c.fields">
                  <div v-for="field in c.fields" :key="`c-${c.name}-${field.value}`">
                    <label class="sml-push-y1">{{ field.name }}</label>
                    <input type="text" :value="field.value"/>
                  </div>
                </form>
              </div> <!-- v-for -->
            </div> <!-- v-if -->
          </div> <!-- .c -->
        </div> <!-- .row -->
      </div> <!-- .wrapper -->
    </section>

    <section id="faq" class="sml-pad-y3 med-pad-y6 fill-grey-dark">
      <div class="wrapper">
        <div class="row">
          <div class="sml-c12 lrg-c8 grid-center">
            <h2 class="section-title text-center">FAQ</h2>
            <dl class="sml-push-y3">
              <dt class="sml-push-y2">
                <strong>Why can&rsquo;t I make a small donation?</strong>
              </dt>
              <dd>
                The Bitcoin network requires transaction fees that can be very high.
                Small donations may be better sent through Litecoin or Ethereum, which
                have significantly lower fees.
              </dd>
              <dt class="sml-push-y2">
                <strong>Is this donation tax deductible?</strong>
              </dt>
              <dd>
                It&rsquo;s not. Donations to our 501(c)(3),
                <a href="https://www.fftfef.org/">Fight for the Future Education Fund</a>,
                are tax deductible and if you are a U.S. taxpayer, donating with
                cryptocurrency may also be tax-free (if you donate in the original
                asset, you may not pay gains on that donation, but we recommend you
                check with an accountant on the specifics). If you&rsquo;re interested
                in making a cryptocurrency donation to FFTFEF, please
                <a href="https://donate.fftfef.org/cryptocurrency/">click here</a>.
              </dd>
              <dt class="sml-push-y2">
                <strong>How do I know this is your address?</strong>
              </dt>
              <dd>
                We&rsquo;re paying close attention to the integrity of this page, so
                copying and pasting should be fine. But if you&rsquo;re planning a very
                large donation and would like to verify the address, feel free to
                <a href="mailto:donor@fightforthefuture.org">contact us</a>.
              </dd>
            </dl>
          </div> <!-- .c -->
        </div> <!-- .row -->
      </div> <!-- .wrapper -->
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import config from '~/config'
import { createMetaTags, smoothScrollToElement } from '~/assets/js/helpers'

export default {
  head() {
    return {
      title: config.sharing.title,
      meta: createMetaTags({
        title: config.sharing.title,
        description: config.sharing.description,
        image: config.sharing.image,
        url: config.sharing.url
      })
    }
  },

  async asyncData() {
    let currencies = []
    try {
      const { data } = await axios.get('https://data.battleforthenet.com/crypto/fftf.json')

      currencies = data
    }
    catch (error) {
      //
    }
    return {
      currencies: currencies
    }
  },

  methods: {
    scrollTo(hash) {
      const duration = 500
      smoothScrollToElement(hash, duration)
      setTimeout(() => {
        location.hash = hash
      }, duration)
    }
  }
}
</script>
