<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <div>
      <phone-input v-model="phone" focus-on-select compact-view always-show-prefix></phone-input>
    </div>
  </div>
</template>

<script>
import PhoneInput from './components/PhoneInput/PhoneInput.vue'

export default {
  name: 'app',
  components: {
      PhoneInput
  },
  data() {
    return {
        phone: null,
    }
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
