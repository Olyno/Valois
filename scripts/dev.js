require('child_process').spawn('sass', ['--watch', 'public/styles/sass/global.sass', 'public/styles/global.css'], {
    stdio: ['ignore', 'inherit', 'inherit'],
    shell: true
});

require('child_process').spawn('npm', ['run', 'dev:server'], {
    stdio: ['ignore', 'inherit', 'inherit'],
    shell: true
});