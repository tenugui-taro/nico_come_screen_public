<template>
  <h1
    class="comment-text"
    :style="{
      top: `${comment.posY}`,
      left: `-100vw`,
      color: `${comment.color}`,
    }"
    v-text="comment.text"
  />
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import CommentModel from '@/model/CommentModel';

export default defineComponent({
  props: {
    comment: { type: CommentModel },
  },
});
</script>

<style lang="scss" scoped>
.comment-text {
  position: absolute;
}

.v-enter-active {
  transition: all 13s linear;
}

.v-enter {
  transform: translateX(200vw);
}

.v-enter-to {
  transform: translateX(-100vw);
}
</style>
