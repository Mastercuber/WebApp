<template>
  <div class="comment" :class="{ highlight: highlight }">
    <template v-if="comment.deleted">
      <div class="comment-aside">
      </div>
      <div class="comment-main comment-deleted" ref="commentMain">
        <hc-icon icon="ban" class="comment-deleted-icon" />
        {{ $t('component.contribution.commentDeletedByUser') }}
      </div>
    </template>
    <template v-else>
      <div class="comment-aside">
        <hc-author :user="comment.user"
          :showText="false" />
      </div>
      <div class="comment-main depth-zero" ref="commentMain">
        <div class="comment-header">
          <div class="comment-header-author">
            <hc-author :user="comment.user"
              :showAvatar="false"
              :isAuthor="isAuthor"
              :createdAt="comment.createdAt" />
          </div>
          <div class="comment-header-actions">
            <template v-if="isOwner">
              <div class="disabled">
                <small v-if="comment.upvoteCount > 0"><strong>+{{ comment.upvoteCount || 0 }}</strong></small>&nbsp;
                <i class="fa fa-angle-double-up"></i>&nbsp;
              </div>
            </template>
            <template v-else>
              <hc-tooltip :label="$t('component.contribution.commentUpvote')" type="is-black" position="is-left">
                <a @click.once="onUpvote(comment)" style="border: none; text-decoration: none; color: #666">
                  <small v-if="comment.upvoteCount > 0"><strong>+{{ comment.upvoteCount || 0 }}</strong></small>&nbsp;
                  <i class="fa fa-angle-double-up"></i>&nbsp;
                </a>
              </hc-tooltip>
            </template>
          </div>
        </div>
        <div v-html="getText" class="comment-text" v-if="!edit"></div>
        <form class="comment-form" @submit.prevent="patchComment" v-else>
          <hc-editor identifier="comment"
            editorClass="autowrap"
            v-on:input="editorText"
            v-model="newContent"
            :editorOptions="editorOptions" />
          <div class="comment-form-actions">
            <hc-button
              class="button is-hidden-mobile"
              color="light"
              :disabled="isLoading"
              @click="cancelEdit">
              {{ $t('button.cancel') }}
            </hc-button>
            <hc-button
              :formSubmit="true"
              :disabled="!newContent"
              :isLoading="isLoading">
              {{ $t('button.saveComment','Submit comment') }}
            </hc-button>
          </div>
        </form>
        <div class="comment-footer">
          <div class="comment-footer-actions-left">
            <hc-tooltip :label="$t('component.contribution.commentReplyThis')" type="is-black" position="is-right" v-if="!isOwner && depth == 0 ">
              <a class="level-item" @click.prevent="$emit('reply', comment); openCommentForm();">
                <span class="icon is-small"><i class="fa fa-reply"></i></span>
              </a>
            </hc-tooltip>
            <template v-if="isOwner && !edit">
              <hc-tooltip :label="$t('component.contribution.commentEdit')" type="is-black" position="is-right">
                <hc-button @click.prevent="startEdit" color="white" size="small" type="link">
                  <hc-icon icon="pencil" class="icon-left" />
                </hc-button>
              </hc-tooltip>&nbsp;
              <hc-tooltip :label="$t('component.contribution.commentDelete')" type="is-black" position="is-right">
                <hc-button @click.prevent="removeComment" color="white" size="small" type="link">
                  <hc-icon icon="ban" class="icon-left is-danger" />
                </hc-button>
              </hc-tooltip>
            </template>
          </div>
          <div class="comment-footer-actions-right">
            <a v-if="isTruncated" @click="toggleText" class="is-small">
              <span v-if="!fullContentShown">{{ $t('button.showMore', 'Mehr') }} <i class="is-small fa fa-angle-down"></i></span>
              <span v-else>{{ $t('button.showLess', 'Weniger') }} <i class="is-small fa fa-angle-up"></i></span>
            </a>
          </div>
        </div>
        <transition-group name="comment" tag="div">
          <hc-comment v-if="depth < maxDepth" v-for="childComment in comment.children"
                   @reply="$parent.onReply ? $parent.onReply : () => {}"
                   :isAuthor="childComment.userId === post.userId"
                   :isOwner="childComment.userId === user._id"
                   :key="childComment._id"
                   :comment="childComment"
                   :post="post"
                   :depth="depth + 1"
                   :onUpvote="onUpvote"
                   />
        </transition-group>
        <hc-comment-form class="comment-form" :post="post" :replyComment="comment" v-if="isReplying" :depth="depth" v-on:input="editorText"/>
      </div>
    </template>
  </div>
</template>

<script>
  import { mapGetters, mapActions } from 'vuex'
  import author from '~/components/Author/Author.vue'
  import commentForm from '~/components/Comments/CommentForm.vue'
  import button from '~/components/Global/Elements/Button/Button.vue'
  import tooltip from '~/components/Global/Elements/Tooltip/Tooltip.vue'
  import icon from '~/components/Global/Elements/Icon/Icon.vue'
  import linkifyHtml from 'linkifyjs/html'

  export default {
    name: 'hc-comment',
    components: {
      'hc-comment-form': commentForm,
      'hc-author': author,
      'hc-button': button,
      'hc-tooltip': tooltip,
      'hc-icon': icon
    },
    props: {
      onUpvote: {
        type: Function,
        required: true
      },
      comment: {
        type: Object,
        required: true
      },
      isAuthor: {
        type: Boolean
      },
      isOwner: {
        type: Boolean
      },
      post: {
        type: Object
      },
      depth: {
        type: Number,
        default: 0
      },
      maxDepth: {
        type: Number,
        default: 1
      }
    },
    data () {
      return {
        fullContentShown: false,
        highlight: false,
        edit: false,
        isLoading: false,
        isReplying: false,
        newContent: '',
        editorOptions: {
          placeholder: this.$t('component.contribution.commentPlaceholder', 'Whatever comes to your mind...'),
          modules: {
            toolbar: null,
            pasteHandler: {}
          }
        }
      }
    },
    computed: {
      ...mapGetters({
        showComment: 'comments/showComment',
        user: 'auth/user'
      }),
      getText () {
        return (this.fullContentShown && this.content)
          ? linkifyHtml(this.content)
          : linkifyHtml(this.comment.contentExcerpt)
      },
      isTruncated () {
        if (this.comment.hasMore === undefined) {
          // old logic
          return this.getText.slice(-3) === '...' ||
                 this.getText.slice(-1) === '…' ||
                 this.getText.slice(-7) === '...</p>' ||
                 this.getText.slice(-5) === '…</p>' ||
                 this.fullContentShown
        } else {
          // new logic
          return this.comment.hasMore
        }
      }
    },
    mounted () {
      if (this.depth > 0) {
        this.$refs.commentMain.classList.remove('depth-zero')
        this.$refs.commentMain.classList.add('depth-one')
      }

      this.scrollToCommentIfSelected()
    },
    methods: {
      ...mapActions({
        fetchById: 'comments/fetchById',
        remove: 'comments/remove',
        patch: 'comments/patch'
      }),
      openCommentForm () {
        if (this.depth == 0) {
          this.isReplying = true
        }
      },
      closeCommentForm () {
        if (this.depth == 0) {
          this.isReplying = false
        }
      },
      editorText (newText) {
        this.$emit('input', newText)
      },
      removeComment () {
        this.$dialog.confirm({
          title: this.$t('component.contribution.commentDelete'),
          message: this.$t('component.contribution.commentDeleteMsg'),
          confirmText: this.$t('button.confirmDelete'),
          cancelText: this.$t('button.cancel'),
          type: 'is-danger',
          hasIcon: true,
          onConfirm: () => this.remove(this.comment._id)
        })
      },
      startEdit () {
        this.fetchById(this.comment._id)
          .then((res) => {
            this.newContent = res.content
            this.edit = true
            this.fullContentShown = false
          })
      },
      cancelEdit () {
        this.edit = false
        this.newContent = this.comment.content
      },
      async patchComment () {
        this.isLoading = true
        const data = {
          _id: this.comment._id,
          content: this.newContent
        }
        await this.patch(data)
        setTimeout(() => {
          this.edit = false
          this.isLoading = false
        }, 600)
      },
      toggleText () {
        if (this.content) {
          this.fullContentShown = !this.fullContentShown
        } else {
          this.fetchById(this.comment._id)
            .then((res) => {
              this.content = res.content
              this.fullContentShown = !this.fullContentShown
            })
        }
      },
      scrollToCommentIfSelected () {
        // check if showComment is set and scroll to the selected comment item if the id matches
        if ((this.$route.query && this.$route.query.showComment === this.comment._id) || (this.showComment === this.comment._id)) {
          setTimeout(() => {
            this.$scrollTo(this.$el, 500, {
              onDone: () => {
                this.highlight = true
              }
            })
          }, 100)
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "assets/styles/utilities";

  .comment {
    margin-bottom: $margin;
    position: relative;
    display: flex;

    &.highlight {
      animation: highlight-animation;
      animation-duration: 1500ms;
      transition: background-color ease-out;
    }
  }

  .comment-aside {
    flex: 0 0 51px;
    width: 51px;
    padding-top: 10px;
  }

  .comment-main {
    position: relative;
    flex: 1 1 0;
    // overflow: visible;
    padding: $padding-small;
    background-color: $white;

    .depth-one {
      background-color: #f2efef
    }

    &.depth-zero:before {
      position: absolute;
      content: '';
      display: block;
      top: 20px;
      right: 100%;
      width: 0;
      height: 0;
      border-top: 6px solid transparent;
      border-bottom: 6px solid transparent;
      border-right: 6px solid $white;
    }
    &.depth-one:before {
      position: absolute;
      content: '';
      display: block;
      top: 20px;
      right: 100%;
      width: 0;
      height: 0;
      border-top: 6px solid transparent;
      border-bottom: 6px solid transparent;
      border-right: 6px solid #f2efef;
    }
  }

  .comment-deleted {
    display: flex;
    align-items: center;
    color: $grey;

    &:before {
      display: none;
    }
  }

  .comment-deleted-icon {
    margin-right: 5px;
  }

  .comment-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: $margin-small;
  }

  .comment-header-actions {
    display: flex;
    align-items: flex-start;
    & > * {
      margin-left: 5px;
    }
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

  .comment-footer {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-top: $margin-small;
  }

  .comment-text {
    color: $grey;
  }

  .comment-enter-active, .comment-leave-active {
    transition: all .5s ease-out;
  }

  .comment-enter, .comment-leave-to {
    opacity: 0;
    transform: translateX(-10px);
  }

  @keyframes highlight-animation {
    0% {
      background-color: $yellow;
    }
    20% {
      background-color: transparent;
    }
    40% {
      background-color: $yellow;
    }
    60% {
      background-color: $yellow;
    }
    100% {
      background-color: transparent;
    }
  }

  div.disabled {
    cursor: not-allowed;
  }
</style>
