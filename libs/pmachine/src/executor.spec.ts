import { execute } from './executor';
import type { PMachine } from './pmachine';

describe('SCI0 PMachine', () => {
  it('should execute a simple program', () => {
    const cpu: PMachine = {
      acc: 0,
      ip: 0,
      stack: [],
    };

    execute(cpu, Buffer.from('390639050202', 'hex'));
    expect(cpu.acc).toBe(0x0b);
  });
});
