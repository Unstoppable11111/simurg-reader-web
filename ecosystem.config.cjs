module.exports = {
  apps: [
    {
      name: 'simurg-reader-web',
      script: './.output/server/index.mjs', 
      args: "start",
      // cwd: '/root/your_app_directory/',
      node_args: '--max-old-space-size=2048',
      exec_mode: 'cluster', 
      instances: '1',  
      autorestart: true, 
      watch: false,  
      max_memory_restart: '600M', 
      cron_restart: '0 */12 * * *', 
      env_production: {
        NODE_ENV: "production",
        PORT: 3001, 
      },
    },
  ],
}

