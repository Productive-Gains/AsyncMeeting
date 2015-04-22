var fs = require('fs'),
    redisServer = require('./redis-server'),
    mongoServer = require('./mongo-server'),
    spawn = require('child_process').spawnSync;

// TODO move all NPM JS files to Grunt

var calledBeforeExit = 0,
    serverList = [redisServer, mongoServer];

function killProcesses() {
    serverList.forEach(function(process){
        console.log('Killing process: ' + JSON.stringify(process.getProcessInfo()));
        process.kill();
    });
}

process.on('beforeExit', function (code) {
    if (calledBeforeExit > 0){
        return;
    }
    calledBeforeExit++;
    killProcesses();
});

process.on('SIGINT', function() {
    killProcesses();
});
serverList.forEach(function(server){
    server.start();
});

var dev = spawn('gulp', ['dev'], {
    detached: false,
    stdio: [ 'inherit', 'inherit', 'inherit' ],
    cwd: '.'
});
