import { FilterChain, FilterGraph } from './filter-graph';

export const crtFilterGraph: () => FilterGraph = () => {
  const fpsChain: FilterChain = [
    ['settb', { expr: 'AVTB' }],
    ['setpts', `${(25 / 60).toFixed(5)}*(PTS-STARTPTS)`],
    ['fps', 60],
  ];

  const crt: FilterChain = [
    ['gblur', { sigma: 2.5, sigmaV: 0, steps: 3 }],
    ['vignette', 'PI/7.5'],
    ['pad', ['iw+8', 'ih+8', '4', '4', 'black']],
    ['lenscorrection', { k1: 0.02, k2: 0.02, i: 'bilinear' }],
    ['crop', 'iw-8:ih-8'],
  ];

  const rescale: FilterChain = [
    ['format', 'yuv420p'],
    ['scale', [-2, 720, 'flags=lanczos']],
    ['pad', ['iw+24', 'ih+24', '12', '12', 'black']],
  ];

  const halation: FilterChain = [
    ['blend', 'overlay'],
    ['gblur', { sigma: 32, steps: 3 }],
    ['eq', { brightness: -0.5 }],
  ];

  return [
    [[], fpsChain, ['fps']],
    [['fps'], crt, ['crt']],
    [['crt'], [['split', 3]], ['crt0', 'crt1', 'crt2']],
    [['crt1'], [['rgbashift', { rh: 10, bv: 10, gh: -10 }]], ['hal1']],
    [['crt0', 'hal1'], halation, ['hal2']],
    [['crt2', 'hal2'], [['blend', 'screen']], ['final']],
    [['final'], rescale, []],
  ];
};
