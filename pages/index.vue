<template>
  <div>
    <section class="sml-pad-y3 med-pad-y6 fill-top">
      <div class="wrapper">
        <div class="row text-center">
          <div class="sml-c12 lrg-c10 grid-center">
            <LoaderLogo/>
            <h1 class="sml-push-y2 med-push-y3">
              This is our last best chance to save net neutrality
            </h1>
          </div> <!-- .c -->
          <div class="sml-c12 lrg-c8 grid-center">
            <p class="sml-push-y2 med-push-y3">
              Time is running out to get Congress to overrule the FCC and
              restore net neutrality. We have a plan to turn up the pressure
              on key lawmakers, and with the clock ticking a team of Internet
              defenders are prepared to match your donation to make it possible.
            </p>
            <a class="btn btn-block sml-push-y2 med-push-y3"
               @click.prevent="scrollTo('#donate')">
              Donate
            </a>

            <ul class="hoz sml-push-y2 med-push-y3">
              <li>
                <a @click.prevent="scrollTo('#plan')">
                  The Plan
                </a>
              </li>
              <li>
                <a @click.prevent="scrollTo('#defenders')">
                  The Defenders
                </a>
              </li>
              <li>
                <a @click.prevent="scrollTo('#join')">
                  Join Us
                </a>
              </li>
            </ul>
          </div> <!-- .c -->
        </div> <!-- .row -->
      </div> <!-- .wrapper -->
    </section>

    <section id="plan" class="sml-pad-y3 med-pad-y6 fill-grey-dark">
      <div class="wrapper">
        <div class="row">
          <div class="sml-c12 lrg-c8 grid-center text-center">
            <h2>The Plan</h2>
          </div> <!-- .c -->
        </div> <!-- .row -->
      </div> <!-- .wrapper -->
    </section>

    <section id="defenders" class="sml-pad-y3 med-pad-y6">
      <div class="wrapper">
        <div class="row">
          <div class="sml-c12 lrg-c8 grid-center text-center">
            <h2>The Defenders</h2>
          </div> <!-- .c -->
        </div> <!-- .row -->
      </div> <!-- .wrapper -->
    </section>


    <section id="join" class="sml-pad-y3 med-pad-y6 fill-grey-dark">
      <div class="wrapper">
        <div class="row">
          <div class="sml-c12 lrg-c8 grid-center text-center">
            <h2>Join Us</h2>
          </div> <!-- .c -->
        </div> <!-- .row -->
      </div> <!-- .wrapper -->
    </section>

    <section id="donate" class="sml-pad-y3 med-pad-y6">
      <div class="wrapper">
        <div class="row">
          <div class="sml-c12 lrg-c8 grid-center text-center">
            <h2>Donate</h2>
          </div> <!-- .c -->
        </div> <!-- .row -->
      </div> <!-- .wrapper -->
    </section>
  </div>
</template>

<script>
import config from '~/config'
import { createMetaTags, smoothScrollToElement } from '~/assets/js/helpers'
import LoaderLogo from '~/components/LoaderLogo'

export default {
  components: {
    LoaderLogo
  },

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

  methods: {
    scrollTo(hash) {
      const duration = 500
      smoothScrollToElement(hash, duration)
      // WARNING: Since there is no server a setTimeout is ok. However, with a
      // server this is a dangerous eval. Remove if this project ever is hosted
      // with a JS server.
      setTimeout(() => {
        location.hash = hash
      }, duration)
    }
  }
}
</script>
