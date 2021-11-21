import fs from 'fs-extra'
import type PkgType from '../package.json'
import { isDev, port, r } from '../scripts/utils'

export async function getPackage() {
  const pkg = await fs.readJSON(r('package.json')) as typeof PkgType
  const pkgJson = {}
  if (isDev) {
    // delete pkgJson.content_scripts
    pkgJson.permissions?.push('webNavigation')
  }

  return pkgJson
}
