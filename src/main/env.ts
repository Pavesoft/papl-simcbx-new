import { app } from 'electron'
import dotenv from 'dotenv'
import { dirname, join } from 'path'

// Dev: project root .env. Packaged: a site-configurable .env placed next to the installed exe.
if (app.isPackaged) {
  dotenv.config({ path: join(dirname(app.getPath('exe')), '.env') })
} else {
  dotenv.config()
}

process.env.DATABASE_URL ??= 'postgresql://postgres:postgres@localhost:5432/mydb?schema=public'
