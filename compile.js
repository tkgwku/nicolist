const compressor = require('node-minify');

console.log(`Start compression`);
compressor.minify({
    compressor: 'uglifyjs',
    input: ['js/images.js', 'js/util.js', 'js/player.js', 'js/nicolist.js'],
    output: 'dist/js/nicolist.min.js'
}).then(() => {
    console.log(`Compressed JS => nicolist.min.js`);
}, () => {
    console.log(`[Error] Couldn't compress => nicolist.min.js`);
});

const htmlTargets  = ['index.html', 'player.html'];
let count = 0;
for (const html of htmlTargets){  
    compressor.minify({
        compressor: 'html-minifier',
        input: html,
        output: 'dist/'+html
    }).then(() => {
        count++;
        if (count === htmlTargets.length){
            console.log(`Compressed ${count} HTMLs`);
        }
    }, () => {
        console.log(`[Error] Couldn't compress ${html}`);
    });
}