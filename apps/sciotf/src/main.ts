#!/usr/bin/env node
import sade from 'sade';
import advancedAction from './actions/advanced.js';
import { otfAction } from './actions/otf.js';

const prog = sade('@4bitlabs/scifont');

prog.version(process.env.__VERSION__ ?? 'unknown');

otfAction(prog);
advancedAction(prog);

prog.parse(process.argv);
