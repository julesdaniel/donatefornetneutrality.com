<template>
  <div>
    <section class="sml-pad-y3 med-pad-y6 fill-top">
      <div class="wrapper">
        <div class="row text-center">
          <div class="sml-c12 lrg-c8 grid-center">
            <h1>
              A New Legal Ruling Could Save Net Neutrality
            </h1>
            <p class="sml-push-y2 med-push-y3">
              A bombshell court decision has shifted the fight for net neutrality to the state level.  Lobbyists
              for big cable companies are already swarming Congress in an effort to introduce bad legislation that
              will prevent states like California, Georgia, and Kentucky from enacting their own Internet protections.
              But we're fighting back. <strong>Donate now and our Internet champions will match every dollar.</strong>
            </p>
            <ProgressBar
              :current-total="currentAmountDonated"
              :goal-total="donationGoal"
              class="sml-push-y2 med-push-y3"/>
            <DonationForm id="donate-form"/>

            <ul class="hoz sml-push-y2 med-push-y3">
              <li>
                <a @click.prevent="scrollTo('#plan')">
                  The Plan
                </a>
              </li>
              <li>
                <a @click.prevent="scrollTo('#champions')">
                  Internet Champions
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
            <h2 class="section-title">Here&rsquo;s the plan</h2>
            <p class="sml-push-y2 med-push-y3">
              Ever since the FCC repealed net neutrality, ISPs like Verizon, AT&T and
              T-Mobile have been
              <a href="https://www.bloomberg.com/news/articles/2019-08-19/wireless-carrier-throttling-of-online-video-is-pervasive-study" target="_blank">
              throttling traffic</a> "pretty much everywhere all the time." But a federal court has
              <a href="https://thehill.com/policy/technology/463805-appeals-court-upholds-net-neutrality-repeal-but-rules-fcc-cant-block-state" target="_blank">
              ruled</a> that the FCC can't legally stop individual states from creating their own
              net neutrality legislation.
              <a href="http://www.ncsl.org/research/telecommunications-and-information-technology/net-neutrality-legislation-in-states.aspx" target="_blank">
              Nearly every state</a> is battling to enact such laws, but big cable lobbyists
              are working overtime to kill these state-level bills while pushing for bad
              legislation at the national level. But so are we. With your help,
              here&rsquo;s what we'll do:
            </p>
            <div class="with-border is-rounded sml-push-y2 med-push-y3 sml-pad-2 med-pad-3">
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
            <div class="with-border is-rounded sml-push-y2 sml-pad-2 med-pad-3">
              <h4 class="flex-center">
                <!-- TODO: replace icon -->
                <img src="~/assets/images/gradient-crowdfund.png" alt="phone"
                     class="gradient-icon" />
                <span class="sml-pad-x2">
                  Run crowdfunded billboards, newspaper ads, and online ads
                </span>
              </h4>
              <p class="sml-push-y2">
                As politicians in key districts are hearing from voters,
                we&rsquo;ll turn up the pressure by putting up billboards and
                running ads in digital and print media.
              </p>
            </div> <!-- fill -->
            <div class="with-border is-rounded sml-push-y2 sml-pad-2 med-pad-3">
              <h4 class="flex-center">
                <!-- TODO: replace icon -->
                <img src="~/assets/images/gradient-action.png" alt="phone"
                     class="gradient-icon" />
                <span class="sml-pad-x2">
                  Organize in-district actions and events
                </span>
              </h4>
              <p class="sml-push-y2">
                We&rsquo;ll organize meetings with candidates who are willing to
                engage with us, and we&rsquo;ll protest lawmakers who refuse to
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

    <section id="champions" class="sml-pad-y3 med-pad-y6 fill-grey-dark">
      <div class="wrapper">
        <div class="row">
          <div class="sml-c12 lrg-c8 grid-center text-center">
            <h2 class="section-title">
              These Internet Champions will match your donation
            </h2>
            <p class="sml-push-y2 med-push-y3">
              These folks have been on the front lines defending net neutrality
              and fighting for an Internet full of free expression, information,
              and creativity. If you&rsquo;d like to join the list of Internet
              Champions, fill out the form below to help match donations or
              make a significant financial donation of at least $500.
            </p>

            <LogoCloud class="sml-push-y2 med-push-y3"/>
          </div> <!-- .c -->
        </div> <!-- .row -->
      </div> <!-- .wrapper -->
    </section>

    <section id="join" class="sml-pad-y3 med-pad-y6">
      <div class="wrapper">
        <div class="row">
          <div class="sml-c12 lrg-c8 grid-center text-center">
            <h2 class="section-title">Join us in matching donations</h2>
            <p class="sml-push-y2 med-push-y3">
              If you represent an organization that would like to help preserve
              a free and open internet by matching donations for this campaign,
              please fill out the form below and press &rdquo;JOIN US.&rdquo;
              We&rsquo;ll get back to you as soon as possible.
            </p>
            <DonationMatchingForm/>
          </div> <!-- .c -->
        </div> <!-- .row -->
      </div> <!-- .wrapper -->
    </section>

    <section id="quotes" class="sml-pad-y3 med-pad-y6 fill-grey-dark">
      <div class="wrapper">
        <div class="row">
          <div class="sml-c12 lrg-c8 grid-center text-center">
            <h2 class="section-title">
              Don&rsquo;t take our word for it
            </h2>
            <p class="sml-push-y2 med-push-y3">
              The loss of net neutrality has already begun to have a real-world
              impact on the lives of people across America. Businesses have
              suffered. Veterans have been ignored. And first responders have
              had their safety put at risk in the absence of a free and open
              internet. Here&rsquo;s what some of them have to say:
            </p>
            <QuoteScroller class="sml-push-y2"/>
          </div> <!-- .c -->
        </div> <!-- .row -->
      </div> <!-- .wrapper -->
    </section>

    <section id="store" class="sml-pad-y3 med-pad-y6">
      <div class="wrapper">
        <div class="row">
          <div class="sml-c12 lrg-c8 grid-center text-center">
            <h2 class="section-title">
              Get Fight for the Future merch
            </h2>
          </div> <!-- .c -->
        </div> <!-- .row -->

        <div class="row sml-push-y2 med-push-y4">
          <div class="sml-c6 med-c3">
            <a href="https://shop.fightforthefuture.org/products/still-fighting-for-net-neutrality-hooded-sweatshirt"
               target="_blank">
              <img src="~/assets/images/store-hoodie-80s.jpg"
                   alt="Still fighting for net neutrality hoodie" class="is-rounded"/>
            </a>
          </div> <!-- .c -->
          <div class="sml-c6 med-c3">
            <a href="https://shop.fightforthefuture.org/products/keep-the-internet-weird-t-shirt"
               target="_blank">
              <img src="~/assets/images/store-tshirt-weird.jpg"
                   alt="Keep the internet weird t-shirt" class="is-rounded"/>
            </a>
          </div> <!-- .c -->
          <div class="sml-c6 med-c3 sml-push-y2 med-push-y0">
            <a href="https://shop.fightforthefuture.org/products/still-fighting-for-net-neutrality-t-shirt"
               target="_blank">
              <img src="~/assets/images/store-tshirt-80s.jpg"
                   alt="Still fighting for net neutrality t-shirt" class="is-rounded"/>
            </a>
          </div> <!-- .c -->
          <div class="sml-c6 med-c3 sml-push-y2 med-push-y0">
            <a href="https://shop.fightforthefuture.org/products/urgent-hoodie"
               target="_blank">
              <img src="~/assets/images/store-hoodie-urgent.jpg"
                   alt="Urgent hoodie"
                   class="is-rounded"/>
            </a>
          </div> <!-- .c -->
        </div> <!-- .row -->
      </div> <!-- .wrapper -->
    </section>

    <section id="donate" class="sml-pad-y3 med-pad-y6 fill-grey-dark">
      <div class="wrapper">
        <div class="row">
          <div class="sml-c12 lrg-c8 grid-center text-center">
            <h2 class="section-title">
              Donate now to save net neutrality
            </h2>

            <a class="btn btn-block sml-push-y2 med-push-y4"
               @click.prevent="scrollTo('#donate-form')">
              Donate
            </a>
          </div> <!-- .c -->
        </div> <!-- .row -->
      </div> <!-- .wrapper -->
    </section>
  </div>
</template>

<script>
import axios from 'axios'
import config from '~/config'
import { mapMutations, mapState } from 'vuex'
import { createMetaTags, smoothScrollToElement } from '~/assets/js/helpers'
import ProgressBar from '~/components/ProgressBar'
import QuoteScroller from '~/components/QuoteScroller'
import DonationMatchingForm from '~/components/DonationMatchingForm'
import DonationForm from '~/components/DonationForm'
import LogoCloud from '~/components/LogoCloud'

export default {
  components: {
    ProgressBar,
    QuoteScroller,
    DonationMatchingForm,
    DonationForm,
    LogoCloud
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

  computed: {
    ...mapState(['currentAmountDonated', 'donationGoal'])
  },

  async created() {
    try {
      const { data } = await axios.get('https://data.battleforthenet.com/dfnn/data.json')
      this.addDonationAmount(data.total)
    }
    catch (error) {
      //
    }
  },

  methods: {
    ...mapMutations(['addDonationAmount']),

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
