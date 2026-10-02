// Chequeo de los textos de práctica de assets/js/niveles.js.
// Uso (desde la carpeta del proyecto):  node herramientas/verificar-textos.js
//
// Revisa que:
//  - ningún texto use caracteres fuera de a-z, 0-9, espacio, coma y punto;
//  - cada nivel de la Parte 1 use solo sus teclas y las de los niveles anteriores;
//  - no haya espacios dobles ni espacios al principio o al final;
//  - cada tema tenga suficientes palabras y frases para sus niveles.

const fs = require('fs');
const path = require('path');

const archivo = path.join(__dirname, '..', 'assets', 'js', 'niveles.js');
const codigo = fs.readFileSync(archivo, 'utf8');
const { PARTE1, TEMAS, NIVELES_TEMA } = new Function(codigo + '; return { PARTE1, TEMAS, NIVELES_TEMA };')();

const PERMITIDOS = /^[a-z0-9 ,.]+$/;
const errores = [];

function revisar(donde, texto, teclas) {
  if (typeof texto !== 'string' || texto.length === 0) {
    errores.push(donde + ': está vacío');
    return;
  }
  if (!PERMITIDOS.test(texto)) {
    const malos = [...new Set([...texto].filter((c) => !/[a-z0-9 ,.]/.test(c)))];
    errores.push(donde + ': caracteres no permitidos ' + JSON.stringify(malos.join('')));
  }
  if (/ {2}/.test(texto) || texto !== texto.trim()) {
    errores.push(donde + ': tiene espacios dobles o al principio/final');
  }
  if (teclas) {
    const fuera = [...new Set([...texto].filter((c) => c !== ' ' && !teclas.has(c)))];
    if (fuera.length) errores.push(donde + ': usa teclas de niveles posteriores ' + JSON.stringify(fuera.join('')));
  }
}

// Parte 1: cada nivel suma sus teclas a las anteriores. El nivel 4 ("todas las letras") suma la a-z completa.
const acumuladas = new Set();
for (const nivel of PARTE1) {
  if (nivel.teclas) nivel.teclas.forEach((t) => acumuladas.add(t));
  else 'abcdefghijklmnopqrstuvwxyz'.split('').forEach((t) => acumuladas.add(t));
  revisar('Parte 1 · nivel ' + nivel.numero, nivel.texto, acumuladas);
}

// Parte 2
for (const tema of TEMAS) {
  for (const n of NIVELES_TEMA) {
    const lista = tema[n.lista] || [];
    if (lista.length < n.cantidad) {
      errores.push(tema.nombre + ' · ' + n.lista + ': tiene ' + lista.length + ', hacen falta ' + n.cantidad);
    }
    lista.forEach((texto, i) => revisar(tema.nombre + ' · ' + n.lista + ' #' + (i + 1), texto));
    const repetidos = lista.filter((x, i) => lista.indexOf(x) !== i);
    if (repetidos.length) errores.push(tema.nombre + ' · ' + n.lista + ': repetidos ' + repetidos.join(', '));
  }
}

if (errores.length) {
  console.log('Hay ' + errores.length + ' problema(s):');
  errores.forEach((e) => console.log(' - ' + e));
  process.exit(1);
}
console.log('Textos OK: Parte 1 (' + PARTE1.length + ' niveles) y Parte 2 (' + TEMAS.length + ' temas).');
