<script>
import IndexPage from './index'

export default {
  extends: IndexPage,

  beforeCreate() {
    this.$store.commit('setHasAlreadyDonated', true)
  }
}
</script>
