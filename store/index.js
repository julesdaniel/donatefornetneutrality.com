import Vuex from 'vuex'
import config from '~/config'

const createStore = () => {
  // allow stripe key to be set by env var (useful in dev)
  if (process.env.STRIPE_API_KEY) {
    config.donate.stripePublicKey = process.env.STRIPE_API_KEY
  }

  return new Vuex.Store({
    state: {
      actionNetworkFundraiserId: config.actionNetworkFundraiserId,
      currentAmountDonated: config.currentAmountDonated,
      donationGoal: config.donationGoal,
      donate: config.donate,
      modalVisible: false,
      modalType: null,
      testVariant: null
    },
    mutations: {
      setModalVisibility(state, value) {
        state.modalVisible = value
      },

      setModalType(state, value) {
        state.modalType = value
      },

      setTestVariant(state, value) {
        state.testVariant = value
      },

      addDonationAmount(state, amount) {
        state.currentAmountDonated += parseInt(amount)
      }
    },
    getters: {
      testVariantName: state => {
        return state.testVariant === 'a' ? 'DFNN_subheading_above_form' : 'DFNN_subheading_below_form'
      }
    }
  })
}

export default createStore
