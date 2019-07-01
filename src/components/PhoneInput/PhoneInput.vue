<template>
    <div class="phone-input" :class="classList" @focusout="onFocusOut" @focusin="onFocusIn">

        <span class="phone-input__dropdown-button"
                @focus="onDropdownFocus"
                @blur="onDropdownBlur"
                aria-label="Выбрать формат номера"
                @keypress.space.stop="openDropdown"
                @click.stop="openDropdown"
                role="button"
                :tabindex="0">
            <slot name="caret">
                <span class="phone-input__dropdown-button-icon iti-flag" :class="country.toLowerCase()"></span>
            </slot>
        </span>

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
                <template slot="noResult">
                    Ничего не найдено
                </template>
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

        <input type="type"
               ref="input"
               v-model="phone"
               v-bind="attrs"
               @focus="onInputFocus"
               @blur="onInputBlur"
               class="phone-input__input">
    </div>
</template>

<script>
    import { EVT_OPEN_DROPDOWN, EVT_CLOSE_DROPDOWN, EVT_INPUT, EVT_VALIDATE } from './events'
    import focusMixin from './focusMixin'
    import propsMixin from './propsMixin'
    import locale from './locale/ru.json'
    import Multiselect from 'vue-multiselect'

    import parsePhoneNumberFromString from 'libphonenumber-js/es6/parsePhoneNumberFromString'
    import AsYouType from 'libphonenumber-js/es6/AsYouType'
    import parseIncompletePhoneNumber from 'libphonenumber-js/es6/parseIncompletePhoneNumber'
    import getCountryCallingCode from 'libphonenumber-js/es6/getCountryCallingCode'
    import meta from 'libphonenumber-js/metadata.mobile.json.js'

    /* Добавляем только те страны, что имеются в нашем списке и сортируем в алфвитном порядке */
    const countries = Object.keys(meta.countries).map(key => key)
        .filter(key => !!locale[key])
        .sort((prev, next) => {
            if (locale[prev] < locale[next]) return -1
            if (locale[prev] > locale[next]) return 1
            return 0
        })

    export default {
        mixins: [ propsMixin, focusMixin ],
        components: {
            Multiselect
        },

        watch: {
            value () {
                if(this.number && this.number.country) {
                    this.country = this.number.country
                }
            }
        },

        data() {
            return {
                country: this.defaultCountry,
                open: false,
                countries,
            }
        },

        created () {
            this.detectCountry()
        },

        beforeMount() {
            document.addEventListener('click', this.onClickOutside)
        },

        beforeDestroy() {
            document.removeEventListener('click', this.onClickOutside)
        },

        computed: {
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
                    return new AsYouType(null, meta).input(value)
                },
                set(value) {
                    this.setValue(value)
                }
            },
            callingCode() {
                return getCountryCallingCode(this.country, meta)
            },
            number() {
                return parsePhoneNumberFromString(String(this.value), this.country, meta)
            },
            isValid() {
                const valid = !this.number || !this.number.isValid()  ? false : true
                this.$emit(EVT_VALIDATE, valid)
                return valid
            },
            classList() {
                return {
                    'phone-input--normal': !this.compactView,
                    'phone-input--compact': this.compactView,
                    'phone-input--focus': this.focusCommon,
                    'phone-input--valid': this.isValid,
                }
            },
        },

        methods: {
            detectCountry () {
                const number = parsePhoneNumberFromString(String(this.value), null, meta)
                this.country = number ? number.country : this.country
            },
            setValue(value) {
                this.$emit(EVT_INPUT, parseIncompletePhoneNumber(value, meta))
            },
            onClickOutside() {
                this.closeDropdown()
            },
            getCountryCallingCode(country) {
                return getCountryCallingCode(country, meta)
            },
            getCountryName(country) {
                return locale[country]
            },
            openDropdown() {
                this.open = true
                this.$refs.dropdown.isOpen = true
                this.$emit(EVT_OPEN_DROPDOWN)
            },
            closeDropdown() {
                this.$refs.dropdown.isOpen = false
                this.open = false
                this.$emit(EVT_CLOSE_DROPDOWN)
            },
            focusInput() {
                this.$refs.input.focus()
            }
        }
    }
</script>

<style lang="scss">
    @import "./stylesheets/index.scss";
    @import "./stylesheets/compact.scss";
    @import "./stylesheets/sprite.scss";
</style>