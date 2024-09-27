module.exports = {
  apps : [{
    script: './source/backend/build/bin/server.js',
  }],

  deploy : {
    production : {
      key : 'key.pem',
      user : 'debian',
      host : '151.80.60.101',
      ref : 'main',
      repo : 'git@github.com:Zalgow667/ResaRestoAPI.git',
      path : '/home/debian',
      'pre-deploy-local': '',
      'post-deploy': 'source ~/.nvm/nvm.sh && npm ci && npm run build && pm2 reload /home/debian/server/ResaRestoAPI/backend/ecosystem.config.cjs --env production',
      'pre-setup': '',
      'ssh_options': 'ForwardAgent=yes'
    }
  }
};
