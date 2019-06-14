<template>
    <div class="phone-input" :class="classList">

        <button class="phone-input__dropdown-button"
                v-show="!hideLocale"
                aria-label="Выбрать формат номера"
                @click.stop="openDropdown"
                :tabindex="focusOnSelect ? 0 : -1">
            <slot name="caret">
                <span class="phone-input__dropdown-button-icon iti-flag" :class="country.toLowerCase()"></span>
            </slot>
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
                <template slot="singleLabel">
                    {{ getCountryName(country) }}
                </template>
                <template slot="option" slot-scope="{ option }">
                    <div class="phone-input__dropdown-option">
                        <span class="phone-input__dropdown-option-name">{{ getCountryName(option) }}</span>
                        <span class="phone-input__dropdown-options-code">+{{ getCountryCallingCode(option) }}</span>
                    </div>
                </template>
            </multiselect>
        </div>

        <input type="text"
               ref="input"
               v-model="phone"
               v-bind="attrs"
               @focus="onInputFocus"
               @blur="onInputBlur"
               class="phone-input__input">
    </div>
</template>

<script>
    import propsMixin from './propsMixin'
    import locale from './locale/ru.json'
    import Multiselect from 'vue-multiselect'
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
        mixins: [propsMixin],
        components: {
            Multiselect
        },

        data() {
            return {
                country: this.defaultCountry,
                open: false,
                countries,
                focus: false,
            }
        },


        beforeMount() {
            document.addEventListener('click', this.onClickOutside)
        },

        beforeDestroy() {
            document.removeEventListener('click', this.onClickOutside)
        },

        computed: {
            hideLocale () {
                return this.compactView && !this.focus && !this.open
            },
            attrs () {
                const { ...attrs } = this.$attrs
                return attrs
            },
            prefix () {
                return `+${this.callingCode}`
            },
            hideValue () {
                const isEmpty = this.value === this.prefix || !this.value
                return !this.focus && isEmpty && !this.alwaysShowPrefix
            },
            phone: {
                get() {
                    const regex = new RegExp(`^\\${this.prefix}`)
                    let value = this.number ? this.number.number : this.value
                    if(this.hideValue) return ''
                    if(!regex.test(value)) value = this.prefix + value
                    return new AsYouType().input(value)
                },
                set(value) {
                    this.setValue(value)
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
                const valid = !this.number || !this.number.isValid()  ? false : true
                this.$emit('validation', valid)
                return valid
            },
            classList() {
                return {
                    'phone-input--valid': this.isValid,
                }
            },
        },

        methods: {
            setValue(value) {
                this.$emit('input', parseIncompletePhoneNumber(value))
            },

            onInputBlur () {
                this.focus = false
                this.$emit('blur')
            },

            onInputFocus () {
                this.focus = true
                this.$emit('focus')
            },

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
                this.$nextTick(() => {
                    this.$refs.input.focus()
                })
            }
        }
    }
</script>

<style lang="scss">
    @import "./stylesheets/index.scss";
    @import "./stylesheets/sprite.scss";
</style>