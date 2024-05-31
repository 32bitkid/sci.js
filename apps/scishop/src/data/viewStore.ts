import { computed, shallowRef, unref } from 'vue';
import { decomposeTSR, identity, Matrix } from 'transformation-matrix';

export const viewMatrixRef = shallowRef<Matrix>(identity());

const transformRef = computed(() => decomposeTSR(unref(viewMatrixRef)));
export const zoomRef = computed(() => {
  const { sx, sy } = unref(transformRef).scale;
  return (sx + sy) / 2;
});
export const rotateRef = computed(() => unref(transformRef).rotation.angle);
