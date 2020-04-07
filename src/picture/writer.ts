import { IBitWriter } from '@32bitkid/bits';

import * as Pic from './commands/commands';
import Operation from './operations';

const enum OpCode {
    SetVisual = 0xf0,
    DisableVisual = 0xf1,
    SetPriority = 0xf2,
    DisablePriority = 0xf3,
    SetControl = 0xfb,
    DisableControl = 0xfc,

    ShortLines = 0xf7,
    MediumLines = 0xf6,
    LongLines = 0xf5,

    SetPattern = 0xf9,
    ShortPatterns = 0xf4,
    MediumPatterns = 0xfd,
    LongPatterns = 0xfa,

    Fills = 0xf8,

    Extended = 0xfe,
    Done = 0xff,
}

const enum OpxCode {
    UpdatePalette = 0x00,
    SetPalette = 0x01,
}

function writeSetLayer(cmd: Pic.Layer.SetCommand, target: IBitWriter): void {
    switch (cmd.layer) {
        case Pic.Layer.Type.Priority:
            target.write8(OpCode.SetPriority);
            break;
        case Pic.Layer.Type.Control:
            target.write8(OpCode.SetControl);
            break;
        case Pic.Layer.Type.Visual:
            target.write8(OpCode.SetVisual);
            break;
    }
    target.write8(cmd.code);
}

function writeDisableLayer(cmd: Pic.Layer.DisableCommand, target: IBitWriter): void {
    switch (cmd.layer) {
        case Pic.Layer.Type.Priority:
            target.write8(OpCode.DisablePriority);
            break;
        case Pic.Layer.Type.Control:
            target.write8(OpCode.DisableControl);
            break;
        case Pic.Layer.Type.Visual:
            target.write8(OpCode.DisableVisual);
            break;
    }
}

function writePoint24(x: number, y: number, target: IBitWriter): void {
    const hiX = (x >>> 8) & 0xf;
    target.write4(hiX);
    const hiY = (y >>> 8) & 0xf;
    target.write4(hiY);
    const loX = x & 0xff;
    const loY = y & 0xff;
    target.write8(loX, loY);
}

function writePoint16(x: number, y: number, target: IBitWriter): void {
    const neg = 0x80;
    if (y >= 0) {
        target.write8(y & 0x7f);
    } else {
        target.write8(neg | (-y & 0x7f));
    }
    target.write8((x >>> 0) & 0xff);
}

function writePoint8(x: number, y: number, target: IBitWriter): void {
    target.write1(x < 0);
    target.write(Math.abs(x) & 0x7, 3);
    target.write1(y < 0);
    target.write(Math.abs(y) & 0x7, 3);
}

function writeFills(cmd: Pic.Draw.FillsCommand, target: IBitWriter): void {
    target.write8(OpCode.Fills);
    for (const [x, y] of cmd.points) {
        writePoint24(x, y, target);
    }
}

function writeSetPattern(cmd: Pic.SetPatternCommand, target: IBitWriter): void {
    target.write8(OpCode.SetPattern);
    target.skip(2);
    target.write1(!cmd.isSolid);
    target.write1(cmd.isRectangle);
    target.write4(cmd.size);
}

function writePatterns(cmd: Pic.Draw.PatternsCommand, target: IBitWriter): void {
    // TODO determine best delta size for set.
    const { points } = cmd;
    const deltas = points.map((point, i): [number, number, number?] => {
        if (i === 0) {
            return point;
        }
        const [x2, y2, code] = point;
        const [x1, y1] = points[i - 1];
        return [x2 - x1, y2 - y1, code];
    });

    const maxDelta = deltas.reduce(
        (max, [x, y]): number =>
            Math.abs(x) > max ? Math.abs(x) : Math.abs(y) > max ? Math.abs(y) : max,
        0,
    );

    if (maxDelta >= 128 || points.length === 1) {
        target.write8(OpCode.LongPatterns);
        points.forEach(([x, y, code]): void => {
            if (code !== undefined) target.write8(code);
            writePoint24(x, y, target);
        });
    } else if (maxDelta >= 8) {
        target.write8(OpCode.MediumPatterns);
        const [first, ...rest] = deltas;
        const [x, y, code] = first;
        if (code !== undefined) target.write8(code);
        writePoint24(x, y, target);
        rest.forEach(([dx, dy, code]): void => {
            if (code !== undefined) target.write8(code);
            writePoint16(dx, dy, target);
        });
    } else {
        target.write8(OpCode.ShortPatterns);
        const [first, ...rest] = deltas;
        const [x, y, code] = first;
        if (code !== undefined) {
            target.write8(code);
        }
        writePoint24(x, y, target);
        rest.forEach(([dx, dy, code]): void => {
            if (code !== undefined) target.write8(code);
            writePoint8(dx, dy, target);
        });
    }
}

export default function compileToSCI0(stack: Pic.Command[], target: IBitWriter): void {
    for (const cmd of stack) {
        switch (cmd.operation) {
            // Layer Control
            case Operation.SetLayer:
                writeSetLayer(cmd, target);
                break;
            case Operation.DisableLayer:
                writeDisableLayer(cmd, target);
                break;

            // Drawing
            case Operation.Fills:
                writeFills(cmd, target);
                break;
            case Operation.Patterns:
                writePatterns(cmd, target);
                break;

            // State
            case Operation.SetPattern:
                writeSetPattern(cmd, target);
                break;

            // Done
            case Operation.Done:
                break;
        }
    }

    // Write DONE code
    target.write8(OpCode.Done);
}
