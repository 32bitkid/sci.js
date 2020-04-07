import { DisableCommand, SetCommand, Type } from './index';
import { disableLayer, setLayer } from './layer';

export const set = (code: number): SetCommand => setLayer(Type.Control, code);
export const disable = (): DisableCommand => disableLayer(Type.Control);
