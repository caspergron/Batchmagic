module.exports = {
  apps: [
    {
      name: 'batch-magic-clientside',
      script: 'npm run',
      args: 'start:prod',
      cwd: '/srv/www/front.dev.batchmagic.com/www/batch-magic-clientside',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
