// Return only deployment settings; never print sandbox keys or the full environment.
import fs from 'node:fs';
import {parseEnv} from 'node:util';
const env=parseEnv(fs.readFileSync(process.argv[2],'utf8'));
console.log(JSON.stringify({origin:env.PUBLIC_ORIGIN,port:env.PORT,data:env.DATA_DIR,backup:env.BACKUP_DIR}));
