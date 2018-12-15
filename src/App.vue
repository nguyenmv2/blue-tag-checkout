<template>
  <div class="h-full">
    <div class="container mx-auto h-screen">
      <div class="flex flex-col justify-center text-center pb-6 tracking-wide">
        <h2 class="font-serif text-2xl text-center py-4 italic leading-loose">
          Finish The Look With
        </h2>
        <h1 class="font-serif text-3xl uppercase text-black">Accessories</h1>
      </div>
      <div
        class="flex-1 flex flex-col justify-center mx-12 items-center"
        id="step-1"
        v-show="step == 1"
      >
        <p
          class="text-xl text-blue font-serif tracking-wide leading-loose pb-8 italic"
        >
          Add a veil to try on box for free
        </p>
        <div class="flex flex-1 z-10">
          <veil
            v-for="item in products"
            :key="item.id"
            :client="client"
            :checkoutId="checkoutId"
            :item="item"
            :selected="isSelected(item)"
            @update-checkout="onUpdateCheckout"
            @remove-line-item="onRemoveVeil"
            class="flex flex-1 z-10"
          />
        </div>
        <div class="lg:pb-8 z-10 py-8">
          <a
            href="#"
            class="font-serif text-xl tracking-wide text-blue link uppercase italic"
            @click.prevent="scrollToCart"
          >
            Continue to checkout
            <img src="./assets/arrows_sideways.svg" alt="" class="h-4" />
          </a>
        </div>
      </div>
    </div>
    <div class="bg-blue-light pt-16">
      <div
        id="cart"
        class="container mx-auto flex flex-col justify-center items-center"
      >
        <h1 class="text-blue font-sans">Shopping Bag</h1>

        <div class="w-full py-8 flex flex-col">
          <h2 class="py-4 font-serif font-semibold text-blue">
            Your Sample Order
          </h2>
          <table class="w-full pt-4">
            <thead>
              <tr class="text-blue font-sans tracking-wide">
                <th>Your Try-On Sample</th>
                <th>Size</th>
                <th>Quantity</th>
                <th>Price</th>
                <th class="action-col"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(lineItem, idx) in sampleLineItems"
                :key="idx"
                class="text-blue font-serif my-6"
              >
                <th class="justify-around">
                  <div class="pl-8">
                    <div class="lineItem--thumbnail">
                      <img :src="lineItemThumbnail(lineItem)" />
                    </div>
                  </div>
                  <div class="text-center flex-grow justify-center">
                    {{ lineItem.title }}
                  </div>
                </th>
                <th>{{ lineItemSize(lineItem) }}</th>
                <th>{{ lineItem.quantity }}</th>
                <th>${{ lineItem.variant.price }}</th>
                <th class="action-col">
                  <a
                    href="#"
                    class="text-blue"
                    @click.prevent="removeLineItem(lineItem)"
                    >x</a
                  >
                </th>
              </tr>
            </tbody>
          </table>
          <div
            v-if="error"
            id="errors"
            class="text-red font-sans pt-8"
            v-html="errorMsg"
          ></div>
        </div>

        <div
          class="w-full py-8 flex flex-col"
          v-show="purchaseLineItems.length > 0"
        >
          <h2 class="py-4 font-serif font-semibold text-blue">
            Your Purchases
          </h2>
          <table class="w-full pt-4">
            <thead>
              <tr class="text-blue font-sans tracking-wide">
                <th>Your Purchases</th>
                <th>Size</th>
                <th>Quantity</th>
                <th>Price</th>
                <th class="action-col"></th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(lineItem, idx) in purchaseLineItems"
                :key="idx"
                class="text-blue font-serif my-6"
              >
                <th class="justify-around">
                  <div class="pl-8">
                    <div class="lineItem--thumbnail">
                      <img :src="lineItemThumbnail(lineItem)" />
                    </div>
                  </div>
                  <div class="text-center flex-grow justify-center">
                    {{ lineItem.title }}
                  </div>
                </th>
                <th>{{ lineItemSize(lineItem) }}</th>
                <th>{{ lineItem.quantity }}</th>
                <th>${{ lineItem.variant.price }}</th>
                <th class="action-col">
                  <a
                    href="#"
                    class="text-blue"
                    @click.prevent="removeLineItem(lineItem)"
                    >x</a
                  >
                </th>
              </tr>
            </tbody>
          </table>
        </div>
        <div
          class="flex flex-col lg:flex-row font-serif text-blue text-md tracking-wide leading-loose ml-4 justify-center"
        >
          <div class="w-3/4 flex flex-col md:flex-row flex-wrap -mx-4">
            <div class="flex flex-col p-4">
              <input type="text" name="size" v-model="size" />
              <label for="size"
                >What size of clothes do you typically wear?</label
              >
            </div>
            <div class="flex flex-col p-4">
              <flat-pickr :config="dateConfig" v-model="weddingDate" />
              <label for="wedding-date"
                >When is your wedding? (leave this blank if you haven't decided
                on a date yet)</label
              >
            </div>
            <div class="flex flex-col p-4">
              <flat-pickr :config="dateConfig" v-model="receiveDate" />
              <label for="receive-date">
                When do you want to receive your sample? (leave blank for ASAP)
              </label>
            </div>
            <div class="flex flex-col p-4">
              <textarea
                name="note"
                cols="30"
                rows="5"
                v-model="note"
              ></textarea>
              <label for="note"
                >Any other notes or requests you would like us to know?</label
              >
            </div>
          </div>
          <div class="w-1/4 flex flex-col text-center">
            Subtotal: ${{ checkout.subtotalPrice }}
            <button
              class="checkout-btn"
              @click="openCheckout"
              v-html="checkoutText"
            ></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Client from "shopify-buy";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import Veil from "./components/Veil";

export default {
  name: "app",
  components: {
    flatPickr,
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
      if (this.step == 1) {
        return "Finish the look with a veil on us";
      } else if (this.step == 2) {
        return "Additional Info";
      } else {
        return "Review Order";
      }
    },
    lineItems() {
      return this.checkout.lineItems;
    },
    veilByType() {
      if (this.type === "buy") return "Custom";

      return "Sample";
    },
    purchaseLineItems() {
      return this.lineItems.filter(item => {
        return item.variant.selectedOptions.find(
          opt => opt.name === "Type" && opt.value === "Custom"
        );
      });
    },
    sampleLineItems() {
      return this.lineItems.filter(item => {
        return item.variant.selectedOptions.find(
          opt => opt.name === "Type" && opt.value === "Sample"
        );
      });
    },
    checkoutText() {
      if (this.checkingOut) {
        return "Proccessing";
      }
      return "Checkout";
    }
  },
  data() {
    return {
      checkout: {
        lineItems: []
      },
      products: [],
      client: {},
      selectedVeil: {},
      step: 1,
      variantIndex: {},
      lineItemToRemove: [],
      type: undefined,
      dateConfig: {
        altInput: true,
        altFormat: "D, M J, Y",
        minDate: "today"
      },
      note: "",
      size: "",
      weddingDate: "",
      receiveDate: "",
      error: false,
      errorMsg: "",
      checkingOut: false
    };
  },
  watch: {
    selectedVeil(newVal, oldVal) {
      if (oldVal && oldVal.id) {
        this.lineItemToRemove.push(oldVal.id);
      }
    },
    step(newVal, oldVal) {
      if (oldVal == 1) {
        const selectedIndex = this.lineItemToRemove.findIndex(
          id => id === this.selectedVeil.id
        );

        this.client.checkout.removeLineItems(
          this.checkout.id,
          this.lineItemToRemove
            .splice(selectedIndex, 1)
            .filter(id =>
              this.checkout.lineItems.map(item => item.id).includes(id)
            )
        );
        this.client.checkout
          .addLineItems(this.checkout.id, {
            variantId: this.selectedVeil.id,
            quantity: 1
          })
          .then(checkout => {
            this.checkout = checkout;
          });
      }
    },
    "checkout.lineItems": {
      immediate: true,
      handler(newItems) {
        let veilCount = newItems
          .filter(
            item =>
              item.title.toLowerCase().includes("veil") &&
              item.variant.selectedOptions.find(
                i => i.name === "Type" && i.value === "Sample"
              )
          )
          .map(item => item.quantity)
          .reduce((a, b) => a + b, 0);
        let dressCount = newItems
          .filter(
            item =>
              !item.title.toLowerCase().includes("veil") &&
              item.variant.selectedOptions.find(
                i => i.name === "Type" && i.value === "Sample"
              )
          )
          .map(item => item.quantity)
          .reduce((a, b) => a + b, 0);
        this.error = true;
        if (dressCount > 3 && veilCount > 1) {
          this.errorMsg =
            "You can only have up to 3 dress samples and 1 veil sample per try-on box";
        } else if (veilCount > 1) {
          this.errorMsg = "Only one veil is allowed per try-on box";
        } else if (dressCount > 3) {
          this.errorMsg =
            "You can only have up to 3 dress samples per try-on box";
        } else {
          this.error = false;
        }
      }
    }
  },
  mounted() {
    const client = Client.buildClient({
      domain: "bluetagbridal.myshopify.com",
      storefrontAccessToken: "842ea89dedb8e2075e5434240efe2402"
    });
    const collectionId = btoa("gid://shopify/Collection/87363256393");
    this.client = client;
    client.checkout.fetch(this.checkoutId).then(checkout => {
      this.checkout = checkout;
      client.collection.fetchWithProducts(collectionId).then(collection => {
        this.products = collection.products;
        this.products.forEach(product => {
          product.variants.forEach(variant => {
            this.variantIndex[variant.id] = product;
          });
        });
        let inCart = this.checkout.lineItems;
        inCart.forEach(item => {
          if (
            item.variant.selectedOptions.find(
              vari => vari.name === "Type" && vari.value === "Custom"
            )
          ) {
            this.type = "buy";
          } else {
            const productId = item.variant.product.id;
            if (this.products.map(p => p.id).includes(productId)) {
              this.selectedVeil = item.variant;
            }
          }
        });
      });
    });
  },
  methods: {
    onUpdateCheckout(checkout) {
      this.checkout = checkout;
    },
    lineItemSize(lineItem) {
      let size = lineItem.variant.selectedOptions.find(
        vari => vari.name !== "Type"
      );
      return size.value;
    },
    lineItemThumbnail(lineItem) {
      if (lineItem && lineItem.variant && lineItem.variant.image)
        return (lineItem.variant.image.src || "").replace(
          ".jpg",
          "_180x180.jpg"
        );
      return "";
    },
    removeLineItem(lineItem) {
      this.client.checkout
        .removeLineItems(this.checkout.id, [lineItem.id])
        .then(checkout => {
          this.checkout = checkout;
        });
    },
    scrollToCart() {
      document.getElementById("cart").scrollIntoView({
        behavior: "smooth",
        block: "start",
        inline: "start"
      });
    },
    isSelected(item) {
      return this.checkout.lineItems
        .map(i => i.variant.product.id)
        .includes(item.id);
    },
    onRemoveVeil(variantId) {
      let lineItemId = this.checkout.lineItems.find(
        item => item.variant.id === variantId
      );
      this.removeLineItem(lineItemId);
    },
    refetchCheckout() {
      return new Promise(resolve => {
        this.client.checkout.fetch(this.checkoutId).then(checkout => {
          this.checkout = checkout;
          resolve(checkout);
        });
      });
    },
    openCheckout() {
      this.checkingOut = true;
      this.refetchCheckout().then(checkout => {
        if (this.error) {
          document.getElementById("errors").scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center"
          });
          this.checkingOut = false;
          return;
        }
        this.client.checkout
          .updateAttributes(checkout.id, {
            customAttributes: [
              { key: "note", value: this.note },
              { key: "size", value: this.size },
              { key: "weddingDate", value: this.weddingDate },
              { key: "receiveDate", value: this.receiveDate }
            ]
          })
          .then(checkout => {
            window.location = checkout.webUrl;
          });
      });
    }
  }
};
</script>

<style>
.veils {
  display: flex;
  flex-wrap: wrap;
}
.VueCarousel-wrapper {
  display: flex;
  flex-direction: column;
}
.VueCarousel-inner {
  flex: 1;
  display: flex;
}
.VueCarousel-slide {
  flex: 1;
  display: flex;
}
.accessories__border {
  position: absolute;
  top: 46%;
  left: 50%;
  -webkit-transform: translateX(-50%);
  transform: translateX(-50%);
  width: calc(100% - 60px);
  max-width: 70%;
  height: 40%;
  margin-top: -70px;
  margin-right: auto;
  margin-left: auto;
  border: 1px solid #000;
}
.link {
  text-decoration: none;
}
tbody {
  border: 2px solid #556e8e;
}
.lineItem--thumbnail {
  height: 65px;
  width: 65px;
  display: block;
  overflow: hidden;
}
table {
  border-top: 1px solid black;
}
/* table thead tr {
  height: 5em;
} */
/* Flex Table */
table {
  display: flex;
  flex-direction: column;
  height: 100%;
}
table thead,
table tbody {
  display: block;
}
table thead {
  margin-right: 0px;
}
table tbody {
  flex: 1;
  overflow-y: scroll;
}
table tr {
  width: 100%;
  display: flex;
}
table tr td,
table tr th {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
}
.action-col {
  max-width: 5%;
}
.checkout-btn {
  background-color: transparent;
  background-image: url(./assets/button.svg);
  background-size: 100% 100%;
  border: 0;
  @apply text-white px-6 py-4;
}
</style>
