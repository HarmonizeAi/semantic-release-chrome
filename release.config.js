module.exports = {
  branches: [
    "master",
    {
      name: "beta",
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
