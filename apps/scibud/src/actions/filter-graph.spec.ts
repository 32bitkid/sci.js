import {
  FilterChain,
  FilterGraph,
  formatChain,
  formatFilter,
  formatGraph,
  formatValue,
} from './filter-graph';

describe('FilterValue', () => {
  it('should serialize', () => {
    expect(formatValue('a')).toBe('a');
    expect(formatValue(10)).toBe('10');
    expect(formatValue(true)).toBe('true');
  });
});

describe('Filter', () => {
  it('should serialize with no args', () => {
    expect(formatFilter(['foo'])).toBe('foo');
  });

  it('should serialize with a single value', () => {
    expect(formatFilter(['foo', 'bar'])).toBe('foo=bar');
    expect(formatFilter(['foo', 3.14])).toBe('foo=3.14');
    expect(formatFilter(['foo', false])).toBe('foo=false');
  });

  it('should serialize with mixed list of args', () => {
    expect(formatFilter(['pad', ['iw+8', 'ih+8', 4, 4]])).toBe(
      'pad=iw+8:ih+8:4:4',
    );
  });

  it('should serialize named args', () => {
    expect(
      formatFilter([
        'pad',
        { width: 'iw+8', height: 'ih+8', x: 4, y: 4, color: 'black' },
      ]),
    ).toBe('pad=width=iw+8:height=ih+8:x=4:y=4:color=black');
  });
});

describe('FilterChain', () => {
  it('should handle single filters', () => {
    expect(formatChain([['foo']])).toBe('foo');
  });

  it('should handle multiple filters', () => {
    expect(formatChain([['foo'], ['bar'], ['baz']])).toBe('foo,bar,baz');
  });

  it('should handle multiple filters args', () => {
    expect(
      formatChain([
        ['foo', 'a'],
        ['bar', ['b']],
        ['baz', { c: true }],
      ]),
    ).toBe('foo=a,bar=b,baz=c=true');
  });
});

describe('FilterGraph', () => {
  it('should serialize', () => {
    const chainA: FilterChain = [['foo']];
    const chainB: FilterChain = [['bar']];
    const chainC: FilterChain = [['baz']];

    expect(
      formatGraph([
        [[], chainA, ['L1', 'L2']],
        [['L1'], chainB, ['L3']],
        [['L2', 'L3'], chainC, []],
      ]),
    ).toBe('foo[L1][L2];[L1]bar[L3];[L2][L3]baz');
  });
});
