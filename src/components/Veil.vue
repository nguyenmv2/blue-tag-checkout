<template>
  <div class="flex-1 flex flex-col px-4">
    <carousel :perPage="1" class="my-auto img-slider flex-1">
      <slide v-for="img in images" :key="img.id">
        <img :src="img.src" :alt="img.alt" />
      </slide>
    </carousel>
    <div class="info flex flex-col self-center">
      {{ item.title }}
      <select name="variant" @change="changeVariant($event)">
        <option
          v-for="(option, i) in lengthOptions"
          :key="i"
          :value="option.value"
          >{{ option.value }}
        </option>
      </select>

      <button v-if="available" @click="selectVeil">Add Me</button>
      <button v-else-if="selected" @click="deselectVeil">Selected</button>
      <button v-else>Out of stock</button>
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
    }
  },
  data() {
    return {
      currentVariant: {},
      selected: false
    };
  },
  computed: {
    images() {
      return this.item.images;
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
    }
  },
  watch: {
    item: {
      immediate: true,
      handler() {
        let variants = this.item.variants.filter(
          variant =>
            variant.selectedOptions.find(opt => opt.name === "Type").value ===
            "Sample"
        );
        this.currentVariant = variants[0];
      }
    }
  },
  methods: {
    changeVariant(ev) {
      let option = ev.target.value;
      const variant = this.item.variants.find(variant => {
        let type = variant.selectedOptions.find(opt => opt.name == "Type");
        let length = variant.selectedOptions.find(opt => opt.name == "Length");
        return length.value === option && type.value === "Sample";
      });
      this.currentVariant = variant;
    },
    selectVeil() {
      this.$emit("select-veil", this.currentVariant);
      this.selected = true;
    },
    deselectVeil() {
      this.$emit("deselect-veil", this.currentVariant);
      this.selected = true;
    }
  }
};
</script>
<style scoped>
img {
  height: 500px;
  width: 370px;
}
</style>
