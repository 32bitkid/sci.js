import { Instruction, InstructionMatcher, isInstr } from './instructions';

interface Registers {
  acc: number;
  ip: number;
}

interface Memory {
  stack: number[];
}

export interface PMachine extends Registers, Memory {}

interface InstructionHandler {
  (cpu: PMachine, program: DataView): void;
}

const ADD_Impl: InstructionHandler = (cpu) => {
  cpu.acc += cpu.stack.pop() ?? 0;
};

const PUSHI_8_Impl: InstructionHandler = (cpu, program) => {
  const data = program.getUint8(cpu.ip);
  cpu.ip += 1;
  cpu.stack.push(data);
};

export const InstrImpl: [InstructionMatcher, InstructionHandler][] = [
  [isInstr(Instruction.ADD), ADD_Impl],
  [isInstr(Instruction.PUSHI, 8), PUSHI_8_Impl],
];

export const DIE = (code: number) => (): never => {
  throw new Error(
    `Unhandled PMachine Code: 0x${code.toString(16).padStart(2, '0')}`,
  );
};

export const getImpl = (code: number): InstructionHandler =>
  InstrImpl.find(([fn]) => fn(code))?.[1] ?? DIE(code);
