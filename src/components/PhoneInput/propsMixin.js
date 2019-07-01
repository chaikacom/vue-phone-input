export default {
    props: {
        defaultCountry: {
            type: String,
            default: 'RU'
        },

        value: {
            default: '',
            validator: prop => {
                return (['string', 'number'].indexOf(typeof prop) >= 0) || prop === null
            }
        },

        // focusOnSelect: {
        //     type: Boolean,
        //     default: false
        // },

        alwaysShowPrefix: {
            type: Boolean,
            default: false
        },

        compactView: {
            type: Boolean,
            default: false
        },

        type: {
            type: String,
            default: 'tel'
        }
    }
}