import type { FilterChain, FilterGraph } from './filter-graph';

interface CrtFilterGraphOptions {
  defaultFps?: number;
  desiredFps?: number;
  hBlur?: number;
  curve?: number;
  halationBlur?: number;
  resolution?: [number, number];
  image?: true;
}

export const crtFilterGraph = (
  options: CrtFilterGraphOptions = {},
): FilterGraph => {
  const {
    defaultFps = 25,
    desiredFps = 60,
    hBlur = 2.5,
    curve = 0.02,
    halationBlur = 32,
    resolution = [-2, 720],
    image = false,
  } = options;

  const fpsChain: FilterChain = [
    ['format', 'yuv420p'],
    ['settb', { expr: 'AVTB' }],
    ['setpts', `${(defaultFps / desiredFps).toFixed(5)}*(PTS-STARTPTS)`],
    ['fps', desiredFps],
  ];

  const crt: FilterChain = [
    ['gblur', { sigma: hBlur, sigmaV: 0, steps: 3 }],
    ['vignette', 'PI/7.5'],
    ['pad', ['iw+8', 'ih+8', '4', '4', 'black']],
    ['lenscorrection', { k1: curve, k2: curve, i: 'bilinear' }],
    ['crop', 'iw-8:ih-8'],
  ];

  const rescale: FilterChain = [
    ['scale', [...resolution, 'flags=lanczos']],
    ['pad', ['iw+24', 'ih+24', '12', '12', 'black']],
  ];

  const halation: FilterChain = [
    ['blend', 'overlay'],
    ['gblur', { sigma: halationBlur, steps: 3 }],
    ['eq', { brightness: -0.5 }],
  ];

  return [
    [[], [...crt, ['split', 3]], ['crt0', 'crt1', 'crt2']],
    [['crt1'], [['rgbashift', { rh: 10, bv: 10, gh: -10 }]], ['hal1']],
    [['crt0', 'hal1'], halation, ['hal2']],
    [['crt2', 'hal2'], [['blend', 'screen']], ['final']],
    [['final'], [...rescale, ...(image ? [] : fpsChain)], []],
  ];
};
