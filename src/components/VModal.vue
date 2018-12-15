<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container flex flex-col bg-white">
          <div class="modal-header">
            <slot name="header"> default header </slot>
          </div>
          <div class="modal-body flex-1 flex flex-col items-center text-blue">
            <slot name="body"> default body </slot>
          </div>
          <div class="modal-footer"></div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  name: "VModal"
};
</script>
<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-container {
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  height: 67vh;
  width: 80vw;
}
@media (min-height: 768px) {
  .modal-container {
    height: 80vh;
  }
}
@media (min-height: 1024px) {
  .modal-container {
    height: 67vh;
  }
}
.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
  max-height: 60vh;
}

.modal-default-button {
  float: right;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
