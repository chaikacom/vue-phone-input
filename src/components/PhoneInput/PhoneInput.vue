<template>
    <div class="phone-input" :class="classList">

        <button class="phone-input__dropdown-button"
                aria-label="Выбрать формат номера"
                @click.stop="openDropdown"
                :tabindex="focusOnSelect ? 0 : -1">
            <slot name="caret">•</slot>
        </button>

        <div class="phone-input__dropdown" v-show="open" @click.stop>
            <multiselect :options="countries"
                         ref="dropdown"
                         :show-labels="false"
                         :allow-empty="false"
                         @select="focusInput"
                         placeholder=""
                         @close="closeDropdown"
                         class="phone-input__select"
                         :custom-label="getCountryName"
                         v-model="country">
                <template slot="singleLabel">{{ getCountryName(country) }}</template>
            </multiselect>
        </div>

        <input type="text"
               ref="input"
               v-model="phone"
               class="phone-input__input">
    </div>
</template>

<script>
    import locale from './locale/ru.json'
    import Multiselect from 'vue-multiselect/dist/vue-multiselect.min'
    import examples from 'libphonenumber-js/examples.mobile.json.js'
    import meta from 'libphonenumber-js/metadata.mobile.json.js'
    import {
        parsePhoneNumberFromString,
        AsYouType,
        parseIncompletePhoneNumber,
        getCountryCallingCode,
        getExampleNumber
    } from 'libphonenumber-js/mobile'

    const countries = Object.keys(meta.countries).map(key => key)

    export default {
        components: {
            Multiselect
        },

        props: {
            defaultCountry: { type: String, default: 'RU' },
            value: {
                default: '',
                validator: prop => {
                    return (['string', 'number'].indexOf(typeof prop) >= 0) || prop === null
                }
            },
            lang: { type: String, default: 'RU' },
            focusOnSelect: { type: Boolean, default: false }
        },

        data() {
            return {
                country: this.defaultCountry,
                open: false,
                countries
            }
        },

        beforeMount() {
            document.addEventListener('click', this.onClickOutside)
        },

        beforeDestroy() {
            document.removeEventListener('click', this.onClickOutside)
        },

        computed: {
            phone: {
                get() {
                    const prefix = `+${this.callingCode}`
                    const regex = new RegExp(`^\\${prefix}`)
                    let value = this.number ? this.number.number : this.value
                    if(!regex.test(value)) value = prefix + value
                    return new AsYouType().input(value)
                },
                set(value) {
                    const number = parseIncompletePhoneNumber(value)
                    this.$emit('input', number)
                }
            },
            example() {
                return getExampleNumber(this.country, examples).formatInternational()
            },
            callingCode() {
                return getCountryCallingCode(this.country)
            },
            number() {
                return parsePhoneNumberFromString(String(this.value), this.country)
            },
            isValid() {
                if(!this.number) return false;
                return this.number.isValid()
            },
            classList() {
                return {
                    'phone-input--valid': this.isValid,
                }
            }
        },

        methods: {
            onClickOutside() {
                this.closeDropdown()
            },
            getCountryCallingCode(country) {
                return getCountryCallingCode(country)
            },
            getCountryName(country) {
                return locale[country]
            },
            openDropdown() {
                this.open = true
                this.$refs.dropdown.isOpen = true
            },
            closeDropdown() {
                this.$refs.dropdown.isOpen = false
                this.open = false
            },
            focusInput() {
                this.$refs.input.focus()
            }
        }
    }
</script>

<style lang="scss">
    @import "~vue-multiselect/dist/vue-multiselect.min.css";
    @import "./index.scss";
    @import "./sprite.scss";
</style>