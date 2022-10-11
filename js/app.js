const criptomonedasSelect = document.querySelector("#criptomonedas");
const monedaSelect = document.querySelector("#moneda");
const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");

const objBusqueda = {
  moneda: "",
  criptomoneda: "",
};

const obtenerCriptomonedas = (criptomonedas) =>
  new Promise((resolve) => {
    resolve(criptomonedas);
  });

document.addEventListener("DOMContentLoaded", () => {
  consultarCriptomonedas();

  formulario.addEventListener("submit", submitFormulario);

  criptomonedasSelect.addEventListener("change", leerValor);
  monedaSelect.addEventListener("change", leerValor);
});

function consultarCriptomonedas() {
  const url =
    "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((resultado) => obtenerCriptomonedas(resultado.Data))
    .then((criptomonedas) => selectCriptomonedas(criptomonedas));
}

function selectCriptomonedas(criptomonedas) {
  criptomonedas.forEach((cripto) => {
    const { FullName, Name } = cripto.CoinInfo;

    const option = document.createElement("option");
    option.value = Name;
    option.textContent = FullName;
    criptomonedasSelect.appendChild(option);
  });
}

function leerValor(e) {
  objBusqueda[e.target.name] = e.target.value;
  console.log(objBusqueda);
}

function submitFormulario(e) {
  e.preventDefault();

  //validar
  const { moneda, criptomoneda } = objBusqueda;

  if (moneda === "" && criptomoneda === "") {
    mostrarAlerta("Ambos campos son requeridos");
    return;
  }

  consultarAPI();
}

function mostrarAlerta(mensaje) {
  const existeError = document.querySelector(".error");

  if (!existeError) {
    const divMensaje = document.createElement("div");
    divMensaje.classList.add("error");
    divMensaje.textContent = mensaje;

    formulario.appendChild(divMensaje);

    setTimeout(() => {
      divMensaje.remove();
    }, 3000);

    console.log(mensaje);
  }
}

function consultarAPI() {
  const { moneda, criptomoneda } = objBusqueda;

  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;

  mostrarSpimmer();

  fetch(url)
    .then((respuest) => respuest.json())
    .then((cotizacion) => {
      mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda]);
    });
}

function mostrarCotizacionHTML(cotizacion) {
  limpiarHTML();

  const { LASTUPDATE, PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR } = cotizacion;

  const price = document.createElement("p");
  price.classList.add("precio");
  price.innerHTML = `El precio es: <span>${PRICE}</span>`;

  const highday = document.createElement("p");
  highday.innerHTML = `<p>Precio mas alto del dia <span>${HIGHDAY}</span>`;

  const lowday = document.createElement("p");
  lowday.innerHTML = `<p>Precio mas bajo del dia <span>${LOWDAY}</span`;

  const changeptc24hour = document.createElement("p");
  changeptc24hour.innerHTML = `<p>Variacion ultimas 24 horas <span>${CHANGEPCT24HOUR}</span`;

  const lastupdate = document.createElement("p");
  lastupdate.innerHTML = `<p>Ultima actualizacion <span>${LASTUPDATE}</span`;

  resultado.appendChild(price);
  resultado.appendChild(highday);
  resultado.appendChild(lowday);
  resultado.appendChild(changeptc24hour);
  resultado.appendChild(lastupdate);
  console.log(cotizacion);
}

function limpiarHTML() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

function mostrarSpimmer() {
  limpiarHTML();
  const spinner = document.createElement("div");
  spinner.classList.add("spinner");

  spinner.innerHTML = `
  
  <div class="spinner">
  <div class="bounce1"></div>
  <div class="bounce2"></div>
  <div class="bounce3"></div>
</div>`;

  resultado.appendChild(spinner);
}
