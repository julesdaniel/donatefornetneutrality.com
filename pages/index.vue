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

    <section id="plan" class="sml-pad-y3 med-pad-y6">
      <div class="wrapper">
        <div class="row">
          <div class="sml-c12 lrg-c8 grid-center text-center">
            <h2 class="section-title">Here&rsquo;s the Plan</h2>
            <p class="sml-push-y2 med-push-y3">
              The FCC killed net neutrality, giving companies like Comcast and
              Verizon the power to control what we see and do online with
              throttling, censorship, and expensive new fees. But Congress can
              still reverse that decision using the Congressional Review Act
              (CRA). The Senate already passed a resolution, but now the House
              is running out of time to do the same. We&rsquo;re focusing all of
              our energy on key lawmakers who are facing tight races, making
              them the most likely to listen to constituents. Here&rsquo;s what
              we&rsquo;re raising money to do:
            </p>
            <div class="fill-grey-dark with-border is-rounded sml-push-y2 med-push-y3 sml-pad-2 med-pad-3">
              <h4 class="flex-center">
                <img src="~/assets/images/gradient-calls.png" alt="phone"
                     class="gradient-icon" />
                <span class="sml-pad-x2">
                  Flood Congress with phone calls, tweets, and emails
                </span>
              </h4>
              <p class="sml-push-y2">
                When millions of people call and email their representatives,
                Congress listens. Your donations will help us direct pressure in
                key districts where it matters most.
              </p>
            </div> <!-- fill -->
            <div class="fill-grey-dark with-border is-rounded sml-push-y2 sml-pad-2 med-pad-3">
              <h4 class="flex-center">
                <!-- TODO: replace icon -->
                <img src="~/assets/images/gradient-calls.png" alt="phone"
                     class="gradient-icon" />
                <span class="sml-pad-x2">
                  Run crowdfunded billboards, newspaper ads, and online ads
                </span>
              </h4>
              <p class="sml-push-y2">
                As politicians in key districts are hearing from outraged voters,
                we&rsquo;ll turn up the pressure by putting up billboards and
                running ads in digital and print media.
              </p>
            </div> <!-- fill -->
            <div class="fill-grey-dark with-border is-rounded sml-push-y2 sml-pad-2 med-pad-3">
              <h4 class="flex-center">
                <!-- TODO: replace icon -->
                <img src="~/assets/images/gradient-calls.png" alt="phone"
                     class="gradient-icon" />
                <span class="sml-pad-x2">
                  Organize in-district actions and events
                </span>
              </h4>
              <p class="sml-push-y2">
                We&rsquo;ll organize meetings with candidates who are willing to
                engage with us, and we&rsquo;ll protest candidates who refuse to
                listen to their constituents. We&rsquo;ll mail postcards, put up
                lawn signs, and send mass text messages to ensure that voters in
                these key districts know who supports net neutrality ahead of
                election day.
              </p>
            </div> <!-- fill -->
          </div> <!-- .c -->
        </div> <!-- .row -->
      </div> <!-- .wrapper -->
    </section>

    <section id="defenders" class="sml-pad-y3 med-pad-y6 fill-grey-dark">
      <div class="wrapper">
        <div class="row">
          <div class="sml-c12 lrg-c8 grid-center text-center">
            <h2 class="section-title">The Defenders</h2>
          </div> <!-- .c -->
        </div> <!-- .row -->
      </div> <!-- .wrapper -->
    </section>


    <section id="join" class="sml-pad-y3 med-pad-y6">
      <div class="wrapper">
        <div class="row">
          <div class="sml-c12 lrg-c8 grid-center text-center">
            <h2 class="section-title">Join Us</h2>
          </div> <!-- .c -->
        </div> <!-- .row -->
      </div> <!-- .wrapper -->
    </section>

    <section id="donate" class="sml-pad-y3 med-pad-y6 fill-grey-dark">
      <div class="wrapper">
        <div class="row">
          <div class="sml-c12 lrg-c8 grid-center text-center">
            <h2 class="section-title">Donate</h2>
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
