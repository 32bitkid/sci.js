import { pool } from 'workerpool';
import { join } from 'path';

const WORKER_PATH = join(__dirname, './workers.js');
const workers = pool(WORKER_PATH);
export default workers;
