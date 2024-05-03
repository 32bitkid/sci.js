export type FilterValue = string | number | boolean;

export const isFilterValue = (it: unknown): it is FilterValue =>
  typeof it === 'boolean' || typeof it === 'number' || typeof it === 'string';

export const formatValue = (value: FilterValue): string => {
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  if (typeof value === 'number') return value.toString(10);
  return value;
};

export type FilterArgs =
  | Record<string, FilterValue>
  | FilterValue[]
  | FilterValue
  | undefined;

export type Filter = [name: string, args?: FilterArgs];

export const formatFilter = ([name, args]: Filter): string => {
  if (typeof args === 'undefined') return name;

  if (isFilterValue(args)) return `${name}=${formatValue(args)}`;
  if (Array.isArray(args)) return `${name}=${args.map(formatValue).join(':')}`;

  const argString = Object.entries(args)
    .map(([key, val]) => `${key}=${formatValue(val)}`)
    .join(':');

  return `${name}=${argString}`;
};

export type FilterChain = Filter[];
export const formatChain = (chain: FilterChain) =>
  chain.map(formatFilter).join(',');

export type GraphLink = string;
export const linkFmt = (links: GraphLink[]) =>
  links.map((it) => `[${it}]`).join('');

export type FilterGraph = [GraphLink[], FilterChain, GraphLink[]][];
export const formatGraph = (graph: FilterGraph) =>
  graph
    .map(([inLinks, chain, outLinks]) => {
      const inStr = linkFmt(inLinks);
      const chainStr = formatChain(chain);
      const outStr = linkFmt(outLinks);
      return `${inStr}${chainStr}${outStr}`;
    })
    .join(';');
