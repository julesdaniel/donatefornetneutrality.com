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
  background: $white;
  animation: none;
  padding: 6px 10px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  max-width: 50%;
  min-height: $gutter*5; // Default button height

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

.radio-toggle {
  border: 1px solid $grey-color;
  border-radius: $default-border-radius;
}
.radio-toggle input[type=radio] {
  display: none;
}
.radio-toggle label {
  display: block;
  padding: 7px $gutter/2;
  border-radius: $default-border-radius;
  color: $success-color;
  font-weight: $bold-font-weight;
  text-align: center;
  transition: $default-transition;

  @include respond-to-max(sml) {
    font-size: $font-size-6;
  }
}
.radio-toggle label:hover,
.radio-toggle label:focus {
  cursor: pointer;
}
.radio-toggle input[type=radio]:checked ~ label,
.radio-toggle input[type=radio]:checked ~ label {
  background-color: $success-color;
  color: $white;
}
</style>

<template>
  <div class="sml-pad-2 med-pad-3 with-border is-rounded sml-push-y2 med-push-y3">
    <div v-if="!hasSubmitted">
      <div v-show="!amount">
        <h4>Choose the amount of your gift:</h4>
        <form @submit.prevent="setAmount">
          <div class="row">
            <div v-for="option in donate.amounts" :key="`donate-${option}`"
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
                  <span>$</span><input type="number" v-model="tmpAmount" min="1">
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
        <div class="fill-success sml-pad-1 sml-pad-x2 is-rounded">
          <div class="flex-grid flex-center">
            <h2 class="sml-flex-3  text-left text-white">
              ${{ amount }}<span v-if="isRecurring"> / month</span>
            </h2>
            <div class="text-right">
              <a @click.prevent="changeAmount" class="link-light">Edit</a>
            </div>
          </div> <!-- .flex-grid -->
        </div> <!-- fill -->

        <div v-if="canRecur">
          <h4 class="sml-push-y2 med-push-y3">Make it monthly!</h4>
          <div class="radio-toggle sml-push-y1 sml-pad-half">
            <div class="flex-grid sml-flex-row">
              <div>
                <input type="radio"
                       v-model="isRecurring"
                       :value="true"
                       id="is-recurring">
                <label for="is-recurring">Yes, count me in!</label>
              </div>
              <div>
                <input type="radio"
                       v-model="isRecurring"
                       :value="false"
                       id="not-recurring">
                <label for="not-recurring">No, donate once</label>
              </div>
            </div> <!-- .flex-grid -->
          </div> <!-- .radio-toggle -->
        </div> <!-- v-if -->

        <h4 class="sml-push-y2 med-push-y3">Pay with credit card:</h4>
        <p class="text-warn sml-push-y1" v-if="errorMessage">
          <strong>{{ errorMessage }}</strong>
        </p>

        <form @submit.prevent="submitStripeForm()">
          <div class="flex-grid sml-flex-col med-flex-row">
            <input v-model="email" type="email" placeholder="Email*"
                   class="sml-push-y1" required>
            <input v-model="name" type="text" placeholder="Name"
                   class="sml-push-y1">
          </div> <!-- .flex-grid -->

          <div ref="card" class="stripe-cc-form sml-push-y1"></div>

          <button class="btn btn-block sml-push-y1" :disabled="isSending">
            <span v-if="isSending">
              Processing...
            </span>
            <span v-else-if="confirmationCode">
              Yes, I want to donate again
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
        <div class="flex-grid sml-flex-row sml-push-y1">
          <a class="btn btn-paypal" href="#" @click.prevent="submitPaypalForm()">
            <img src="~/assets/images/paypal-btn.png" alt="PayPal">
          </a>
          <div v-if="canUsePaymentRequestButton" ref="paymentRequestBtn"></div>
        </div> <!-- .flex-grid -->

        <form class="is-hidden" ref="paypalOneTime" action="https://www.paypal.com/cgi-bin/webscr" method="post">
          <input type="hidden" name="business" :value="donate.paypalEmail">
          <input type="hidden" name="cmd" value="_donations">
          <input type="hidden" name="item_name" :value="donate.description">
          <input type="hidden" name="item_number" :value="paypalItemNumber">
          <input type="hidden" name="currency_code" value="USD">
          <input type="hidden" name="amount" :value="amount">
          <input type="hidden" name="no_shipping" value="1">
          <img alt="" border="0" width="1" height="1" src="https://www.paypal.com/en_US/i/scr/pixel.gif">
          <input type="hidden" name="return" :value="donate.paypalReturnUrl">
        </form>

        <form class="is-hidden" ref="paypalRecurring" name="_xclick" action="https://www.paypal.com/cgi-bin/webscr" method="post">
          <input type="hidden" name="cmd" value="_xclick-subscriptions">
          <input type="hidden" name="business" :value="donate.paypalEmail">
          <input type="hidden" name="item_name" :value="donate.description">
          <input type="hidden" name="return" :value="donate.paypalReturnUrl">
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
        { src: 'https://js.stripe.com/v3/' },
        { src: `https://www.google.com/recaptcha/api.js?render=${this.donate.recaptchaPublicKey}` }
      ]
    }
  },

  data() {
    return {
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
      confirmationCode: null,
      // `reCaptchaResponse` is bound to `this`
      // animation
      tweenedAmount: 0
    }
  },

  computed: {
    ...mapState(['donate']),
    ...mapGetters(['testVariantName']),

    isOtherAmountSelected() {
      return this.tmpAmount && !this.donate.amounts.includes(this.tmpAmount)
    },

    stripeAmount() {
      return this.amount * 100
    },

    animatedAmount() {
      return this.tweenedAmount.toFixed(0);
    },

    canRecur() {
      return this.donate.monthlyAmounts.includes(parseInt(this.amount, 10))
    },

    donationTag() {
      return this.$route.query.tag || this.donate.defaultTag
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
      TweenLite.to(this.$data, 0.7, { tweenedAmount: newValue })
    }
  },

  mounted() {
    const { step, amount, frequency, an_tags } = this.$route.query // eslint-disable-line camelcase

    // Set inital amount in the url with `?amount=XX` or use default from config
    if (amount && parseInt(amount, 10) >= 1) {
      this.tmpAmount = parseInt(amount, 10)
    } else {
      this.tmpAmount = this.donate.defaultAmount
    }

    // Set inital recurring value to monthly in the url with `?frequency=month`
    if (frequency === 'month') {
      this.isRecurring = true
    }

    //
    // the step changes need to happen in mounted() instead of created()
    // to work on the generated site 🤓
    //

    // Show step 2 of the form by setting the temporary amount to the final amount
    if (step === '2') {
      this.setAmount()
    } else if (step === 'thanks') {
      // Show "Thanks" step
      this.hasSubmitted = true
    }

    // Add AN tags in this format: `?an_tags=foo,bar,test-1`
    if (an_tags) { // eslint-disable-line camelcase
      this.$store.commit('addActionNetworkTags', an_tags.split(','))
    }

    this.setupStripe()
  },

  methods: {
    ...mapMutations(['addDonationAmount']),

    async setupStripe() {
      if (!this.$refs.card) return

      stripe = Stripe(this.donate.stripePublicKey) // eslint-disable-line no-undef
      stripeElements = stripe.elements()

      const formStyle = {
        base: {
          color: '#201B2C',
          fontSize: '16px',
          fontFamily: "'Proxima Nova', sans-serif",
          '::placeholder': {
            color: '#515E77'
          }
        },
        invalid: {
          color: '#FF4A4A',
          ':focus': {
            color: '#201B2C'
          }
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
          label: this.donate.description,
          amount: this.stripeAmount
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
              type: 'donate', // 'default' | 'donate' | 'buy', // default: 'default'
              theme: 'light-outline', // 'dark' | 'light' | 'light-outline', // default: 'dark'
              height: '60px' // default: '40px', the width is always '100%'
            }
          }
        })
        btn.mount(this.$refs.paymentRequestBtn)
      } else {
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
            label: this.donate.description,
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
      } catch (error) {
        this.errorMessage = `${error.message}  🙁`
        event.complete('fail')
      }
    },

    async submitStripeForm() {
      if (this.isSending) return

      this.isSending = true
      this.errorMessage = null
      this.$trackEvent('stripe_donation_form', 'submit')
      pingCounter(`${this.testVariantName}_donate_submit_${this.amount}`)

      try {
        await this.verifyReCaptcha('stripeDonation')
      } catch (error) {
        this.$trackEvent('reCAPTCHAv3', 'fail')
        this.errorMessage = "🙁 reCAPTCHA v3 check failed. This means Google thinks you're a robot. If you are a human, we're very sorry for this inconvenience. Please try donating with Paypal instead."
        this.isSending = false
        return
      }

      try {
        const { token, error } = await stripe.createToken(stripeCard)

        if (error) {
          throw new Error(error.message)
        }

        await this.createStripeCharge(token)
      } catch (error) {
        const emoji = error.message.match(/\?$/) ? '🤔' : '🙁'
        this.errorMessage = `${error.message} ${emoji}`
      }

      this.isSending = false
    },

    async createStripeCharge(token) {
      try {
        const { data } = await axios.post(`${process.env.PAYMENTS_API_URL}stripe`, { // eslint-disable-line no-unused-vars
          org: 'fftf',
          amount: this.stripeAmount,
          token: token.id,
          email: this.email,
          name: this.name ? this.name : '',
          receive_emails: this.isSubscribing,
          description: this.donate.description,
          fundraiser_id: this.donate.actionNetworkFundraiserId,
          action_network_tags: this.donate.actionNetworkTags,
          donation_tag: this.donationTag,
          frequency: this.donationFrequency,
          test_name: this.testName,
          test_option: this.testOption,
          confirmation_code: this.confirmationCode
        })

        this.hasSubmitted = true
        this.confirmationCode = null
        this.addDonationAmount(this.amount)

        this.$trackEvent('stripe_donation', 'success', this.stripeAmount)
        pingCounter(`${this.testVariantName}_donate_success_${this.amount}`)
      } catch ({ response }) {
        let errorMessage

        if (response && response.data && response.data.error) {
          errorMessage = response.data.error

          if (response.data.confirmation_code) {
            this.confirmationCode = response.data.confirmation_code
          }
        } else {
          errorMessage = "Couldn't connect to payment processor"
        }

        throw new Error(errorMessage)
      }
    },

    verifyReCaptcha(action) {
      return new Promise((resolve, reject) => {
        if (this.reCaptchaResponse) {
          return resolve(this.reCaptchaResponse)
        }

        /* eslint-disable no-undef */
        window.grecaptcha.ready(async () => {
          const token = await grecaptcha.execute(this.donate.recaptchaPublicKey, {
            action: action
          })
          const { data } = await axios.post(`${process.env.PAYMENTS_API_URL}recaptcha`, {
            token: token
          })

          // see docs for how to interpret the score:
          // https://developers.google.com/recaptcha/docs/v3
          if (data.success && data.action === action && data.score >= 0.5) {
            this.reCaptchaResponse = data
            resolve(data)
          } else {
            reject(data)
          }
        })
        /* eslint-enable no-undef */
      })
    },

    async createPendingPaypalDonation() {
      const { data } = await axios.post(`${process.env.PAYMENTS_API_URL}paypal`, {
        amount: this.amount,
        name: this.name,
        donation_tag: this.donationTag,
        frequency: this.donationFrequency,
        test_name: this.testName,
        test_option: this.testOption,
        org: 'fftf'
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
      } catch (error) {
        // ignore error and continue with donation
        this.$refs[ref].submit()
      }
    }
  }
}
</script>
