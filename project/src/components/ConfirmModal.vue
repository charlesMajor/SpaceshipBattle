<template>
  <div
    class="modal fade"
    id="confirm-modal"
    tabindex="-1"
    aria-labelledby="confirm-modal"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ title }}</h5>
          <button
            type="button"
            data-bs-dismiss="modal"
            class="btn-close"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">
          {{ body }}
        </div>
        <div class="modal-footer">
          <button
            type="button"
            data-bs-dismiss="modal"
            class="btn btn-primary"
            @click="confirm"
          >
            {{ confirmButton }}
          </button>
          <button
            type="button"
            data-bs-dismiss="modal"
            class="btn btn-secondary"
          >
            {{ cancelButton }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap'

export default {
  emits: ['onModalConfirmed'],
  props: {
    trigger: Number,
    title: String,
    body: String,
    cancelButton: String,
    confirmButton: String
  },
  data () {
    return {
      modal: null
    }
  },
  mounted () {
    this.modal = new Modal('#confirm-modal')
  },
  watch: {
    trigger () {
      this.modal.show()
    }
  },
  methods: {
    confirm () {
      this.$emit('onModalConfirmed')
    }
  }
}
</script>
