import { computed, shallowRef, unref } from 'vue';
import { decomposeTSR, identity, Matrix } from 'transformation-matrix';

const viewMatrixRef = shallowRef<Matrix>(identity());
const transformRef = computed(() => decomposeTSR(unref(viewMatrixRef)));
const zoomRef = computed(() => {
  const { sx, sy } = unref(transformRef).scale;
  return (sx + sy) / 2;
});
const rotateRef = computed(() => unref(transformRef).rotation.angle);

export default {
  get viewMatrix() {
    return unref(viewMatrixRef);
  },
  set viewMatrix(value: Matrix) {
    viewMatrixRef.value = value;
  },
  get zoom() {
    return unref(zoomRef);
  },

  get rotate() {
    return unref(rotateRef);
  },
};
