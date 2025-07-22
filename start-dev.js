const concurrently = require('concurrently');

const { result } = concurrently([
  { 
    command: 'cd Frontend && npm start',
    name: 'frontend',
    prefixColor: 'blue'
  },
  { 
    command: 'cd Backend && npm start',
    name: 'backend',
    prefixColor: 'green'
  }
], {
  prefix: 'name',
  killOthers: ['failure', 'success'],
  restartTries: 3,
  restartDelay: 3000
});
