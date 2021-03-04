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
import 'firebase/database';

const FLOW_LANE_NUMBER = 30;
const FLOW_LANE_OCCUPY_TIME = 2000; /*ms */
const FLOW_TIME = 10000; /*ms */

export default defineComponent({
  components: {
    FlowComment,
  },
  setup() {
    // state init
    const state = reactive({
      comments: [] as CommentModel[],
      inputComment: '',
      timeNow: Date.now(),
    });

    // 画面を分割
    // 割り当て状況を保持する
    const flowLane = ref(Array.from({ length: FLOW_LANE_NUMBER }, () => 0));

    // レーンを割り当てる
    const allocateFlowLane = () => {
      const unoccupiedFlowLaneIndex = flowLane.value.findIndex(
        Element => Element == 0,
      );

      if (unoccupiedFlowLaneIndex >= 0) {
        // レーン割り当て
        flowLane.value[unoccupiedFlowLaneIndex] = 1;

        // レーン解放
        setTimeout(() => {
          flowLane.value[unoccupiedFlowLaneIndex] = 0;
        }, FLOW_LANE_OCCUPY_TIME);
        return unoccupiedFlowLaneIndex;
      } else {
        // レーンの空きがない -> ランダムに流す
        return Math.floor(Math.random() * 20);
      }
    };

    /* firebase データ取得処理 */
    firebase
      .database()
      .ref('comment')
      .orderByChild('timestamp')
      .startAt(state.timeNow)
      .on('child_added', function(snapshot) {
        const newPost = snapshot.val();
        const lane = allocateFlowLane() * 3;
        const newComment = new CommentModel(
          newPost.id,
          newPost.color,
          newPost.text,
          `${lane}vh`,
        );
        state.comments.push(newComment);

        // 一定時間経過後、コメント削除
        setTimeout(() => {
          state.comments.shift();
        }, FLOW_TIME);
      });

    return {
      ...toRefs(state),
    };
  },
});
</script>
