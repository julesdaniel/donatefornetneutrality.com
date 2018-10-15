<template>
  <div>
    <div v-if="hasSubmitted" class="text-center sml-push-y2 med-push-y3">
      <h4 class="text-success">
        Thanks for starting the process to become an internet champion!
      </h4>
    </div> <!-- v-if -->
    <form @submit.prevent="submitForm()" v-if="!hasSubmitted"
          class="sml-push-y2 med-push-y3">
      <p class="text-warn" v-if="errorMessage">{{ errorMessage }}</p>
      <div class="flex-row sml-push-y2">
        <input v-model="name" type="text" placeholder="Name*" required>
        <input v-model="email" type="email" placeholder="Email*" required>
      </div> <!-- .flex-row -->
      <div class="flex-row sml-push-y2">
        <input v-model="org" type="text" placeholder="Organization Name*"
               class="sml-flex-4" required>
        <input v-model="phone" type="tel" placeholder="Phone">
      </div> <!-- .flex-row -->

      <button class="btn btn-block sml-push-y2" :disabled="isSending">
        <span v-if="isSending">
          Sending...
        </span>
        <span v-else>
          Join Us
        </span>
      </button>
    </form>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      isSending: false,
      hasSubmitted: false,
      errorMessage: null,
      // form fields
      name: null,
      email: null,
      org: null,
      phone: null
    }
  },

  methods: {
    async submitForm() {
      if (this.isSending) return

      this.isSending = true
      this.hasSubmitted = false
      this.$trackEvent('donation_matching_form', 'submit')

      try {
        const { data } = await axios.post(
          "https://sheetz.fftf.xyz/sheets/1tKmDHxkmE4P8yfao28-l3hwXSTnue4P3DvQuL_sbZRg/rows",
          {
            name: this.name,
            email: this.email,
            organization: this.org,
            phone: this.phone ? this.phone : ''
          }
        )
        this.$trackEvent('donation_matching_form', 'success')
        this.isSending = false
        this.hasSubmitted = true
      }
      catch (err) {
        this.isSending = false
        this.errorMessage = "Sorry, that didn’t work for some reason. Please try again."
      }
    },
  }
}
</script>
