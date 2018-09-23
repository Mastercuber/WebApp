<template>
  <div class="columns is-mobile field has-text-centered">
    <div class="column control has-text-centered">
      <hc-button color="button"
                 :disabled="blacklistPending"
                 :isLoading="blacklistPending"
                 @click="clickBlacklistButton">
        <template v-if="isBlacklisted">
          <hc-icon icon="ban" :class="['icon-left', 'is-danger']" /> {{ $t('component.blacklist.buttonLabelUnblock') }}
        </template>
        <template v-else>
          <hc-icon icon="ban" class="icon-left" /> {{ $t('component.blacklist.buttonLabelBlock') }}
        </template>
      </hc-button>
    </div>
  </div>
</template>
<script>
import icon from '~/components/Global/Elements/Icon/Icon.vue'
import button from '~/components/Global/Elements/Button/Button.vue'

export default {
  name: 'hc-block-button',
  components: {
    button,
    icon
  },
  props: {
    entity: {
      type: Object,
      required: true
    },
    currentUser: {
      type: Object
      // TODO: required: true
    },
    blacklistPending: {
      type: Boolean,
      default: false
    },
    isBlacklisted: {
      type: Boolean,
      default: false
    },
    toggleBlacklist: {
      type: Function
    }
  },
  methods: {
    clickBlacklistButton() {
      this.toggleBlacklist();
    }
  }

}
</script>

<style lang="scss" scoped>
@import "assets/styles/utilities";
</style>
