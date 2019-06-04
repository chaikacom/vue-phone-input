<template>
    <div class="phone-input" :class="classList">

        <select v-model="country" class="phone-input__select">
            <option :value="key"
                    :key="key"
                    v-for="(option, key) in countries">{{ getCountryName(key) }} (+{{ getCountryCallingCode(key) }})</option>
        </select>

        <input type="text" v-model="phone" class="phone-input__input">
    </div>
</template>

<script>
    import locale from './locale/ru.json'
    import examples from 'libphonenumber-js/examples.mobile.json.js'
    import meta from 'libphonenumber-js/metadata.mobile.json.js'
    import {
        parsePhoneNumberFromString,
        AsYouType,
        findNumbers,
        parseIncompletePhoneNumber,
        formatIncompletePhoneNumber,
        getCountryCallingCode,
        getExampleNumber
    } from 'libphonenumber-js/mobile'

    export default {
        props: {
            defaultCountry: { type: String, default: 'RU' },
            value: { type: [String, Number], default: '' },
            lang: { type: String, default: 'RU' }
        },

        data() {
            return {
                country: this.defaultCountry,
            }
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
            countries() {
                return meta.countries
            },
            callingCode() {
                return getCountryCallingCode(this.country)
            },
            number() {
                return parsePhoneNumberFromString(this.value, this.country)
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
            getCountryCallingCode(country) {
                return getCountryCallingCode(country)
            },
            getCountryName(country) {
                return locale[country]
            },
        }
    }
</script>

<style lang="scss">
    @import "./index.scss";
    @import "./sprite.scss";
</style>