/**
 * Requires
 */
const browserSync      = require('browser-sync').create()
const babelify         = require('babelify')
const browserify       = require('browserify')
const buffer           = require('vinyl-buffer')
const source           = require('vinyl-source-stream')
const gulp             = require('gulp')
const gulpAutoprefixer = require('gulp-autoprefixer')
const gulpCssnano      = require('gulp-cssnano')
const gulpImagemin     = require('gulp-imagemin')
const gulpNotify       = require('gulp-notify')
const gulpPlumber      = require('gulp-plumber')
const gulpStylus       = require('gulp-stylus')
const gulpUglify       = require('gulp-uglify')

/**
 * Paths
 */
const path =
{
    project : 'works/pokedex/',

    includes :
    {
        root        :  './includes/',
        settings    :  './includes/settings',
        routes      : './includes/routes',
        models      :  './includes/models',
        views       :  './includes/views',
        controllers :  './includes/controllers'
    },
	build :
	{
		root    : './build/',
		styles  : './build/styles/',
		scripts : './build/scripts/',
		assets  : './build/assets/'
    },
	public :
	{
		root    : './public/',
		styles  : './public/styles/',
		scripts : './public/scripts/',
		assets  : './public/assets/'
    }
}

/**
 * Depths
 */
const depth =
{
    assets   : 1,
    scripts  : 1,
    styles   : 1,
    includes : 1
}

/**
 * Extensions
 */
const extension =
{
    assets   : '*',
    scripts  : 'js',
    styles   : 'styl',
    includes : 'php'
}

/**
 * Fillers
 */
const filler = (path, depth, extension) =>
{
    const table = []
    let directory = ''

    for (let i = 0 ; i <= depth ; i++)
    {
        table.push(`${path}${directory}*.${extension}`)
        directory += '**/'
    }

    return table
}

/**
 * Files
 */
const file =
{
    assets   : filler(path.build.assets,  depth.assets,   extension.assets),
    scripts  : filler(path.build.scripts, depth.scripts,  extension.scripts),
    styles   : filler(path.build.styles,  depth.styles,   extension.styles),
    includes : filler(path.includes.root, depth.includes, extension.includes)
}

/**
 * Messages
 */
const message =
{
    compiled   : '<%= file.relative %> : file compiled',
	exported   : '<%= file.relative %> : file exported',
	transpiled : '<%= file.relative %> : file transpiled',
	updated    : '<%= file.relative %> : file updated',
	error      : '<%= error.message %>'
}

/**
 * Assets
 */
gulp.task('assets', () =>
{
	return gulp.src(file.assets)
		.pipe(gulpPlumber(
			{
				errorHandler : gulpNotify.onError(
					{
						title   : 'Assets',
						message : message.error,
						sound   : 'beep'
					})
			}))
		.pipe(gulp.dest(path.public.assets))
		.pipe(gulpNotify(
			{
				title   : 'Assets',
				message : message.exported,
				sound   : 'beep'
			}))
})

/**
 * Scripts
 */
gulp.task('scripts', () =>
{
	return browserify(
		{
			debug   : true,
			entries : `${path.build.scripts}app.js`
		})
		.transform(babelify.configure(
			{
				presets : ['babel-preset-env'].map(require.resolve)
			}))
		.bundle()
		.pipe(source('app.js'))
		.pipe(buffer())
		.pipe(gulpPlumber(
			{
				errorHandler : gulpNotify.onError(
					{
						title   : 'Scripts',
						message : message.error,
						sound   : 'beep'
					})
			}))
		.pipe(gulp.dest(path.public.scripts))
		.pipe(gulpNotify(
			{
				title   : 'Scripts',
				message : message.transpiled,
				sound   : 'beep'
			}))
})

/**
 * Styles
 */
gulp.task('styles', () =>
{
	return gulp.src(`${path.build.styles}app.styl`)
		.pipe(gulpPlumber(
			{
				errorHandler : gulpNotify.onError(
					{
						title   : 'Styles',
						message : message.error,
						sound   : 'beep'
					})
			}))
		.pipe(gulpStylus())
		.pipe(gulpAutoprefixer())
		.pipe(gulp.dest(path.public.styles))
		.pipe(gulpNotify(
			{
				title   : 'Styles',
				message : message.compiled,
				sound   : 'beep'
			}))
})

/**
 * Includes
 */
gulp.task('includes', () =>
{
	return gulp.src(file.includes)
		.pipe(gulpPlumber(
			{
				errorHandler : gulpNotify.onError(
					{
						title   : 'Includes',
						message : message.error,
						sound   : 'beep'
					})
			}))
		.pipe(gulpNotify(
			{
				title   : 'Includes',
				message : message.updated,
				sound   : 'beep'
			}))
})

/**
 * Index
 */
gulp.task('index', () =>
{
	return gulp.src('./index.php')
		.pipe(gulpPlumber(
			{
				errorHandler : gulpNotify.onError(
					{
						title   : 'Index',
						message : message.error,
						sound   : 'beep'
					})
            }))
        .pipe(gulp.dest('./'))
		.pipe(gulpNotify(
			{
				title   : 'Index',
				message : message.updated,
				sound   : 'beep'
			}))
})

/**
 * Watches
 */
gulp.task('watch', () =>
{
	// Run browser
	browserSync.init(
		{
			browser : 'Google Chrome',
			proxy   : `http://localhost/${path.project}`
		})

	// Watch assets
	gulp.watch(file.assets, ['assets'])
		.on('change', browserSync.reload)

	// Watch scripts
	gulp.watch(file.scripts, ['scripts'])
		.on('change', browserSync.reload)

	// Watch styles
	gulp.watch(file.styles, ['styles'])
		.on('change', browserSync.reload)

	// Watch includes
	gulp.watch(file.includes, ['includes'])
		.on('change', browserSync.reload)

	// Watch index
	gulp.watch('./index.php', ['index'])
		.on('change', browserSync.reload)
})

/**
 * Minify
 */
gulp.task('minify', () =>
{
    // Images
    gulp.src(`${path.public.assets}images/*.*`)
        .pipe(gulpImagemin())
        .pipe(gulp.dest(`${path.public.assets}images/`))
        .pipe(gulpNotify(
            {
                title   : 'Images',
                message : message.exported,
                sound   : 'beep'
            }))

	// Scripts
	gulp.src([`${path.public.scripts}*.js`])
		.pipe(gulpUglify())
		.pipe(gulp.dest(path.public.scripts))
		.pipe(gulpNotify(
			{
				title   : 'Styles',
				message : message.exported,
				sound   : 'beep'
			}))

	// Styles
	gulp.src([`${path.public.styles}*.css`])
		.pipe(gulpCssnano())
		.pipe(gulp.dest(path.public.styles))
		.pipe(gulpNotify(
			{
				title   : 'Scripts',
				message : message.exported,
				sound   : 'beep'
			}))
})

/**
 * Default
 */
gulp.task('default', ['assets', 'scripts', 'styles', 'includes', 'index', 'watch'])