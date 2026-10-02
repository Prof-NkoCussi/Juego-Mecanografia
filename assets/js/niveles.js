// Datos del juego: niveles, temas y umbrales de estrellas.
// Los umbrales van todos juntos acá para ajustarlos sin tocar la lógica.

const UMBRALES = {
  precisionMinima: 90,   // % para 2 estrellas
  precisionObjetivo: 95, // % para 3 estrellas
  velocidad: {           // palabras por minuto
    p1Inicial: { minima: 10, objetivo: 15 }, // Parte 1 · niveles 1 a 3
    p1Final:   { minima: 12, objetivo: 18 }, // Parte 1 · niveles 4 a 6
    p2Cortas:  { minima: 15, objetivo: 22 }, // Parte 2 · palabras cortas
    p2Largas:  { minima: 18, objetivo: 26 }, // Parte 2 · palabras largas
    p2Frases:  { minima: 20, objetivo: 30 }  // Parte 2 · frases
  }
};

// Estrellas que hacen falta para abrir el nivel siguiente.
const ESTRELLAS_PARA_AVANZAR = 2;

// Parte 1 · Aprender las teclas. Primero repeticiones de teclas, después palabras reales.
// Cada texto usa solo las teclas de su nivel y de los anteriores.
const PARTE1 = [
  {
    id: 'p1-1', numero: 1, nombre: 'Fila guía', teclas: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'], velocidad: 'p1Inicial',
    texto: 'fff jjj fff jjj ddd kkk ddd kkk sss lll sss lll aaa aaa fj dk sl fj dk sl ggg hhh fg jh fg jh ' +
           'asdf jkl asdf jkl sala gala hada falda salsa gasa faja alfalfa'
  },
  {
    id: 'p1-2', numero: 2, nombre: 'Fila superior', teclas: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'], velocidad: 'p1Inicial',
    texto: 'eee iii ede kik rrr uuu frf juj ttt yyy ftf jyj www ooo sws lol qqq ppp aqa lpl ' +
           'agua sopa piso foto gato queso papel hoja jugo perro puerta fiesta tijera'
  },
  {
    id: 'p1-3', numero: 3, nombre: 'Fila inferior', teclas: ['z', 'x', 'c', 'v', 'b', 'n', 'm'], velocidad: 'p1Inicial',
    texto: 'ccc vvv dcd fvf bbb nnn fbf jnj mmm jmj xxx zzz sxs aza ' +
           'cama mano vaca nube boca mesa luz taxi zorro cebra nieve banco nariz examen caballo mochila'
  },
  {
    id: 'p1-4', numero: 4, nombre: 'Todas las letras', descripcion: 'Palabras con cualquier letra', velocidad: 'p1Final',
    texto: 'casa perro libro amigo escuela clase patio recreo cuaderno regla lapicera taller dibujo ' +
           'invierno viento kiwi wifi queso yogur zapato familia ciudad'
  },
  {
    id: 'p1-5', numero: 5, nombre: 'Números', teclas: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'], velocidad: 'p1Final',
    texto: '111 222 333 444 555 666 777 888 999 000 12 34 56 78 90 ' +
           '1 mesa 2 sillas 3 libros 4 reglas 5 gatos 6 perros 8 patos 10 dedos 12 meses 24 horas 30 alumnos'
  },
  {
    id: 'p1-6', numero: 6, nombre: 'Coma y punto', teclas: [',', '.'], velocidad: 'p1Final',
    texto: 'k,k l.l k,k l.l uno, dos, tres. hola. el gato duerme, el perro juega. ' +
           'en invierno nieva mucho en ushuaia. abro la mochila, saco el libro y leo.'
  }
];

// Parte 2 · Palabras por tema. Cada tema tiene estos 3 niveles, en orden.
const NIVELES_TEMA = [
  { numero: 1, nombre: 'Palabras cortas', cantidad: 15, velocidad: 'p2Cortas' },
  { numero: 2, nombre: 'Palabras largas', cantidad: 12, velocidad: 'p2Largas' },
  { numero: 3, nombre: 'Frases',          cantidad: 3,  velocidad: 'p2Frases' }
];

// Las listas de palabras y frases se agregan en la etapa 5.
const TEMAS = [
  { id: 'computacion', nombre: 'Computación' },
  { id: 'futbol',      nombre: 'Equipos de fútbol' },
  { id: 'ropa',        nombre: 'Marcas de ropa' },
  { id: 'electro',     nombre: 'Electrodomésticos' }
];

// Modo libre: palabras al azar del tema hasta que se cumple el tiempo.
const MODO_LIBRE = { segundos: 60 };

// Teclado en pantalla: qué dedo va en cada tecla.
const DEDOS = [
  { id: 'mi', nombre: 'meñique izquierdo', color: 'menique', teclas: '1qaz' },
  { id: 'ai', nombre: 'anular izquierdo',  color: 'anular',  teclas: '2wsx' },
  { id: 'ci', nombre: 'mayor izquierdo',   color: 'mayor',   teclas: '3edc' },
  { id: 'ii', nombre: 'índice izquierdo',  color: 'indice',  teclas: '45rtfgvb' },
  { id: 'pu', nombre: 'pulgar',            color: 'pulgar',  teclas: ' ' },
  { id: 'id', nombre: 'índice derecho',    color: 'indice',  teclas: '67yuhjnm' },
  { id: 'cd', nombre: 'mayor derecho',     color: 'mayor',   teclas: '8ik,' },
  { id: 'ad', nombre: 'anular derecho',    color: 'anular',  teclas: '9ol.' },
  { id: 'md', nombre: 'meñique derecho',   color: 'menique', teclas: '0p' }
];
