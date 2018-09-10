const gulp = require('gulp');
const jest = require('gulp-jest').default;
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const pump = require('pump');
const rename = require('gulp-rename');

gulp.task('default', () => {
    
    pump([

        gulp.src('src/validator.es6.js'),
        jest(),
        babel({
            presets: ['@babel/preset-env'],
        }),
        uglify(),
        rename('validator.min.js'),
        gulp.dest('dist'),

    ],
    (e) => {
        if (typeof e !== 'undefined') {
            console.log(e);
        }
    });

});