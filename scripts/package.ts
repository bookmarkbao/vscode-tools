import fs from 'fs-extra'
import { getPackage } from '../src/package'
import { r, log } from './utils'

export async function writePackage() {
  let pkgJson = await getPackage()
  await fs.writeJSON(r('package.json'), pkgJson, { spaces: 2 })
  log('PRE', 'write package.json')
}

writePackage()
