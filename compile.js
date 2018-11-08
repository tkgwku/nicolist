const compressor = require('node-minify');
const fs = require('fs');

const deleteJS = true;

fs.readdir('ts', (err, files) => {
	if (err) throw err;
	let jslist = [];
	files.filter((file) => {
		return fs.statSync('ts/'+file).isFile() && /.*\.ts$/.test(file);
	}).map((file) => {
		return file.replace(/(.*)\.ts$/g, 'js/$1.js');
	}).forEach(function (file) {
		jslist.push(file);
	});
	console.log(`- target .js files:`);
	console.log(jslist);
	compress(jslist);
});

function compress(jslist) {
	console.log(`Start compression by 'uglifyjs'`);
	compressor.minify({
		compressor: 'uglifyjs',
		input: jslist,
		output: 'dist/js/nicolist.min.js'
	}).then(() => {
		console.log(`Compressed JS => nicolist.min.js`);
		if (deleteJS){
			for (let file of jslist){
				fs.unlink(file, (err) => {
					if (err) throw err;
				});
			}
			console.log(`Deleted temporary .js files`);
		}
	}, (err) => {
		throw err;
	});

	const htmlTargets  = ['index.html', 'player.html'];
	console.log(`- target .html files:`);
	console.log(htmlTargets);
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
		}, (err) => {
			throw err;
		});
	}
}