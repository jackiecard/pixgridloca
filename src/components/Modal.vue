<template>
  <transition name="modal">
    <div class="modal-mask" ref="modal">
      <div :class="['modal-wrapper', {'modal-wrapper--center-text': center}]">
        <div class="modal-container">

          <div class="modal-header">
            <slot name="header">
            </slot>
          </div>

          <div class="modal-body">
            <slot name="body">
            </slot>
          </div>

          <div class="modal-footer">
            <slot name="footer">
              <button class="btn btn--primary" @click="$emit('accept')">
                OK
              </button>
              <button class="btn btn--secondary" @click="$emit('quit')">
                Cancel
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    center: {
      required: false,
      type: Boolean
    }
  },
  mounted(){
    const app = document.querySelector('#app');
    app.appendChild(this.$refs.modal);
  }
}
</script>

<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .25);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
  text-align: left;

  &--center-text{
    text-align: center;
  }
}

.modal-container {
  min-width: 300px;
  max-width: 500px;
  margin: 0px auto;
  padding: 10px 20px;
  background-color: var(--second-layer-bg);
  border-radius: 2px;
  box-shadow: rgba(0, 0, 0, 0.25098) 6px 6px 0px -2px;
  transition: all .3s ease;
  font-size: 12px;
  color: var(--primary-color);
}

.modal-header h3 {
  margin-top: 0;
}

.modal-body {
  margin: 20px 0;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

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
