import fs from 'fs-extra'
import { getPackage } from '../src/package'
import { r, log } from './utils'

export async function writePackage() {
  await fs.writeJSON(r('out/package.json'), await getPackage(), { spaces: 2 })
  log('PRE', 'write package.json')
}

writePackage()
