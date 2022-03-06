import fs from 'fs-extra'
import type { Manifest } from 'webextension-polyfill'
import type PkgType from '../package.json'
import { isDev, port, r } from '../scripts/utils'

export async function getManifest() {
  const pkg = await fs.readJSON(r('package.json')) as typeof PkgType

  // update this file to update this manifest.json
  // can also be conditional based on your need
  const manifest: Manifest.WebExtensionManifest = {
    manifest_version: 2,
    name: pkg.displayName || pkg.name,
    version: pkg.version,
    description: pkg.description,
    browser_action: {
      default_icon: './assets/logo/128.png',
      default_popup: './dist/popup/index.html',
    },
    options_ui: {
      page: './dist/options/index.html',
      open_in_tab: true,
      chrome_style: false,
    },
    background: {
      page: './dist/background/index.html',
      persistent: true,
    },
    icons: {
      16: './assets/logo/128.png',
      48: './assets/logo/128.png',
      128: './assets/logo/128.png',
    },
    content_security_policy: "style-src 'self' 'unsafe-inline'; script-src 'http://localhost:3303' 'self' 'unsafe-eval';  object-src 'self' ;",
    permissions: [
      'tabs',
      'contextMenus',
      'storage',
      'activeTab',
      'http://*/',
      'https://*/',
      'notifications',
      'unlimitedStorage',
      '<Call_urls>',
    ],
    content_scripts: [ {
      "all_frames": true,
      "exclude_globs": [ "https://chrome.google.com/*" ],
      js: ['./dist/contentScripts/index.global.js'],
      "matches": [ "http://*/*", "https://*/*", "file://*/*" ],
      "run_at": "document_start"
   } ],
    web_accessible_resources: [
      'dist/contentScripts/style.css'
    ],
  }

  if (isDev) {
    // for content script, as browsers will cache them for each reload,
    // we use a background script to always inject the latest version
    // see src/background/contentScriptHMR.ts
    delete manifest.content_scripts
    manifest.permissions?.push('webNavigation')

    // this is required on dev for Vite script to load
    manifest.content_security_policy = `style-src \'self\' \'unsafe-inline\'; script-src \'self\' http://localhost:${port} \'unsafe-eval\'; object-src \'self\'`
  }

  return manifest
}
