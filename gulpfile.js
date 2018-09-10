const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const pump = require('pump');

gulp.task('default', () => {
    
    pump([

        gulp.src('src/validator.es6.js'),
        babel({
            presets: ['@babel/preset-env'],
        }),
        uglify(),
        gulp.dest('dist'),

    ],
    (e) => {console.log(e)});

});