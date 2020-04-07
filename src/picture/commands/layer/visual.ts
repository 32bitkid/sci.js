import { DisableCommand, SetCommand, Type } from './index';
import { setLayer, disableLayer } from './layer';

export const set = (code: number): SetCommand => setLayer(Type.Visual, code);
export const disable = (): DisableCommand => disableLayer(Type.Visual);
