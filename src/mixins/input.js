export default {
  props: {
    autofocus: [Boolean, String],
    maxHeight: Number,
    placeholder: String,
    loading: Boolean
  },
  data () {
    return {
      focused: false,
      timer: null,
      isNumberError: false,
      isNegZero: false
    }
  },
  methods: {
    focus () {
      if (!this.disable) {
        this.$refs.input.focus()
      }
    },
    blur () {
      this.$refs.input && this.$refs.input.blur()
    },
    select () {
      this.$refs.input.select()
    },

    __onFocus (e) {
      clearTimeout(this.timer)
      if (this.focused) {
        return
      }
      this.focused = true
      this.$refs.input && this.$refs.input.focus()
      this.$emit('focus', e)
    },
    __onInputBlur (e) {
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.__onBlur(e)
      }, 200)
    },
    __onBlur (e) {
      if (this.focused) {
        this.focused = false
        this.$emit('blur', e)
      }
      this.__emit()
    },
    __emit () {
      const isNumberError = this.isNumber && this.isNumberError
      const value = isNumberError ? (this.isNegZero ? -0 : null) : this.model
      if (isNumberError) {
        this.$emit('input', value)
      }
      this.$nextTick(() => {
        if (JSON.stringify(value) !== JSON.stringify(this.value)) {
          this.$emit('change', value)
        }
      })
    },
    __onKeydown (e) {
      if (this.type !== 'textarea' && e.keyCode === 13) {
        this.__emit()
      }
      this.$emit('keydown', e)
    },
    __onKeyup (e) {
      this.$emit('keyup', e)
    },
    __onClick (e) {
      this.focus()
      this.$emit('click', e)
    }
  },
  mounted () {
    this.$nextTick(() => {
      const input = this.$refs.input
      if (this.autofocus && input) {
        input.focus()
        if (this.autofocus === 'select') {
          input.select()
        }
      }
    })
  },
  beforeDestroy () {
    clearTimeout(this.timer)
  }
}
