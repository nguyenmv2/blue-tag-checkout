<template>
  <div class="veil flex-1 flex flex-col px-4 z-10">
    <div class="img-wrapper flex-1">
      <img :src="images[0].src" :alt="images[0].alt" />
    </div>
    <div class="info flex flex-col self-center">
      <div class="title flex-1 px-6 py-4 text-black text-center">
        {{ item.title }}
      </div>
      <select name="variant" v-model="variant" class="py-4 mx-4 font-sans">
        <option
          v-for="(option, i) in lengthOptions"
          :key="i"
          :value="option.value"
          >{{ option.value }}</option
        >
      </select>

      <div class="w-full self-end text-center py-4 flex flex-col">
        <button v-if="adding" disabled>Adding To Cart</button>
        <button v-else-if="availableToTry" @click="tryVeil">
          Order Try On
        </button>
        <button v-else-if="added" @click="removeVeil">Added</button>
        <button class v-else>Out of stock</button>
        <div class="mt-4">
          <span v-if="addingBuy">Adding To Cart</span>
          <a
            v-else
            href="#"
            class="font-sans text-blue italic text-xl"
            @click="buyVeil"
            >Buy Now</a
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Veil",
  props: {
    item: {
      type: Object,
      required: true
    },
    selected: {
      type: Boolean,
      default: false
    },
    client: {
      type: Object,
      required: true
    },
    checkoutId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      variant: {},
      addingBuy: false,
      adding: false,
      added: false
    };
  },
  computed: {
    images() {
      return this.item.images;
    },
    image() {
      if (this.images[0]) return this.images[0].src;
      return "";
    },
    lengthOptions() {
      if (!(this.item && this.item.options.length)) return [];
      let lengthVariant = this.item.options.filter(
        option => option.name === "Length"
      );
      return lengthVariant[0].values;
    },
    sampleVariant() {
      return this.item.variants.find(variant => {
        let type = variant.selectedOptions.find(opt => opt.name === "Type");
        let length = variant.selectedOptions.find(opt => opt.name === "Length");
        return type.value === "Sample" && length.value === this.variant;
      });
    },
    availableToTry() {
      return !this.added && this.sampleVariant && this.sampleVariant.available;
    },
    buyVariant() {
      return this.item.variants.find(variant => {
        let type = variant.selectedOptions.find(opt => opt.name === "Type");
        let length = variant.selectedOptions.find(opt => opt.name === "Length");
        return type.value === "Custom" && length.value === this.variant;
      });
    }
  },
  watch: {
    item: {
      immediate: true,
      handler() {
        let item = this.item.variants.find(
          variant =>
            variant.selectedOptions.find(opt => opt.name === "Type").value ===
            "Sample"
        );
        if (item) {
          this.variant = item.selectedOptions.find(
            opt => opt.name === "Length"
          ).value;
        }
      }
    },
    selected: {
      immediate: true,
      handler(newVal) {
        this.added = newVal;
      }
    }
  },
  methods: {
    tryVeil() {
      let lineItems = [
        {
          variantId: this.sampleVariant.id,
          quantity: 1
        }
      ];
      this.adding = true;
      this.client.checkout
        .addLineItems(this.checkoutId, lineItems)
        .then(checkout => {
          this.added = true;
          this.$emit("update-checkout", checkout);
        })
        .finally(() => {
          this.adding = false;
        });
    },
    buyVeil() {
      let lineItems = [
        {
          variantId: this.buyVariant.id,
          quantity: 1
        }
      ];

      this.addingBuy = true;
      this.client.checkout
        .addLineItems(this.checkoutId, lineItems)
        .then(checkout => {
          this.$emit("update-checkout", checkout);
        })
        .finally(() => {
          this.addingBuy = false;
        });
    },
    removeVeil() {
      this.$emit("remove-line-item", this.sampleVariant.id);
    }
  }
};
</script>
<style scoped>
.img-wrapper {
  width: 200px;
  margin: auto;
  max-height: 300px;
}
.info {
  min-height: 100px;
}
.title {
  min-height: 70px;
}
button {
  background-color: transparent;
  background-image: url(../assets/button.svg);
  background-size: 100% 100%;
  border: 0;
  @apply text-white px-6 py-4;
}
</style>
