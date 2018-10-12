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
  <div>
    <div class="sml-push-y2 med-push-y3" v-if="!hasSubmitted">
      <p class="text-warn" v-if="errorMessage">
        {{ errorMessage }}
      </p>

      <div class="flex-row sml-push-y1">
        <div ref="card" class="sml-flex-3 med-flex-4"></div>
        <button class="btn btn-sml" @click="submitForm">
          <span v-if="isSending">
            Sending...
          </span>
          <span v-else>
            Submit
          </span>
        </button>
      </div> <!-- .flex-row -->
    </div> <!-- v-if -->

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
      errorMessage: null
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

    async submitForm() {
      if (this.isSending) return

      this.isSending = true
      this.$trackEvent('stripe_donation_form', 'submit')

      // Send Credit Card donation to stripe
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
          self.$trackEvent('stripe_donation_form', 'success')
          self.isSending = false
          self.hasSigned = true
        }
      })
    },
  }
}
</script>
