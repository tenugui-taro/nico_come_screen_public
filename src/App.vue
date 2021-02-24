<template>
  <div name="app">
    <transition-group appear>
      <template v-for="comment in comments">
        <FlowComment :key="comment.id" :comment="comment" />
      </template>
    </transition-group>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from '@vue/composition-api';
import FlowComment from '@/components/FlowComment.vue';
import CommentModel from '@/model/CommentModel';
import firebase from '@/configs/firebase';

export default defineComponent({
  components: {
    FlowComment,
  },
  setup() {
    const state = reactive({
      comments: [] as CommentModel[],
      inputComment: '',
      timeNow: Date.now(),
    });

    const flowLane = ref(Array.from({ length: 30 }, () => 0));

    const getLane = () => {
      const index = flowLane.value.findIndex(Element => Element == 0);
      if (index >= 0) {
        flowLane.value[index] = 1;
        setTimeout(() => {
          flowLane.value[index] = 0;
        }, 2000);
        return index;
      } else {
        return Math.floor(Math.random() * Math.floor(40));
      }
    };

    firebase
      .database()
      .ref('comment')
      .orderByChild('timestamp')
      .startAt(state.timeNow)
      .on('child_added', function(snapshot, prevChildKey) {
        const newPost = snapshot.val();
        const lane = getLane();
        const newComment = new CommentModel(
          newPost.color,
          newPost.text,
          `${lane * 3}vh`,
        );
        state.comments.push(newComment);
        setTimeout(() => {
          state.comments.shift();
        }, 10000);
      });

    return {
      ...toRefs(state),
    };
  },
});
</script>
