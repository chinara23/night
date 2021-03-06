const gulp = require("gulp");
const pug = require('gulp-pug');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const rename = require('gulp-rename');
const browserSync = require("browser-sync").create();
const ghPages = require("gulp-gh-pages");


//gulp.task("deploy", () => { 
  //return gulp.src("./dist/**/*").pipe(ghPages());
//});

gulp.task('deploy', function() {
  return gulp.src('./dist/**/*')
    .pipe($.ghPages({
      remoteUrl: "https://github.com/chinara23/night"
    }));
});

exports.ghPages = ghPages;

// плагины галпа отдельно подключать не нужно,
// // используем в пайпе как $gp.имяПлагина (без приставки gulp-)
//  const $gp = require("gulp-load-plugins")();

//  const browserSync = require("browser-sync").create();
// const config = require("./env.paths.json");
// const env = process.env.NODE_ENV;
//  const reload = browserSync.reload;
//  const $webpack = require("webpack-stream");
//  const webpack = require("webpack");
 const del = require("del"); 

const paths = {
  root: './dist',
  templates: {
    pages: './src/views/pages/*.pug',
    src: './src/views/**/*.pug',
    dest: './dist'
  },
  styles: {
    main: './src/assets/styles/main.scss',
    src: './src/assets/styles/**/*.scss',
    dest: './dist/assets/styles'
  },
  // images: {
  //   images: './src/assets/images/png/*.png',
  //   src: './src/assets/images/png/*.*', 
  //   dest: './dist/assets/images/png' 
  // }
  // images: {
  //   src: "./src/assets/images/**/*.*",
  //   dest: "./dist/assets/images/" 
  // },
}
//слежка 
function watch() { 
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.templates.src, templates);
  //gulp.watch(paths.ghPages.src, ghPages);
 // gulp.watch(paths.images.src, images);
}
//очистка 
function clean() {
  return del(paths.root);
}

// следим на build и релоадим браузер
function server() {
  browserSync.init({
    server:paths.root
  });
  browserSync.watch(paths.root + '/**/*.*', browserSync.reload);
}

//pug 
function templates() {
  return gulp.src(paths.templates.pages)
    .pipe(pug({ pretty: true}))
    .pipe(gulp.dest(paths.root));
}

//scss 
function styles() {
  return gulp.src(paths.styles.main)
    .pipe(sourcemaps.init())
    .pipe(postcss(require('./postcss.config')))
    .pipe(sourcemaps.write())
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest(paths.styles.dest))
}

//images

// gulp.task("images", () => {
//   return gulp
//     .src([
//       `${config.SRC_DIR}/images/**/*.*`,
//       `!${config.SRC_DIR}/images/icons/*.*`
//     ])
//     .pipe(gulp.dest(`${config.DIST_DIR}/assets/images/`));
// });

exports.templates = templates ;
exports.styles = styles ;
//exports.images = images;
exports.clean = clean;

gulp.task('default', gulp.series(
  clean,
  gulp.parallel(styles, templates ),
  gulp.parallel(watch, server)
));


// стили
// gulp.task("styles", () => {
//   return gulp
//     .src(`${config.SRC_DIR}/styles/main.scss`)
//     .pipe($gp.sourcemaps.init())
//     .pipe($gp.plumber())
//     .pipe($gp.postcss(require("./postcss.config")))
//     .pipe($gp.rename("main.min.css"))
//     .pipe($gp.if(env === "development", $gp.sourcemaps.write()))
//     .pipe(gulp.dest(`${config.DIST_DIR}`))
//     .pipe(reload({ stream: true }));
// });

// // переносим шрифты
// gulp.task("fonts", () => {
//   return gulp
//     .src(`${config.SRC_DIR}/fonts/**`)
//     .pipe(gulp.dest(`${config.DIST_DIR}/assets/fonts/`));
// });

// // очистка
// gulp.task("clean", () => {
//   return del(config.ROOT_PATH);
// });

// // собираем скрипты webpack
// gulp.task("scripts", () => {
//   return gulp
//     .src(`${config.SRC_DIR}/scripts/*.js`)
//     .pipe($gp.plumber())
//     .pipe(
//       $webpack(
//         {
//           ...require("./webpack.mpa.config"),
//           mode: env
//         },
//         webpack
//       )
//     )
//     .pipe(gulp.dest(`${config.DIST_DIR}`))
//     .pipe(reload({ stream: true }));
// });

// //рендерим странички
// gulp.task("pug", () => {
//   return gulp
//     .src(`${config.VIEWS_DIR}/pages/*.pug`)
//     .pipe($gp.plumber())
//     .pipe($gp.pug())
//     .pipe(gulp.dest(`${config.DIST_DIR}`))
//     .pipe(reload({ stream: true }));
// });

// // dev сервер + livereload (встроенный)
// gulp.task("server", () => {
//   browserSync.init({
//     server: {
//       baseDir: `${config.DIST_DIR}`
//     },
//     open: false
//   });
// });

// // спрайт иконок
// gulp.task("svg", done => {
//   return gulp
//     .src(`${config.SRC_DIR}/images/icons/*.svg`)
//     .pipe(
//       $gp.svgmin({
//         js2svg: {
//           pretty: true
//         },
//         plugins: [

//         ]
//       })
//     )
//     .pipe(
//       $gp.cheerio({
//         run($) {
//           $("[fill], [stroke], [style], [width], [height]")
//             .removeAttr("fill")
//             .removeAttr("stroke")
//             .removeAttr("style");
//         },
//         parserOptions: { xmlMode: true }
//       })
//     )
//     .pipe($gp.replace("&gt;", ">"))
//     .pipe(
//       $gp.svgSprite({
//         mode: {
//           symbol: {
//             sprite: "../sprite.svg"
//           }
//         }
//       })
//     )
//     .pipe(gulp.dest(`${config.DIST_DIR}/assets/images/icons`));
// });

// просто переносим картинки

// // галповский вотчер
// gulp.task("watch", () => {
//   gulp.watch(`${config.SRC_DIR}/styles/**/*.scss`, gulp.series("styles"));
//   gulp.watch(`${config.SRC_DIR}/images/**/*.*`, gulp.series("images"));
//   gulp.watch(`${config.SRC_DIR}/scripts/**/*.js`, gulp.series("scripts"));
//   gulp.watch(`${config.SRC_DIR}/fonts/*`, gulp.series("fonts"));
//   gulp.watch(`${config.VIEWS_DIR}/**/*.pug`, gulp.series("pug"));
// });

// // GULP:DEV
// gulp.task(
//   "default",
//   gulp.series(
//     "clean",
//     "svg",
//     gulp.parallel("styles", "pug", "images", "fonts", "scripts"),
//     gulp.parallel("watch", "server")
//   )
// );

// // GULP:build
// gulp.task(
//   "build",
//   gulp.series(
//     "clean",
//     "svg",
//     gulp.parallel("styles", "pug", "images", "fonts", "scripts")
//   )
// );
