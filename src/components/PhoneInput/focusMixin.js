import { EVT_FOCUS_DROPDOWN, EVT_BLUR_DROPDOWN, EVT_BLUR_INPUT, EVT_FOCUS_INPUT } from "./events";

export default {
    data () {
        return {
            focus: false,
            focusDropdown: false
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
        }
    }
}