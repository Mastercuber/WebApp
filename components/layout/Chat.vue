<template>
  <hc-dropdown ref="dropdown"
               :mobileFull="true"
               :hideFooterTablet="true">
    <hc-navbar-button slot="toggle">
      <span class="chat-icon">
        <hc-icon icon="flag" class="icon-chat"></hc-icon>
      </span>
    </hc-navbar-button>
    <div class="hc-dropdown-content">
      <div class="hc-chat-title">
        <hc-dropdown-title>
          Chats and Chatrooms
        </hc-dropdown-title>
      </div>
      <div class="hc-chat-container">
        <div class="hc-chat-list">
          <hc-chat-room v-for="message in messages" :key="message._id" :user="message.user" :created-at="message.createdAt" class="author"></hc-chat-room>
        </div>
        <div class="hc-chat-sidebar">
          <ul>
            <li>hi</li>
            <li>ho</li>
          </ul>
        </div>
      </div>
    </div>
  </hc-dropdown>
</template>

<script>
  import {mapGetters, mapActions} from 'vuex'

  export default {
    name: 'hc-chat',
    components: {

    },
    data () {
      return {
      }
    },
    computed: {
      ...mapGetters({
        user: 'auth/user',
        messages: 'messages/all'
      })
    },
    methods: {

    },
     mounted () {
      this.$store.dispatch('messages/fetch');
      console.log('mounted!!!');
    }
  }
</script>

<style lang="scss" scoped>
  @import "assets/styles/utilities";

  .author {
    padding: 8px;
  }

  .hc-dropdown-content {
    width: 420px;

    @media screen and (max-width: 1500px){
      left: 200px !important;
    }
  }

  .hc-chat-list {
    max-height: 600px;
    overflow-y: auto;
    width: 220px;
  }

  .hc-chat-sidebar {
    top: 45px;
    left: 220px;
    width: 200px;
    position: fixed;
    background-color: silver;
  }
</style>
