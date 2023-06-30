interface PluginConfig {
  manifestPath: string
  distFolder: string
  asset: string
  extensionId: string | {
    [key: string]: string
  }
  target: 'default' | 'trustedTesters' | 'draft' | 'local'
}

export default PluginConfig
