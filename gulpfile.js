// Load some modules which are installed through NPM.
var gulp = require('gulp'),
    browserify = require('browserify'),  // Bundles JS.
    reactify = require('reactify'),  // Transforms React JSX to JS.    
	del = require('del'),  // Deletes files.
    browserSync = require('browser-sync'),
    reload = browserSync.reload;
    recess = require('gulp-recess'),
    less = require('gulp-less'),    
	envify = require('envify/custom'),
	uglify = require('gulp-uglify'),
	buffer = require('vinyl-buffer'),
	source = require('vinyl-source-stream'),
	shell = require('gulp-shell'),
	babel = require("gulp-babel");
	
var paths = {
    css: ['src/css/app.less'],
    js: ['src/js/**/*.js'],
    html: ['src/index.html'],
	xml: ['src/config.xml']
};

gulp.task('clean-xml', function (done) {
    del(['www/config.xml'], done);
});
gulp.task('clean-html', function (done) {
    del(['www/index.html'], done);
});
gulp.task('clean-css', function (done) {
    del(['www/css'], done);
});
gulp.task('clean-js', function (done) {
    del(['www/js'], done);
});

gulp.task('browser-sync', function() {
    browserSync({
        browser: ["google chrome"],
        server: {
            baseDir: "./www"
        }
    });
});

gulp.task('xml', ['clean-xml'], function () {
    var dest = 'www';
    return gulp.src(paths.xml)
    .pipe(gulp.dest(dest));
});
gulp.task('html', ['clean-html'], function () {
    var dest = 'www';
    return gulp.src(paths.html)
    .pipe(gulp.dest(dest))
    .pipe(reload({ stream: true }));
});
gulp.task('css', ['clean-css'], function () {
    return gulp.src(paths.css)
      /*.pipe(recess())*/
      .pipe(less())
      .pipe(gulp.dest('www/css'))
      .pipe(reload({ stream: true }));
});

gulp.task('browserify', function () {
    return browserify({
        entries: './src/js/app.js',
        extensions: ['.jsx', 'js'],
        paths: ['./node_modules', 'src/js/**/*.js']
    })
    .transform('reactify')
	.transform(envify({
		NODE_ENV: 'production'
	}))
    .bundle()
	.pipe(source('bundle.js'))
	/*.pipe(babel())*/
	.pipe(buffer())
	.pipe(uglify())
    .pipe(gulp.dest('www/js'));
});
/*
gulp.task('deploy', shell.task([	
	'git push origin master',
	'git remote remove origin',
	'git remote add origin https://phd2209:polit2209@github.com/phd2209/runopoly.git',
	'git subtree push --prefix www origin gh-pages' 
]));
*/
gulp.task('watch', ['browser-sync'], function () {
    gulp.watch(paths.css, ['css', reload]);
    gulp.watch(paths.js, ['browserify', reload]);
    gulp.watch(paths.html, ['html', reload]);
	gulp.watch(paths.xml, ['xml', reload]);
	//gulp.watch([paths.css, paths.js, paths.html, paths.xml], ['deploy']);
});

gulp.task('default', ['watch', 'html', 'css', 'browserify', 'xml']);