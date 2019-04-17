/**
 * Imports
 */

// Packages
import gulp            from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'
import browserSync     from 'browser-sync'
import babelify        from 'babelify'
import browserify      from 'browserify'
import source          from 'vinyl-source-stream'
import buffer          from 'vinyl-buffer'
import watchify        from 'watchify'

// Loader
const $ = gulpLoadPlugins()

// Session
browserSync.create()

/**
 * Definition
 */

// Messages
const message = {
  compiled   : '<%= file.relative %>: file compiled',
  transpiled : '<%= file.relative %>: file transpiled',
  updated    : '<%= file.relative %>: file updated',
  minified   : '<%= file.relative %>: file minified',
  cleaned    : '<%= file.relative %>: file cleaned',
  error      : '<%= error.message %>'
}

// Path
const server  = 'htdocs'
const root    = 'public'
const folders = process.cwd().split('/')

let local = ''
let index = 0

for (const folder of folders) {
  if (folder == server) {
    index = folders.indexOf(server)
    for (let i = index + 1 ; i < folders.length ; i++) {
      local += `${folders[i]}/`
      if (folders[i] == root) break
    }
    break
  }
}

/**
 * Configuration
 */

// Server
gulp.task('server', ['styles', 'scripts', 'templates'], () => {
  browserSync.init({
    proxy   : `http://localhost/${local}${root}`,
    browser : 'Google Chrome'
  })
  gulp.watch([
    `sources/styles/**/*.styl`,
    `sources/styles/*.styl`
  ], ['styles'])
  gulp.watch([
    `includes/**/**/*.+(html|php|twig)`,
    `includes/**/*.+(html|php|twig)`,
    `includes/*.+(html|php|twig)`,
    `*.+(html|php|twig)`
  ], ['templates'])
})

// Styles
gulp.task('styles', () => {
  return gulp.src(`sources/styles/app.styl`)
    .pipe($.plumber())
    .pipe($.sourcemaps.init({ loadMaps: true }))
    .pipe($.stylus())
    .on('error', $.notify.onError({
      title   : 'Styles',
      message : message.error,
      sound   : 'beep'
    }))
    .pipe($.autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(`public/styles/`))
    .pipe(browserSync.stream())
    .pipe($.notify({
      title   : 'Styles',
      message : message.compiled,
      sound   : 'beep'
    }))
})

// Scripts
let bundler = null

const bundle = () => {
  bundler.bundle()
    .pipe($.plumber())
    .on('error', $.notify.onError({
      title   : 'Scripts',
      message : message.error,
      sound   : 'beep'
    }))
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe($.sourcemaps.init({ loadMaps: true }))
    .pipe($.sourcemaps.write('./'))
    .pipe(gulp.dest(`public/scripts/`))
    .pipe(browserSync.stream())
    .pipe($.notify({
      title   : 'Scripts',
      message : message.transpiled,
      sound   : 'beep'
    }))
}

gulp.task('scripts', () => {
  bundler = browserify({
    entries : `sources/scripts/app.js`,
    debug   : true,
    paths   : ['./node_modules', `sources/scripts/`]
  })
  .transform(babelify)
  bundler.plugin(watchify)
  bundler.on('update', bundle)
  bundle()
})

// Templates
gulp.task('templates', () => {
  return gulp.src([
    `*.+(html|php|twig)`,
    `includes/*.+(html|php|twig)`,
    `includes/**/*.+(html|php|twig)`,
    `includes/**/**/*.+(html|php|twig)`
  ])
    .pipe($.plumber())
    .pipe(browserSync.stream())
    .pipe($.notify({
      title   : 'Template',
      message : message.updated,
      sound   : 'beep'
    }))
})

// CSS
gulp.task('compile', () => {
  return gulp.src(`public/styles/app.css`)
    .pipe($.cssnano())
    .on('error', $.notify.onError({
      title   : 'Styles',
      message : message.error,
      sound   : 'beep'
    }))
    .pipe(gulp.dest(`public/styles/`))
    .pipe($.notify({
      title   : 'Styles',
      message : message.minified,
      sound   : 'beep'
    }))
})

// JS
gulp.task('transpile', () => {
  return gulp.src(`public/scripts/app.js`)
    .pipe($.uglify())
    .on('error', $.notify.onError({
      title   : 'Scripts',
      message : message.error,
      sound   : 'beep'
    }))
    .pipe(gulp.dest(`public/scripts/`))
    .pipe($.notify({
      title   : 'Scripts',
      message : message.minified,
      sound   : 'beep'
    }))
})

// Maps
gulp.task('clear', () => {
  return gulp.src([
    `public/scripts/app.js.map`,
    `public/styles/app.css.map`
  ])
    .pipe($.clean({
      force: true,
      read: false
    }))
    .on('error', $.notify.onError({
      title   : 'Maps',
      message : message.error,
      sound   : 'beep'
    }))
    .pipe($.notify({
      title   : 'Maps',
      message : message.cleaned,
      sound   : 'beep'
    }))
})

// Production
gulp.task('prod', ['compile', 'transpile', 'clear'])

// Run
gulp.task('default', ['server'])
