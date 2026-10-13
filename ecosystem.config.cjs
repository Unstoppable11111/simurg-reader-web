module.exports = {
  apps: [
    {
      name: 'simurg-reader-web',
      cwd: '/www/wwwroot/simurg-reader-web',
      script: '.output/server/index.mjs',
      node_args: '--max-old-space-size=2048',

      // 性能优化：cluster 模式利用多核 CPU，提高并发处理能力
      exec_mode: 'cluster',
      instances: 2,

      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      cron_restart: '0 */12 * * *',

      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
    },
  ],
}