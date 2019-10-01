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
    height: 26px;
  }
}
.link-coin-icon {
  display: inline-block;
  border-bottom: none;
}
.link-coin-icon img {
  display: inline-block;
  height: $base-font-size*$base-line-height;
  width: auto;
  padding-right: $gutter;
  vertical-align: bottom;
}
.link-coin-icon span {
  display: inline-block;
  border-bottom: 1px solid $white;
}
</style>

<template>
  <div class="sml-pad-2 med-pad-3 with-border is-rounded sml-push-y2 med-push-y3">
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
              <p v-if="tmpAmount">
                <strong>
                  Your ${{tmpAmount}} donation + ${{tmpAmount}} matching donation =
                  <span class="text-success">${{animatedAmount*2}} total donation</span>
                </strong>
              </p>
            </transition>
          </div> <!-- .amount-animation-container -->

          <div class="sml-push-y1 med-push-y2">
            <button class="btn btn-sml btn-block">
              Donate
            </button>
          </div> <!-- .push -->

          <div class="sml-push-y1 med-push-y2">
            <nuxt-link to="/cryptocurrency" class="link-light link-coin-icon">
              <img src="~/assets/images/crypto.png" alt="crypto coin icon"/>
              <span>Donate with cryptocurrency</span>
            </nuxt-link>
          </div> <!-- .push -->
        </form>
      </div>

      <div v-show="amount">
        <div class="fill-success sml-pad-1 sml-pad-x2 is-rounded text-left">
          <div class="flex-row flex-center">
            <h3>${{ amount }}</h3>
            <div class="text-right">
              <a @click.prevent="changeAmount" class="link-light">Edit</a>
            </div>
          </div>
        </div> <!-- fill -->

        <div class="checkbox sml-push-y1 text-left" v-if="canRecur">
          <input type="checkbox" id="is-recurring" v-model="isRecurring">
          <label for="is-recurring">
            <strong class="text-success">
              Make this a monthly recurring contribution?
            </strong>
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
            <span v-else-if="confirmationCode">
              Yes, I want to donate again
            </span>
            <span v-else>
              Submit
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
          <div v-if="canUsePaymentRequestButton" ref="paymentRequestBtn"></div>
        </div> <!-- .flex-row -->

        <form class="is-hidden" ref="paypalOneTime" action="https://www.paypal.com/cgi-bin/webscr" method="post">
          <input type="hidden" name="business" :value="paypalEmail">
          <input type="hidden" name="cmd" value="_donations">
          <input type="hidden" name="item_name" :value="donationDescription">
          <input type="hidden" name="item_number" :value="paypalItemNumber">
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
          <input type="hidden" name="item_number" :value="paypalItemNumber">
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
import { mapState, mapGetters, mapMutations } from 'vuex'
import axios from 'axios'
import { pingCounter } from '~/assets/js/helpers'
import ShareButton from '~/components/ShareButton'
import { TweenLite } from 'gsap'

// Create empty Stripe Elements variables
let stripe,
    stripeCard,
    stripeElements,
    stripePaymentRequest

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
      confirmationCode: null,
      isSending: false,
      hasSubmitted: false,
      errorMessage: null,
      canUsePaymentRequestButton: true,
      // form fields
      email: null,
      name: null,
      tmpAmount: 0,
      amount: null,
      isSubscribing: true,
      token: null,
      isRecurring: false,
      paypalItemNumber: null,
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
    },

    donationTag() {
      return this.$route.query.tag || this.$store.state.defaultDonationTag
    },

    donationFrequency() {
      return this.isRecurring ? 'monthly' : 'once'
    },

    testName() {
      return this.$route.query.email_subject ? 'email_subject' : null
    },

    testOption() {
      return this.$route.query.email_subject || null
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
    ...mapMutations(['addDonationAmount']),

    async setupStripe() {
      if (!this.$refs.card) return

      stripe = Stripe(process.env.STRIPE_API_KEY)
      stripeElements = stripe.elements()

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
      stripeCard = stripeElements.create('card', { style: formStyle })
      stripeCard.mount(this.$refs.card)

      // Set up Payment Request button for Apple, Google, and Microsoft Pay
      stripePaymentRequest = stripe.paymentRequest({
        country: 'US',
        currency: 'usd',
        total: {
          label: this.$store.state.donationDescription,
          amount: this.stripeAmount,
        },
        requestPayerName: true,
        requestPayerEmail: true
      })

      // Process payment when token is received
      stripePaymentRequest.on('token', this.receivePaymentRequestToken)

      // If the user has Apple/Google Pay, set up the button
      const paymentMethods = await stripePaymentRequest.canMakePayment()

      if (paymentMethods) {
        const btn = stripeElements.create('paymentRequestButton', {
          paymentRequest: stripePaymentRequest,
          style: {
            paymentRequestButton: {
              type: 'donate', //'default' | 'donate' | 'buy', // default: 'default'
              theme: 'light-outline', // 'dark' | 'light' | 'light-outline', // default: 'dark'
              height: '60px', // default: '40px', the width is always '100%'
            },
          },
        })
        btn.mount(this.$refs.paymentRequestBtn)
      }
      else {
        this.canUsePaymentRequestButton = false
      }
    },

    setAmount() {
      this.amount = this.tmpAmount

      if (!this.canRecur) {
        this.isRecurring = false
      }

      if (stripePaymentRequest) {
        stripePaymentRequest.update({
          total: {
            label: this.$store.state.donationDescription,
            amount: this.stripeAmount
          }
        })
      }

      pingCounter(`${this.testVariantName}_donate_click_${this.amount}`)
    },

    changeAmount() {
      this.amount = null
    },

    async receivePaymentRequestToken(event) {
      this.email = event.payerEmail
      this.name = event.payerName

      try {
        await this.createStripeCharge(event.token)
        event.complete('success')
        this.$trackEvent('stripe_payment_request_button', 'success', this.stripeAmount)
      }
      catch (error) {
        this.errorMessage = `${error.message}  🙁`
        event.complete('fail')
      }
    },

    async submitStripeForm() {
      if (this.isSending) return

      this.isSending = true
      this.$trackEvent('stripe_donation_form', 'submit')
      pingCounter(`${this.testVariantName}_donate_submit_${this.amount}`)

      try {
        const { token, error } = await stripe.createToken(stripeCard)

        if (error) {
          throw new Error(error.message)
        }

        await this.createStripeCharge(token)
      }
      catch (error) {
        this.errorMessage = `${error.message}  🙁`
      }

      this.isSending = false
    },

    async getReCaptchaToken() {
      return new Promise(resolve => {
        window.grecaptcha.ready(() => {
          grecaptcha
            .execute(process.env.RECAPTCHA_PUBLIC_KEY, {
              action: 'stripeDonation'
            })
            .then(resolve)
        })
      })
    },

    async createStripeCharge(token) {
      try {
        const reCaptchaToken = await this.getReCaptchaToken()

        const { data } = await axios.post(`${process.env.PAYMENTS_API_URL}stripe`, {
          amount: this.stripeAmount,
          token: token.id,
          email: this.email,
          name: this.name ? this.name : '',
          receive_emails: this.isSubscribing,
          description: this.$store.state.donationDescription,
          fundraiser_id: this.$store.state.actionNetworkFundraiserId,
          action_network_tags: this.$store.state.actionNetworkTags,
          donation_tag: this.donationTag,
          frequency: this.donationFrequency,
          test_name: this.testName,
          test_option: this.testOption,
          confirmation_code: this.confirmationCode,
          recaptcha_token: reCaptchaToken
        })

        this.hasSubmitted = true
        this.confirmationCode = null
        this.addDonationAmount(this.amount)

        this.$trackEvent('stripe_donation', 'success', this.stripeAmount)
        pingCounter(`${this.testVariantName}_donate_success_${this.amount}`)
      }
      catch (error) {
        let errorMessage
        const { response } = error

        if (response && response.data && response.data.error) {
          errorMessage = response.data.error

          if (response.data.confirmation_code) {
            this.confirmationCode = response.data.confirmation_code
          }
        }
        else {
          errorMessage = "Couldn't connect to payment processor"
        }

        throw new Error(errorMessage)
      }
    },

    async createPendingPaypalDonation() {
      const { data } = await axios.post(`${process.env.PAYMENTS_API_URL}paypal`, {
        amount: this.amount,
        name: this.name,
        donation_tag: this.donationTag,
        frequency: this.donationFrequency,
        test_name: this.testName,
        test_option: this.testOption
      })

      return data
    },

    async submitPaypalForm() {
      this.isSending = true
      const ref = this.isRecurring ? 'paypalRecurring' : 'paypalOneTime'
      this.$trackEvent(`${ref}_form`, 'submit')
      pingCounter(`${this.testVariantName}_${ref}_submit_${this.amount}`)

      try {
        const { id } = await this.createPendingPaypalDonation()
        this.paypalItemNumber = id

        // wait for item_number to be populated
        this.$nextTick(() => {
          this.$refs[ref].submit()
        })
      }
      catch (error) {
        // ignore error and continue with donation
        this.$refs[ref].submit()
      }
    }
  }
}
</script>
