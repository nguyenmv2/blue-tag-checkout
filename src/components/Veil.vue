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
        <button v-if="selected" @click="deselectVeil">Selected</button>
        <button
          v-else-if="available"
          @click="selectVeil"
          v-html="buyButtonText"
        ></button>
        <button class v-else>Out of stock</button>
        <div class="mt-4" v-if="availableToBuy">
          <a href="#" class="font-sans text-blue italic text-xl" @click="buy"
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
    currentVeil: {
      type: Object,
      default: () => ({})
    },
    variantIndex: {
      type: Object,
      default: () => ({})
    },
    type: {
      type: String,
      default: "Custom"
    }
  },
  data() {
    return {
      variant: {},
      currentVariant: {}
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
    available() {
      return this.currentVariant && this.currentVariant.available;
    },
    selected() {
      return (
        this.currentVeil &&
        this.currentVeil.id &&
        this.variantIndex[this.currentVeil.id].id === this.item.id
      );
    },
    buyButtonText() {
      return "Order Try-On";
    }
  },
  watch: {
    item: {
      immediate: true,
      handler() {
        let item = this.item.variants.find(
          variant =>
            variant.selectedOptions.find(opt => opt.name === "Type").value ===
            this.type
        );
        this.variant = item.selectedOptions.find(
          opt => opt.name === "Length"
        ).value;
      }
    },
    variant: {
      immediate: true,
      handler(newVal) {
        const newVariant = this.item.variants.find(variant => {
          let type = variant.selectedOptions.find(opt => opt.name == "Type");
          let length = variant.selectedOptions.find(
            opt => opt.name == "Length"
          );
          return length.value === newVal && type.value === this.type;
        });
        this.currentVariant = newVariant;
      }
    }
  },
  methods: {
    selectVeil() {
      this.$emit("select-veil", this.currentVariant);
    },
    deselectVeil() {
      this.$emit("deselect-veil", this.currentVariant);
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
