import { ref, unref } from 'vue';

const canvasSizeRef = ref<[number, number]>([320, 190]);
const aspectRatioRef = ref<number>(6 / 5);

export default {
  get canvasRes() {
    return canvasSizeRef;
  },
  get aspectRatio() {
    return unref(aspectRatioRef);
  },
  set aspectRatio(value: number) {
    aspectRatioRef.value = value;
  },
};
