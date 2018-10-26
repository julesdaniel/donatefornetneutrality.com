<style lang="scss" scoped>
// Stripe element
.stripe-cc-form {
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

// Transition Animation
.amount-animation-container {
  min-height: $base-font-size * $base-line-height * 2;

  @include respond-to(lrg) {
    min-height: $base-font-size * $base-line-height;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity .5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.btn-paypal {
  background: #fff;
  animation: none;
  padding: 6px 10px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  max-width: 50%;

  img {
    height: 24px;
  }
}
</style>

<template>
  <div class="sml-pad-2 med-pad-3 with-border is-rounded fill-grey-dark sml-push-y2 med-push-y3">
    <div v-if="!hasSubmitted">
      <div v-show="!amount">
        <h4>Choose an amount to donate:</h4>
        <form @submit.prevent="setAmount">
          <div class="row">
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
          </div> <!-- .row -->

          <div class="amount-animation-container sml-push-y1 med-push-y2">
            <transition name="fade" appear>
              <p class="" v-if="tmpAmount">
                Your ${{tmpAmount}} donation + ${{tmpAmount}} matching donation =
                <span class="text-success">${{animatedAmount*2}} total donation</span>
              </p>
            </transition>
          </div> <!-- .amount-animation-container -->

          <div class="sml-push-y1 med-push-y2">
            <button class="btn btn-sml btn-block">
              Donate
            </button>
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

        <div class="checkbox sml-push-y1 text-left" v-if="canRecur">
          <input type="checkbox" id="is-recurring" v-model="isRecurring">
          <label for="is-recurring">
            Make this a monthly recurring contribution?
          </label>
        </div>

        <h4 class="sml-push-y2 med-push-y3">Pay with credit card:</h4>
        <p class="text-warn sml-push-y1" v-if="errorMessage">
          {{ errorMessage }}
        </p>

        <form @submit.prevent="submitStripeForm()">
          <div class="flex-row sml-flex-col med-flex-row">
            <input v-model="email" type="email" placeholder="Email*"
                   class="sml-push-y1" required>
            <input v-model="name" type="text" placeholder="Name"
                   class="sml-push-y1">
          </div> <!-- .flex-row -->

          <div ref="card" class="stripe-cc-form sml-push-y1"></div>

          <button class="btn btn-block sml-push-y1" :disabled="isSending">
            <span v-if="isSending">
              Processing...
            </span>
            <span v-else>
              Submit Donation
            </span>
          </button>

          <div class="checkbox sml-push-y1 text-left">
            <input type="checkbox" id="is-subscribing" v-model="isSubscribing">
            <label for="is-subscribing">
              Yes, I want to receive important emails about Net Neutrality
              campaigns.
            </label>
          </div> <!-- .checkbox -->
        </form>

        <h4 class="sml-push-y2 med-push-y3">Or pay with:</h4>
        <div class="flex-row sml-push-y1">
          <a class="btn btn-sml btn-paypal" href="#" @click.prevent="submitPaypalForm()"><img src="~/assets/images/paypal-btn.png" alt="PayPal"></a>
          <div v-if="canMakePayment" ref="paymentRequestBtn"></div>
        </div> <!-- .flex-row -->

        <form class="is-hidden" ref="paypalOneTime" action="https://www.paypal.com/cgi-bin/webscr" method="post">
          <input type="hidden" name="business" :value="paypalEmail">
          <input type="hidden" name="cmd" value="_donations">
          <input type="hidden" name="item_name" :value="donationDescription">
          <input type="hidden" name="item_number" value="">
          <input type="hidden" name="currency_code" value="USD">
          <input type="hidden" name="amount" :value="amount">
          <input type="hidden" name="no_shipping" value="1">
          <img alt="" border="0" width="1" height="1" src="https://www.paypal.com/en_US/i/scr/pixel.gif">
          <input type="hidden" name="return" :value="paypalReturnUrl">
        </form>

        <form class="is-hidden" ref="paypalRecurring" name="_xclick" action="https://www.paypal.com/cgi-bin/webscr" method="post">
          <input type="hidden" name="cmd" value="_xclick-subscriptions">
          <input type="hidden" name="business" :value="paypalEmail">
          <input type="hidden" name="item_name" :value="donationDescription">
          <input type="hidden" name="return" :value="paypalReturnUrl">
          <input type="hidden" name="item_number" value="">
          <input type="hidden" name="currency_code" value="USD">
          <input type="hidden" name="no_shipping" value="1">
          <input type="hidden" name="a3" :value="amount">
          <input type="hidden" name="p3" value="1">
          <input type="hidden" name="t3" value="M">
          <input type="hidden" name="src" value="1">
          <input type="hidden" name="sra" value="1">
        </form>

      </div> <!-- v-if amount -->
    </div> <!-- v-if hasSumbitted -->

    <div v-if="hasSubmitted" class="text-center">
      <h3 class="text-success">
        Thank you for your important donation!
      </h3>
      <p class="sml-push-y1">
        Will you share this page on social media to encourage others to help out?
      </p>
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
import { mapState, mapGetters } from 'vuex'
import axios from 'axios'
import { pingCounter } from '~/assets/js/helpers'
import ShareButton from '~/components/ShareButton'
import { TweenLite } from 'gsap'

// Create empty Stripe Elements variables
let stripe = null,
    elements = null,
    card = null,
    paymentRequest = null,
    paymentRequestBtn = null

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
      canMakePayment: false,
      // form fields
      email: null,
      name: null,
      tmpAmount: 0,
      amount: null,
      isSubscribing: true,
      token: null,
      isRecurring: false,
      // animation
      tweenedAmount: 0
    }
  },

  computed: {
    ...mapState([
      'donationAmounts',
      'defaultDonation',
      'testVariant',
      'donationDescription',
      'paypalEmail',
      'paypalReturnUrl'
    ]),

    ...mapGetters(['testVariantName']),

    isOtherAmountSelected () {
      return this.tmpAmount && !this.donationAmounts.includes(this.tmpAmount)
    },
    stripeAmount() {
      return this.amount * 100
    },
    animatedAmount() {
      return this.tweenedAmount.toFixed(0);
    },
    canRecur() {
      return this.donationAmounts.includes(this.amount)
    }
  },

  watch: {
    tmpAmount(newValue) {
      TweenLite.to(this.$data, 0.7, { tweenedAmount: newValue });
    }
  },

  created() {
    if (this.$store.state.hasAlreadyDonated) {
      this.hasSubmitted = true
    }
  },

  mounted() {
    this.setupStripe()
    this.tmpAmount = this.defaultDonation
  },

  methods: {
    setupStripe() {
      if (!this.$refs.card) return

      stripe = Stripe(process.env.STRIPE_API_KEY)
      elements = stripe.elements()
      card = null

      const formStyle = {
        base: {
          color: "#201B2C",
          fontSize: '16px',
          fontFamily: "'Open Sans', sans-serif",
          '::placeholder': {
            color: '#515E77',
          }
        },
        invalid: {
          color: '#FF4A4A',
          ':focus': {
            color: '#201B2C',
          },
        }
      }

      // Create and mount a new Stripe CC form
      card = elements.create('card', {style: formStyle})
      card.mount(this.$refs.card)
    },

    async setupStripePaymentRequest() {
      return // DISABLED FOR NOW

      if (paymentRequest) {
        return paymentRequest.update({
          total: {
            label: this.$store.state.donationDescription,
            amount: this.stripeAmount
          }
        })
      }

      paymentRequest = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: this.$store.state.donationDescription,
          amount: this.stripeAmount,
        },
        requestPayerName: true,
        requestPayerEmail: true
      })

      paymentRequestBtn = elements.create('paymentRequestButton', {
        paymentRequest: paymentRequest,
      })

      const result = await paymentRequest.canMakePayment()

      if (result) {
        paymentRequestBtn.mount(this.$refs.paymentRequestBtn)
      }
      else {
        this.canMakePayment = false
      }
    },

    setAmount() {
      this.amount = this.tmpAmount
      this.setupStripePaymentRequest()

      if (!this.canRecur) {
        this.isRecurring = false
      }

      pingCounter(`${this.testVariantName}_donate_click_${this.amount}`)
    },

    changeAmount() {
      this.amount = null
    },

    async submitStripeForm() {
      if (this.isSending) return

      this.isSending = true
      this.$trackEvent('stripe_donation_form', 'submit')
      pingCounter(`${this.testVariantName}_donate_submit_${this.amount}`)

      try {
        await this.createStripeCharge()
        this.hasSubmitted = true
      }
      catch (error) {
        this.errorMessage = `${error.message}  🙁`
      }

      this.isSending = false
    },

    async createStripeCharge() {
      const { token, error } = await stripe.createToken(card)

      if (error) {
        throw new Error(error.message)
      }

      try {
        const { data } = await axios.post(`${process.env.PAYMENTS_API_URL}stripe`, {
          amount: this.stripeAmount,
          token: token.id,
          email: this.email,
          name: this.name ? this.name : '',
          receive_emails: this.isSubscribing,
          description: this.$store.state.donationDescription,
          fundraiser_id: this.$store.state.actionNetworkFundraiserId,
          action_network_tags: this.$store.state.actionNetworkTags,
          donation_tag: this.$route.query.tag || this.$store.state.defaultDonationTag,
          frequency: this.isRecurring ? 'monthly' : 'once'
        })

        this.$trackEvent('stripe_donation', 'success', this.stripeAmount)
        pingCounter(`${this.testVariantName}_donate_success_${this.amount}`)
      }
      catch (error) {
        let errorMessage

        if (error.response && error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error
        }
        else {
          errorMessage = "Couldn't connect to payment processor"
        }

        throw new Error(errorMessage)
      }
    },

    submitPaypalForm() {
      const ref = this.isRecurring ? 'paypalRecurring' : 'paypalOneTime'
      const form = this.$refs[ref]
      this.isSending = true
      this.$trackEvent(`${ref}_form`, 'submit')
      pingCounter(`${this.testVariantName}_${ref}_submit_${this.amount}`)
      form.submit()
    }
  }
}
</script>
