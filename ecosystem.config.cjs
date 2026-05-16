module.exports = {
  apps: [
    {
      name: 'simurg-reader-web',
      cwd: '/home/simurg-reader-web',
      script: '.output/server/index.mjs',
      node_args: '--max-old-space-size=2048',

      exec_mode: 'fork',
      instances: 1,

      autorestart: true,
      watch: false,
      max_memory_restart: '600M',
      cron_restart: '0 */12 * * *',

      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
    },
  ],
}