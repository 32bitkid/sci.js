import Operation from "./operations";

export type Command =
    | DoneCommand
    | Layer.SetCommand
    | Layer.DisableCommand
    | Draw.LinesCommand
    | Draw.PatternsCommand
    | Draw.FillsCommand
    | SetPatternCommand
    | SetPaletteCommand
    | UpdatePaletteCommand;

interface DoneCommand { operation: Operation.Done }
export const done = (): Command => ({ operation: Operation.Done });

export namespace Layer {
    export const enum Type {
        Visual,
        Priority,
        Control,
    }

    export interface SetCommand {
        operation: Operation.SetLayer;
        layer: Layer.Type;
        code: number;
    }

    export interface DisableCommand {
        operation: Operation.DisableLayer;
        layer: Layer.Type;
    }

    const setLayer = (layer: Type, code: number): SetCommand => ({
        operation: Operation.SetLayer,
        layer,
        code,
    });

    const disableLayer = (layer: Type): DisableCommand => ({
        operation: Operation.DisableLayer,
        layer,
    });

    export namespace Visual {
        export const set = (code: number): SetCommand => setLayer(Type.Visual, code);
        export const disable = (): DisableCommand => disableLayer(Type.Visual);
    }

    export namespace Priority {
        export const set = (code: number): SetCommand => setLayer(Type.Priority, code);
        export const disable = (): DisableCommand => disableLayer(Type.Priority);
    }

    export namespace Control {
        export const set = (code: number): SetCommand => setLayer(Type.Control, code);
        export const disable = (): DisableCommand => disableLayer(Type.Control);
    }
}

export namespace Draw {
    export interface LinesCommand {
        operation: Operation.Lines;
        points: [number, number][];
    }

    export const lines = (...points: [number, number][]): LinesCommand => ({
        operation: Operation.Lines,
        points,
    });

    export interface FillsCommand {
        operation: Operation.Fills;
        points: [number, number][];
    }

    export const fills = (...points: [number, number][]): FillsCommand => ({
        operation: Operation.Fills,
        points
    });

    export interface PatternsCommand {
        operation: Operation.Patterns;
        points: [number, number, number?][];
    }

    export const patterns = (...points: [number, number, number?][]): PatternsCommand  =>{
        return { operation: Operation.Patterns, points };
    }
}

export interface SetPatternCommand {
    operation: Operation.SetPattern;
    size: number;
    isRectangle: boolean;
    isSolid: boolean;
}

export const setPattern = (size: 0|1|2|3|4|5|6|7, isRectangle: boolean, isSolid: boolean): SetPatternCommand => ({
    operation: Operation.SetPattern,
    size, isRectangle, isSolid,
});

export interface UpdatePaletteCommand {
    operation: Operation.UpdatePalette;
    entries: { palette: number; index: number; color: number }[];
}

export const updatePalette = (
    ...entries: { palette: number; index: number; color: number }[]
): UpdatePaletteCommand => ({
    operation: Operation.UpdatePalette,
    entries,
});

export interface SetPaletteCommand {
    operation: Operation.SetPalette;
    palette: number;
    colors: number[];
}

export const setPalette = (palette: number, colors: number[]): SetPaletteCommand => ({
    operation: Operation.SetPalette,
    palette, colors,
});