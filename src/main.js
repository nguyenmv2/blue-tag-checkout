import Vue from "vue";
import VueCarousel from "vue-carousel";
import App from "./App.vue";
import "./assets/tailwind.css";

Vue.config.productionTip = false;
Vue.use(VueCarousel);

const checkoutId = document.getElementById("app").dataset.checkoutId;
new Vue({
  render: h => h(App, { props: { checkoutId } })
}).$mount("#app");
