module.exports = {
  apps : [{
    script: './source/backend/build/bin/server.js',
  }],

  deploy : {
    production : {
      key : 'key.pub',
      user : 'debian',
      host : '151.80.60.101',
      ref : 'main',
      repo : 'git@github.com:Zalgow667/ResaRestoAPI.git',
      path : '/home/debian',
      'pre-deploy-local': '',
      'post-deploy': 'source ~/.nvm/nvm.sh && cd /home/debian/source/backend && npm install && npm build && pm2 reload /home/debian/source/backend/ecosystem.config.cjs --env production',
      'pre-setup': '',
      'ssh_options': 'ForwardAgent=yes'
    }
  }
};
