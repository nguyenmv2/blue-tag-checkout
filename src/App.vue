<template>
  <v-modal>
    <h1 slot="header">{{ header }}</h1>
    <div slot="body" class="flex flex-col">
      <div class="flex" id="step-1" v-show="step == 1">
        <veil
          v-for="item in products"
          :key="item.id"
          :item="item"
          @select-veil="onSelectVeil"
          @deselect-veil="onDeselectVeil"
        />
      </div>
      <div id="step-2" v-show="step == 2"></div>
      <div id="step-3" v-show="step == 3"></div>
    </div>
    <div slot="footer">
      <a href="#" v-if="step > 1" @click="step -= 1">Previous</a>
      <a href="#" v-if="step < 3 && step >= 1" @click="step += 1">Next</a>
      <a href="#" v-if="step === 3">Done</a>
    </div>
  </v-modal>
</template>

<script>
import Client from "shopify-buy";
import VModal from "./components/VModal";
import Veil from "./components/Veil";

export default {
  name: "app",
  components: {
    VModal,
    Veil
  },
  props: {
    checkoutId: {
      type: String,
      required: true
    }
  },
  computed: {
    header() {
      return "Finish the look with a veil on us";
    }
  },
  data: function() {
    return {
      checkout: {},
      products: [],
      client: {},
      selectedVeil: {},
      step: 1
    };
  },
  mounted() {
    const client = Client.buildClient({
      domain: "bluetagbridal.myshopify.com",
      storefrontAccessToken: "842ea89dedb8e2075e5434240efe2402"
    });
    this.client = client;
    client.checkout.fetch(this.checkoutId).then(checkout => {
      this.checkout = checkout;
    });
    const collectionId = btoa("gid://shopify/Collection/87363256393");
    client.collection.fetchWithProducts(collectionId).then(collection => {
      this.products = collection.products;

      // client.checkout
      //   .addLineItems(this.checkoutId, {
      //     variantId: this.collection.products[0].variants[0].id,
      //     quantity: 1
      //   })
      //   .then(checkout => {
      //     console.log(checkout.lineItems);
      //   });
    });
  },
  methods: {
    orderSample(evt, item) {
      console.log("Order sample");
      console.log(item);
    },
    allVariantsOfProduct(product) {
      const lengths = [
        "Hip (40 inches)",
        "Chapel (90 inches)",
        "Cathedral (108 inches)"
      ];

      let a = lengths.map(length =>
        this.client.product.helpers.variantForOptions(product, {
          Type: "Sample",
          Length: length
        })
      );
      return a.filter(p => p.title.includes("Sample") && p.available);
    },
    onSelectVeil(veil) {
      this.selectedVeil = veil;
    },
    onDeselectVeil() {
      this.selectedVeil = {};
    }
  }
};
</script>

<style scoped>
img {
  width: 300px;
  height: auto;
}
.veils {
  display: flex;
  flex-wrap: wrap;
}
.VueCarousel {
  flex: 1;
}
</style>
