import { join } from 'path';

import { pool } from 'workerpool';

const WORKER_PATH = join(__dirname, './workers.js');
const workers = pool(WORKER_PATH);
export default workers;
