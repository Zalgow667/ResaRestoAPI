module.exports = {
  apps: [
    {
      name: 'backend',
      script: './source/backend/build/bin/server.js',
      instances: 'max',
      exec_mode: 'cluster',
      watch: true,
      autorestart: true,
      env: {
        NODE_ENV: 'production', 
        PORT: 80,  
      },
    }, 
  ],
};
