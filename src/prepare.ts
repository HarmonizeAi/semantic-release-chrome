import SemanticReleaseError from '@semantic-release/error'
import archiver from 'archiver'
import { readJsonSync, writeJsonSync } from 'fs-extra'
import template from 'lodash.template'

import { createWriteStream } from 'fs'
import { resolve } from 'path'

import type PluginConfig from './@types/pluginConfig'
import { Context } from 'semantic-release'

function genVersionAndVersionName(branch: Context["branch"], version: string) {
  if (branch.type == "release") {
    return { version, version_name: version }
  }

  const preReleaseVersion = version.replace(`-${branch.name}`, "")
  const versionName = `${preReleaseVersion} ${branch.name}`
  return { version: preReleaseVersion, version_name: versionName }
}

const prepareManifest = (
  manifestPath: string,
  branch: Context["branch"],
  providedVersion: string,
  logger: Context['logger'],
) => {
  const manifest = readJsonSync(manifestPath)

  const {version, version_name} = genVersionAndVersionName(branch, providedVersion)

  writeJsonSync(manifestPath, { ...manifest, version, version_name }, { spaces: 2 })

  logger.log('Wrote version %s version_name %s to %s', version, version_name, manifestPath)
}

const zipFolder = (
  asset: string,
  distFolder: string,
  logger: Context['logger'],
) => {
  const zipPath = resolve(asset)
  const output = createWriteStream(zipPath)
  const archive = archiver('zip')

  archive.pipe(output)

  archive.directory(distFolder, false)
  archive.finalize()

  logger.log('Wrote zipped file to %s', zipPath)
}

const prepare = (
  { manifestPath, distFolder, asset }: PluginConfig,
  { nextRelease, logger, lastRelease, branch, commits }: Context,
) => {
  if (!asset) {
    throw new SemanticReleaseError(
      "Option 'asset' was not included in the prepare config. Check the README.md for config info.",
      'ENOASSET',
    )
  }

  const version = nextRelease?.version
  if (!version) {
    throw new SemanticReleaseError(
      'Could not determine the version from semantic release.',
    )
  }

  const normalizedDistFolder = distFolder || 'dist'

  const compiledAssetString = template(asset)({
    branch,
    lastRelease,
    nextRelease,
    commits,
  })

  prepareManifest(
    manifestPath || `${normalizedDistFolder}/manifest.json`,
    branch,
    version,
    logger,
  )
  zipFolder(compiledAssetString, normalizedDistFolder, logger)
}

export default prepare
