import Operation from '../../operations';
import { DisableCommand, SetCommand, Type } from './index';

export const setLayer = (layer: Type, code: number): SetCommand => ({
    operation: Operation.SetLayer,
    layer,
    code,
});

export const disableLayer = (layer: Type): DisableCommand => ({
    operation: Operation.DisableLayer,
    layer,
});
