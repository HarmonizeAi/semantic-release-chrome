interface PluginConfig {
  manifestPath: string
  distFolder: string
  asset: string
  extensionId: string | {
    [key: string]: string
  },
  noUpload: boolean | undefined,
  target: 'default' | 'trustedTesters' | 'draft' | 'local'
}

export default PluginConfig
