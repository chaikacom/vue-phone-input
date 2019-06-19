import { EVT_FOCUS_DROPDOWN, EVT_BLUR_DROPDOWN, EVT_BLUR_INPUT, EVT_FOCUS_INPUT, EVT_FOCUS_IN, EVT_FOCUS_OUT } from "./events";

export default {
    data () {
        return {
            focus: false,
            focusDropdown: false,
            focusCommon: false,
        }
    },

    watch: {
        focusCommon (value) {
            this.$emit(value ? EVT_FOCUS_IN : EVT_FOCUS_OUT)
        }
    },

    methods: {
        onDropdownFocus () {
            this.focusDropdown = true
            this.$emit(EVT_FOCUS_DROPDOWN)
        },

        onDropdownBlur () {
            this.focusDropdown = false
            this.$emit(EVT_BLUR_DROPDOWN)
        },

        onInputFocus () {
            this.focus = true
            this.$emit(EVT_FOCUS_INPUT)
        },

        onInputBlur () {
            this.focus = false
            this.$emit(EVT_BLUR_INPUT)
        },

        onFocusOut (e) {
            const isOutside = !e.relatedTarget || !this.$el.contains(e.relatedTarget)
            if(!isOutside) return
            this.focusCommon = false
            this.open = false
        },

        onFocusIn () {
            this.focusCommon = true
        }
    }
}