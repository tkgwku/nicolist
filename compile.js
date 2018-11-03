const compressor = require('node-minify');

compressor.minify({
    compressor: 'uglifyjs',
    input: ['js/images.js', 'js/util.js', 'js/player.js', 'js/nicolist.js'],
    output: 'dist/js/nicolilst.min.js'
}).then(() => {
    console.log(`compressed nicolist.min.js`);
}, () => {
    console.log(`couldn't compress nicolist.min.js`);
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
            console.log(`compressed ${count} htmls`);
        }
    }, () => {
        console.log(`couldn't compress ${html}`);
    });
}