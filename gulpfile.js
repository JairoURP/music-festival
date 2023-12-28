//Creación de una función en JavaScript
// function task(done) {
//     //Escribiendo por consola
//     console.log('Hello world')
//     //Se coloca un callback, algo que indique que la tarea ha terminado, se puede llamar como se desee, done es un estándar
//     done()
// }

//Llamando a la función
// exports.task = task;


// function nombreDeLaFuncion(parametro1, parametro2, ...) {
// Contenido de la función
// }

//Ejemplo
// function suma(a, b) {
//     return a + b;
// }

//Una variable es un espacio de almacenamiento con un nombre simbólico (un identificador) y un tipo asociado, donde se puede guardar, leer y manipular. Estos datos pueden variar durante la ejecución del programa, en este caso se define una variable const, es decir no va variar en el tiempo.
//const a = 5;
//Por otro lado tenemos una variable let, que puede variar en el tiempo
//let a =5;
//Una variable global
//var a = 5;


//Se quiere utilizar y automatizar las funciones de la librería sass
//Se importa la función src y dest de gulp
const { src, dest, watch, parallel } = require('gulp')
// CSS
//Se define una constante que capture la automatización de gusp para sass y a su vez se indica sass como parámetro
const sass = require('gulp-sass')(require('sass'))
//Utilizando la función plumber de gulp, se importa la libería gulp-plumber a través de esta instancia
const plumber = require('gulp-plumber')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')
const postcss = require('gulp-postcss')
const sourcemaps = require('gulp-sourcemaps')

// Javascript

const terser = require('gulp-terser-js')

// Imágenes
//Importación de gulp-cache
const cache = require('gulp-cache')
//Importación de gulp-imagein
const imagemin = require('gulp-imagemin')
//Importación de gulp-webp
const webp = require('gulp-webp')
//Importación de gulp-avif
const avif = require('gulp-avif')

function css(done) {
  src('src/scss/**/*.scss') // Identificar el archivo SASS
    .pipe(sourcemaps.init())
    //pipe se utiliza para ejecutar una función después de otro
    //En caso de que hayan problemas no se cerrará abruptamente la ejecución, no se detiene el workflow
    .pipe(plumber()) // Si tiene problemas, no detiene el workflow
    .pipe(sass()) // Compilarlo
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(sourcemaps.write('.'))
    //Se guarda el nuevo código en una nueva carpeta, en el disco duro
    .pipe(dest('build/css'));


  done(); // Callback que avisa a gulp cuando llegamos al final
}

//Función para comprimir automáticamente las imágenes, esto da la ventaja que Google te recompense por lo ligero del sitio web, te ubica más arriba
function images(done) {
  //Creación de un objeto
  const options = {
    //Atributo que optimiza 3 veces las imágenes
    optimizationLevel: 3
  }
  //Que parte de la carpeta img y que agarre los archivos .jpg, png
  src('src/img/**/*.{jpg,png}')
    //Que los guarde en cache (Lugar de acceso rápido), se optimiza con options
    .pipe(cache(imagemin(options)))
    //Se pasa a la carpeta de destino, que se creará al ejecutar la función
    .pipe(dest('build/img'))

  //Callback para indicar que la función acabó
  done();
}

//Conversión a formata webp
function versionWebp(done) {
  const options = {
    //Calidad de 50
    quality: 50
  }

  //Sacar las imágenes dentro de la carpeta de images en src, los lee desde esta carpeta
  src('src/img/**/*.{jpg,png}')
    //Conversión en webp siguiendo las indicaciones de option
    .pipe(webp(options))
    //Guardándolo en el destino indicado
    .pipe(dest('build/img'))
  
  done();
}

//Convirtiéndolo a versión avif
function versionAvif(done) {
  const options = {
    //Calidad de 50
    quality: 50
  }

  //Sacar las imágenes dentro de la carpeta de images en src, los lee desde esta carpeta
  src('src/img/**/*.{jpg,png}')
    //Conversión en webp siguiendo las indicaciones de option usando la librería avif
    .pipe(avif(options))
    //Guardándolo en el destino indicado
    .pipe(dest('build/img'))
  done();
}

function javascript(done) {
  src('src/js/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(terser())
    .pipe(sourcemaps.write('.'))
    .pipe(dest('build/js'));

  done();
}

//Función que indica que se encuentra en modo de desarrollo
function dev(done) {
  //Ejecutando la función css cuando se detectan cambios en archivos sass dentro de la carpeta src\scss
  watch('src/scss/**/*.scss', css);
  watch('src/js/**/*.js', javascript);

  //Además, se le indica cuando la función va acabar
  done();
}


function prod(done) {
  src('src/scss/**/*.scss') // Identificar el archivo SASS
    .pipe(sass()) // Compilarlo
    .pipe(dest('build/css')); // Almacenarla en el disco duro

  done();
}

//Exportando la función css para que gulp lo pueda ejecutar en el comando gulp css
exports.css = css;
exports.js = javascript;
exports.versionWebp = versionWebp;
//Exportando la función images
exports.images = images;
//Se exporta dev y se busca ejecutar las funciones en paralelo, cuando se ejecute la npm run dev (Se ejecutará todas las funciones incluidas)
exports.dev = parallel(images, versionWebp, versionAvif, javascript, dev);
exports.prod = parallel(images, versionWebp, versionAvif, javascript, prod);