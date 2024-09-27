module.exports = {
  apps : [
      {
        name: 'web-app',
        script: './build/server.js',
        instances: 'max',
        exec_mode: 'cluster',
        autorestart: true,
      }, 
    ],
  
    deploy : {
      production : {
        user : 'debian',
        host : '151.80.60.101',
        ref  : 'main',
        repo : 'git@github.com:Zalgow667/ResaRestoAPI.git',
        path : '/home/debian/server',
        'pre-deploy-local': '',
        'post-deploy': 'npm install && pm2 reload /home/debian/server/ResaRestoAPI/backend/ecosystem.config.cjs --env production',
        'pre-setup': ''
      }
    }
  };