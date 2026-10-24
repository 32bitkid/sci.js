export enum DrawMode {
  Visual = 0b00001,
  Priority = 0b00010,
  Control = 0b00100,
  Mono = 0b01000,
  MonoDirect = 0b10000,

  /** @hidden */
  NONE = 0b000,
  /** @hidden */
  VP_ = 0b011,
  /** @hidden */
  V_C = 0b101,
  /** @hidden */
  _CP = 0b110,
  /** @hidden */
  VPC = 0b111,
}

export namespace DrawMode {
  export const isVisualMode = (mode: DrawMode): boolean =>
    (mode & DrawMode.Visual) === DrawMode.Visual;

  export const isPriorityMode = (mode: DrawMode): boolean =>
    (mode & DrawMode.Priority) === DrawMode.Priority;

  export const isControlMode = (mode: DrawMode): boolean =>
    (mode & DrawMode.Control) === DrawMode.Control;

  export const isMonoMode = (mode: DrawMode): boolean =>
    (mode & DrawMode.Mono) === DrawMode.Mono;

  export const isMonoDirectMode = (mode: DrawMode): boolean =>
    (mode & DrawMode.MonoDirect) === DrawMode.MonoDirect;
}
