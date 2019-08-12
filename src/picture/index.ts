
export function SCIColor(index: number): number;
export function SCIColor(palette: number, index: number): number;
export function SCIColor(arg1: number, arg2?: number): number {
    const [palette, color] = arg2 ? [arg1, arg2] : [0, arg1];
    return ((palette % 4) * 40 + (color % 40));
}


