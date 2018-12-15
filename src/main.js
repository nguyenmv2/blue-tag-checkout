import Vue from "vue";
import VueCarousel from "vue-carousel";
import App from "./App.vue";
import "./assets/tailwind.css";

Vue.config.productionTip = false;
Vue.use(VueCarousel);

let checkoutId = document.getElementById("app").dataset.checkoutId;
if (!checkoutId) {
  checkoutId = window.localStorage.getItem(
    "842ea89dedb8e2075e5434240efe2402.bluetagbridal.myshopify.com.checkoutId"
  );
}
new Vue({
  render: h => h(App, { props: { checkoutId } })
}).$mount("#app");
