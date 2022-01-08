export enum ResourceType {
  VIEW = 0,
  PIC = 1,
  SCRIPT = 2,
  TEXT = 3,
  SOUND = 4,
  MEMORY = 5,
  VOCAB = 6,
  FONT = 7,
  CURSOR = 8,
  PATCH = 9,
}

// Mutations

export const getResourceType = (id: number): ResourceType => id >>> 11;
export const getResourceNumber = (id: number): number => id & 0b111_1111_1111;

// Formatters

export const getResourceIdStr = (id: number) =>
  `(${getResourceTypeStr(id)}:${getResourceNumber(id)})`;

export const getResourceTypeStr = (id: number) => {
  const type = getResourceType(id);
  switch (type) {
    case ResourceType.VIEW:
      return 'View';
    case ResourceType.PIC:
      return 'Pic';
    case ResourceType.SCRIPT:
      return 'Script';
    case ResourceType.TEXT:
      return 'Text';
    case ResourceType.SOUND:
      return 'Sound';
    case ResourceType.MEMORY:
      return 'Memory';
    case ResourceType.VOCAB:
      return 'Vocab';
    case ResourceType.FONT:
      return 'Font';
    case ResourceType.CURSOR:
      return 'Cursor';
    case ResourceType.PATCH:
      return 'Patch';
    default:
      throw new Error(`Unsupported resource type: ${type}`);
  }
};

// Predicates

type ResourceIdPredicate = (it: number) => boolean;

export const isResourceType =
  (...types: ResourceType[]): ResourceIdPredicate =>
  (it: number): boolean =>
    types.includes(getResourceType(it));

export const isResourceNumber =
  (...numbers: number[]): ResourceIdPredicate =>
  (it: number): boolean =>
    numbers.includes(getResourceNumber(it));
