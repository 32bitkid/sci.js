import { getImpl, type PMachine } from './pmachine';

export type Executor = (machine: PMachine, program: Uint8Array) => void;

export const execute: Executor = (cpu: PMachine, machineCode: Uint8Array) => {
  const program = new DataView(
    machineCode.buffer,
    machineCode.byteOffset,
    machineCode.byteLength,
  );

  do {
    const code = program.getUint8(cpu.ip);
    cpu.ip += 1;
    getImpl(code)(cpu, program);
  } while (cpu.ip < machineCode.length);
};
