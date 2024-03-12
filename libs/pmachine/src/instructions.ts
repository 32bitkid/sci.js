export enum Instruction {
  BNOT = 0x00,

  ADD = 0x01,
  SUB = 0x02,
  MUL = 0x03,
  DIV = 0x04,
  MOD = 0x05,

  SHR = 0x06,
  SHL = 0x07,

  XOR = 0x08,
  AND = 0x09,
  OR = 0x0a,
  NEG = 0x0b,
  NOT = 0x0c,

  'EQ?' = 0x0d,
  'NE?' = 0x0e,
  'GT?' = 0x0f,
  'GE?' = 0x10,
  'LT?' = 0x11,
  'LE?' = 0x12,

  'UEQ?' = 0x13,
  'UNE?' = 0x14,
  'UGT?' = 0x15,
  'UGE?' = 0x16,
  'ULT?' = 0x17,
  'ULE?' = 0x18,

  JMP = 0x19,
  LDI = 0x1a,
  PUSH = 0x1b,
  PUSHI = 0x1c,
  TOSS = 0x1d,
  DUP = 0x3e,
}

export interface InstructionMatcher {
  (code: number): boolean;
}

export const isInstr =
  (instr: Instruction, size?: 8 | 16): InstructionMatcher =>
  (code) => {
    const [instrCode, sizeCode] = [code >>> 1, code & 0b1];
    if (instrCode !== instr) return false;
    if (!size) return true;
    return sizeCode === (size === 16 ? 0 : 1);
  };
