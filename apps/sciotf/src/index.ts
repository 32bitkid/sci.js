#!/usr/bin/env node
import sade from 'sade';
import { otfAction } from './actions/otf.js';
import { advancedAction } from './actions/advanced.js';

const prog = sade('@4bitlabs/scifont');

prog.version(process.env.__VERSION__ ?? 'unknown');

otfAction(prog);
advancedAction(prog);

prog.parse(process.argv);
