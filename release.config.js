module.exports = {
  branches: [
    "master",
    {
      name: "muti-app",
      prerelease: true
    }
  ],
  analyzeCommits: {
    releaseRules: [
      {
        type: 'docs',
        scope: 'README',
        release: 'patch',
      },
    ],
  },
}
