module.exports = {
    apps : [{
      script: 'index.js',
      watch: '.'
    }, {
      script: './service-worker/',
      watch: ['./service-worker']
    }],
  
    deploy : {
      production : {
        user : 'debian',
        host : '151.80.60.101',
        ref  : 'origin/master',
        repo : 'https://github.com/Zalgow667/ResaRestoAPI.git',
        path : '/home/debian/server',
        'pre-deploy-local': '',
        'post-deploy' : 'npm install && pm2 reload ecosystem.config.cjs --env production',
        'pre-setup': ''
      }
    }
  };