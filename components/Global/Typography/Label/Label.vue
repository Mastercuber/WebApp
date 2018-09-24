<template>
  <label class="label">
    <slot></slot>
  </label>
</template>


<script>
  import translatable from '../../../mixins/translatable'

  export default {
    name: 'hc-label',
    mixins: [translatable],
    data () {
      return {}
    }
  }
</script>


<style>

</style>
