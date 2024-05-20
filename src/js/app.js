//Se le agrega un evento al HTML que espere a que el contenido del documento se cargue, se inicia el javascript
document.addEventListener("DOMContentLoaded", () => {
  //Que inicie la aplicación
  initApp();
});

function initApp() {
  createGallery();
}

//Función que crea la galería
function createGallery() {
  //En un constante se selecciona la galería del html
  const gallery = document.querySelector(".gallery-images");
  //Bucle mediante el cual se realizará la creación de 12 imágenes
  for (let i = 1; i <= 12; i++) {
    //Se crea una constante image que tenga como valor el tag de picture de HTML
    const image = document.createElement("picture");
    //innerHTML es una propiedad que nos permite agregar código HTML dentro de nuestro elemento, en este caso dentro del tag image
    //Dentro de este tag se agregará las imágenes minificadas de acuerdo a su calidad, por cada unas imágenes minificadas
    image.innerHTML = `
                <source srcset="build/img/thumb/${i}.avif" type="image/avif">
                <source srcset="build/img/thumb/${i}" type="image/webp">
                <img loading="lazy" width="200" height="300" src="build/img/thumb/${i}.jpg"
                    alt="Imagen Galería ${i}">
    `;
    //Se agrega al elemento image el evento onclick, que tiene un callback a la función showimage, es decir que cuando se realice un click en la imagen
    image.onclick = () => {
      showImage(i);
    };
    //Se agrega a gallery-images el elemnto image, uno por uno, de acuerdo al bucle
    gallery.appendChild(image);
  }
}

function showImage(id) {
  //Se crea un elemento HTML picture
  const image = document.createElement("picture");
  //Dentro del elemento se pone las imágenes en alta definición, las originales
  image.innerHTML = `
  <source srcset="build/img/grande/${id}.avif" type="image/avif">
                <source srcset="build/img/grande/${id}" type="image/webp">
                <img loading="lazy" width="200" height="300" src="build/img/grande/${id}.jpg"
                    alt="Imagen Galería ${id}">
  `;

  //Se crea un overlay, es decir un contenedor, un div
  const overlay = document.createElement("div");
  //Se agrega la imagen al contenedor
  overlay.appendChild(image);
  //Se le agrega una clase llamada overlay para brindarle estilos
  overlay.classList.add("overlay");
  //Que cuando seleccione cualquier parte del overlay, también cierre la imagen
  overlay.onclick = () => {
    //Se selecciona el body
    const body = document.querySelector("body");
    //Quitarle el no-scroll
    body.classList.remove("no-scroll");
    //Quitar el overlay
    overlay.remove();
  };

  //Botón para cerrar la imagen
  //Se crea un elemento de tipo de párrafo
  const closeModal = document.createElement("p");
  //Que tenga como texto de contenido una X
  closeModal.textContent = "X";
  //Se agrega al elemento una clase
  closeModal.classList.add("btn-close");
  //Cuando se realice un click en este elemento, se elimine el overlay
  closeModal.onclick = () => {
    const body = document.querySelector("body");
    //Se desactiva el no-scroll
    body.classList.remove("no-scroll");
    overlay.remove();
  };
  //Se agrega al overlay el closeModal
  overlay.appendChild(closeModal);

  //Se selecciona el body del HTML
  const body = document.querySelector("body");
  //Se agrega el overlay finalmente el contenedor al body
  body.appendChild(overlay);
  //Cuando se ejecute la función se activa el no-scroll
  body.classList.add("no-scroll");
}
