import Vuex from 'vuex'
import config from '~/config'

const createStore = () => {
  return new Vuex.Store({
    state: {
      anPetitionId: config.actionNetworkPetitionId,
      currentAmountDonated: config.currentAmountDonated,
      donationGoal: config.donationGoal,
      donationAmounts: config.donationAmounts,
      defaultDonation: config.defaultDonation,
      donationDescription: config.donationDescription,
      donationTags: config.donationTags,
      showAltPaymentMethods: config.showAltPaymentMethods,
      modalVisible: false,
      modalType: null
    },
    mutations: {
      setModalVisibility(state, value) {
        state.modalVisible = value
      },

      setModalType(state, value) {
        state.modalType = value
      }
    }
  })
}

export default createStore
