<style lang="scss" scoped>
.StripeElement {
  background-color: $white;
  padding: ($gutter + 4) $gutter*2 ($gutter + 5);
  border-radius: $default-border-radius;
  border: 1px solid $white;
}
.StripeElement--focus {
  border-color: $brand-color;
}
.StripeElement--invalid {
  border-color: $warn-color;
}
</style>

<template>
  <div class="sml-pad-2 med-pad-3 with-border is-rounded fill-grey-dark sml-push-y2 med-push-y3">
    <div v-if="!hasSubmitted">
      <div v-show="!amount">
        <h4>Choose an amount to donate:</h4>
        <form @submit.prevent="setAmount" class="row">
          <div v-for="option in donationAmounts" :key="`donate-${option}`"
               class="sml-c6 med-c4 lrg-c3 sml-push-y1 med-push-y2">
            <div class="faux-btn">
              <input type="radio" :id="`option-${option}`" :value="option"
                     v-model="tmpAmount">
              <label :for="`option-${option}`">${{ option }}</label>
            </div> <!-- .faux-btn -->
          </div> <!-- .c -->

          <div class="sml-c6 med-c4 lrg-c3 sml-push-y1 med-push-y2">
            <div class="faux-btn">
              <label class="with-input" :class="{'faux-selected': isOtherAmountSelected}">
                <span>$</span><input type="number" v-model="tmpAmount">
              </label>
            </div> <!-- .faux-btn -->
          </div> <!-- .c -->

          <div class="sml-c6 med-c4 lrg-c3 sml-push-y1 med-push-y2">
            <button class="btn btn-sml btn-block">Choose</button>
          </div> <!-- .c -->
        </form>
      </div>

      <div v-show="amount">
        <div class="fill-brand sml-pad-1 sml-pad-x2 is-rounded text-left">
          <div class="flex-row flex-center">
            <h3>${{ amount }}</h3>
            <div class="text-right">
              <a @click="changeAmount" class="link-light">Edit</a>
            </div>
          </div>
        </div> <!-- fill -->

        <h4 class="sml-push-y2 med-push-y3">Pay with credit card:</h4>
        <p class="text-warn sml-push-y1" v-if="errorMessage">
          {{ errorMessage }}
        </p>
        <form @submit.prevent="submitDonation()">
          <input v-model="email" type="email" placeholder="Email*"
                 class="sml-push-y1" required>

          <div ref="card" class="sml-push-y1"></div>

          <button class="btn btn-block sml-push-y1" :disabled="isSending">
            <span v-if="isSending">
              Sending...
            </span>
            <span v-else>
              Submit Donation
            </span>
          </button>
        </form>

        <h4 class="sml-push-y2 med-push-y3">Or use one of these methods:</h4>
        <div class="flex-row sml-push-y1">
          <a class="btn btn-sml">Paypal</a>
          <a class="btn btn-sml">Apple or Google Pay</a>
        </div>
      </div> <!-- v-if amount -->
    </div> <!-- v-if hasSumbitted -->

    <div v-if="hasSubmitted" class="text-center sml-push-y2 med-push-y3">
      <h4 class="text-success">
        Thank you for your important donation! Will you share this page on
        social media to encourage others to help out?
      </h4>
      <div class="row sml-push-y2 med-push-y3">
        <div class="sml-c12 lrg-c6">
          <ShareButton
              network="twitter"
              @click.native="$trackClick('twitter_share_button_success')"
              class="btn-block">
            <span>Tweet</span>
          </ShareButton>
        </div> <!-- .c -->
        <div class="sml-c12 lrg-c6 sml-push-y1 lrg-push-y0">
          <ShareButton
              network="facebook"
              @click.native="$trackClick('facebook_share_button_sucess')"
              class="btn-block">
            <span>Share</span>
          </ShareButton>
        </div> <!-- .c -->
      </div> <!-- .row -->
    </div> <!-- v-if -->
  </div>
</template>

<script>
import axios from 'axios'
import ShareButton from '~/components/ShareButton'

// Create empty Stripe Elements variables
let stripe = null,
    elements = null,
    card = null

export default {
  components: {
    ShareButton
  },

  head() {
    return {
      script: [
        { src: 'https://js.stripe.com/v3/' }
      ]
    }
  },

  data() {
    return {
      isSending: false,
      hasSubmitted: false,
      errorMessage: null,
      // form fields
      email: null,
      tmpAmount: null,
      amount: null,
      token: null
    }
  },

  computed: {
    donationAmounts () { return this.$store.state.donationAmounts },
    isOtherAmountSelected () {
      return this.tmpAmount && !this.donationAmounts.includes(this.tmpAmount)
    }
  },

  mounted() {
    this.setupStripe()
  },

  methods: {
    setupStripe() {
      stripe = Stripe(process.env.stripeApiKey)
      elements = stripe.elements()
      card = null
      let formStyle = {
        base: {
          border: '1px solid #FFF',
          background: '#FFF',
          borderRadius: '5px',
          color: "#201B2C",
          fontSize: '16px',
          fontFamily: "'Open Sans', sans-serif",
          '::placeholder': {
            color: '#515E77',
          },
          padding: '10px'
        },
        invalid: {
          color: '#FF4A4A',
          ':focus': {
            color: '#201B2C',
          },
        }
      }

      // Create and mount a new Stripe CC form
      card = elements.create('card', {style: formStyle});
      card.mount(this.$refs.card);
    },

    setAmount() {
      this.amount = this.tmpAmount
    },

    changeAmount() {
      this.amount = null
    },

    async submitDonation() {
      if (this.isSending) return

      this.isSending = true
      this.$trackEvent('stripe_donation_cc_form', 'submit')

      this.getCardToken()

      // TODO: Create charge
      // self.$trackEvent('stripe_donation_form', 'success')
      // self.isSending = false
      // self.hasSubmitted = true
    },

    async getCardToken() {
      let self = this
      stripe.createToken(card).then(function(result) {
        if (result.error) {
          self.isSending = false
          self.errorMessage = result.error.message
          self.$forceUpdate()
        } else {
          // TODO: test success
          console.log(result)
          console.log(result.token)
          self.token = result.token
        }
      })
    },
  }
}
</script>
