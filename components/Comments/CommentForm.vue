<template>
  <div class="comment-form-container" v-if="post && isVerified">
    <div class="comment-form-aside">
      <hc-avatar :user="user" />
    </div>
    <form ref="commentForm" class="comment-form" @submit.prevent="submitComment">
      <hc-editor identifier="comment"
        ref="editor"
        v-on:input="editorText"
        editorClass="autowrap"
        v-model="form.content"
        :editorOptions="editorOptions" />
      <div class="comment-form-actions">
        <button type="button"
          class="button is-hidden-mobile"
          :disabled="this.isCommentFormOfContribution && !this.hasContent"
          @click="cancel">
          {{ $t('button.cancel') }}
        </button>
        <button type="submit"
          class="button is-primary"
          :disabled="!this.hasContent"
          :class="{ 'is-loading': isLoading }">
          {{ $t('button.submitComment','Submit comment') }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import { trim } from 'lodash'
  import avatar from '~/components/Global/Elements/Avatar/Avatar.vue'
  import editor from '~/components/Global/Form/Editor/Editor.vue'

  export default {
    name: 'hc-comment-form',
    components: {
      'hc-avatar': avatar,
      'hc-editor': editor
    },
    props: {
      post: {
        type: Object,
        required: true
      },
      replyComment: {
        type: Object
      },
      isCommentFormOfContribution: {
        type: Boolean,
        default: false
      },
      depth: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        isLoading: false,
        form: {
          content: '',
          contributionId: null,
          parentCommentId: null
        },
        editorOptions: {
          placeholder: this.$t('component.contribution.commentPlaceholder', 'Whatever comes to your mind...'),
          modules: {
            toolbar: null,
            pasteHandler: {}
          }
        }
      }
    },
    mounted () {
      this.reply(this.replyComment)
    },
    destroyed () {
      this.$store.commit('comments/setShowComment', null)
    },
    computed: {
      ...mapGetters({
        isVerified: 'auth/isVerified',
        user: 'auth/user'
      }),
      hasContent () {
        return !!trim(this.form.content.replace(/(<([^>]+)>)/ig, '')).length
      }
    },
    methods: {
      cancel () {
        if(this.replyComment) {
          this.$parent.closeCommentForm()
          this.editorText('')
          return
        }
        this.form.content = ''
      },
      editorText (newText) {
        this.$emit('input', newText)
      },
      reply (comment) {
        if (!comment) {
          return
        }
        this.$nextTick(function () {
          this.$refs.editor.$refs.editorMentions.insertMention(0, comment.user)
          this.$scrollTo(this.$refs.commentForm, 500)
        })
      },
      submitComment () {
        if (!this.hasContent) {
          this.editorText('')
          return
        }

        this.isLoading = true
        this.form.contributionId = this.post._id
        this.form.parentCommentId = this.replyComment ? this.replyComment._id : null

        this.$store.dispatch('comments/create', this.form)
          .then(() => {
            this.$snackbar.open({
              message: this.$t('component.contribution.commentSubmitSuccess', 'Thanks for your comment. You are awesome.'),
              duration: 4000,
              type: 'is-success'
            })
            this.isLoading = false
            this.form.content = ''
          })
          .catch((error) => {
            console.error(error)
            this.$toast.open({
              message: error.message,
              type: 'is-danger'
            })
            this.isLoading = false
          })

        if (this.replyComment) {
          this.$parent.closeCommentForm()
        }
        this.editorText('')
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "assets/styles/utilities";

  .comment-form-container {
    border-top: 1px solid $grey-lighter;
    margin-top: $margin-large;
    padding-top: $margin-large;
    display: flex;
  }

  .comment-form-aside {
    flex: 0 0 51px;
    width: 51px;
    padding-top: 5px;
  }

  .comment-form {
    flex: 1 1 0;
    // overflow: auto;
  }

  .comment-form-actions {
    padding-top: $padding-small;
    display: flex;
    justify-content: space-between;

    .button {
      width: 100%;

      @media (min-width: $tablet) {
        width: auto;
        min-width: 160px;
      }
    }
  }

</style>
