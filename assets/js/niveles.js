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
  { numero: 1, nombre: 'Palabras cortas', lista: 'cortas', cantidad: 15, velocidad: 'p2Cortas' },
  { numero: 2, nombre: 'Palabras largas', lista: 'largas', cantidad: 12, velocidad: 'p2Largas' },
  { numero: 3, nombre: 'Frases',          lista: 'frases', cantidad: 3,  velocidad: 'p2Frases' }
];

// Listas de cada tema. Todo en minúscula, sin ñ ni tildes.
// En cada intento salen palabras y frases al azar de estas listas.
const TEMAS = [
  {
    id: 'computacion', nombre: 'Computación',
    cortas: ['mouse', 'cable', 'disco', 'red', 'wifi', 'chip', 'dato', 'tecla', 'panel', 'clic', 'byte', 'bit', 'web', 'pixel', 'virus',
      'mail', 'nube', 'zoom', 'link', 'chat', 'login', 'placa', 'video', 'audio', 'texto', 'celda', 'fila', 'tabla', 'clave', 'copia'],
    largas: ['teclado', 'monitor', 'pantalla', 'impresora', 'parlante', 'procesador', 'memoria', 'programa', 'archivo', 'carpeta',
      'internet', 'navegador', 'servidor', 'software', 'hardware', 'notebook', 'escritorio', 'documento', 'planilla', 'usuario',
      'descarga', 'ventana', 'sistema', 'algoritmo', 'buscador', 'auricular', 'plantilla', 'diapositiva', 'computadora', 'dispositivo'],
    frases: [
      'el teclado, el mouse y el monitor se conectan a la computadora.',
      'guardo el archivo, cierro el programa y apago la notebook.',
      'la impresora no tiene papel, hay que cargar hojas nuevas.',
      'abro el navegador, escribo la consulta y presiono enter.',
      'tengo 3 carpetas, 12 documentos y 2 planillas en el disco.'
    ]
  },
  {
    id: 'futbol', nombre: 'Equipos de fútbol',
    cortas: ['boca', 'river', 'racing', 'tigre', 'ferro', 'milan', 'inter', 'roma', 'ajax', 'porto', 'betis', 'santos', 'napoli',
      'chelsea', 'sevilla'],
    largas: ['independiente', 'estudiantes', 'gimnasia', 'platense', 'banfield', 'talleres', 'belgrano', 'quilmes', 'sarmiento',
      'instituto', 'chacarita', 'barcelona', 'liverpool', 'juventus', 'flamengo', 'palmeiras', 'valencia', 'arsenal', 'san lorenzo',
      'real madrid', 'godoy cruz', 'rosario central'],
    frases: [
      'boca, river y racing juegan el domingo.',
      'el partido termina 2 a 1, gana independiente.',
      'talleres, belgrano e instituto son de la misma provincia.',
      'san lorenzo hace 3 goles, estudiantes hace 2.',
      'milan, inter y juventus juegan en italia.'
    ]
  },
  {
    id: 'ropa', nombre: 'Marcas de ropa',
    cortas: ['nike', 'puma', 'fila', 'vans', 'zara', 'lee', 'gap', 'reef', 'joma', 'kappa', 'umbro', 'rusty', 'asics', 'topper',
      'adidas', 'reebok', 'jordan', 'hummel'],
    largas: ['converse', 'lacoste', 'wrangler', 'columbia', 'montagne', 'champion', 'billabong', 'quiksilver', 'timberland',
      'kevingston', 'diadora', 'penalty', 'new balance', 'rip curl', 'the north face', 'under armour', 'calvin klein', 'john foos'],
    frases: [
      'tengo zapatillas topper, un buzo puma y una gorra vans.',
      'la campera cuesta 90, el buzo cuesta 45.',
      'compro 2 remeras, 1 gorra y 3 pares de medias.',
      'nike, adidas y puma hacen ropa de deporte.',
      'el local abre a las 9, cierra a las 20.'
    ]
  },
  {
    id: 'electro', nombre: 'Electrodomésticos',
    cortas: ['horno', 'radio', 'pava', 'anafe', 'estufa', 'cocina', 'plancha', 'freezer', 'secador', 'balanza', 'consola', 'tele',
      'grill', 'timbre', 'parlante'],
    largas: ['heladera', 'lavarropas', 'microondas', 'licuadora', 'batidora', 'aspiradora', 'ventilador', 'televisor', 'cafetera',
      'secarropas', 'lavavajillas', 'calefactor', 'termotanque', 'extractor', 'procesadora', 'freidora', 'exprimidor', 'caloventor',
      'tostadora', 'purificador', 'aire acondicionado'],
    frases: [
      'la heladera, el horno y el microondas van en la cocina.',
      'el lavarropas tarda 45 minutos, el secarropas tarda 30.',
      'enchufo la pava, preparo el mate y prendo la radio.',
      'el ventilador tiene 3 velocidades, la estufa tiene 2.',
      'apago el televisor, desenchufo la plancha y cierro la puerta.'
    ]
  }
];

// Modo libre: palabras al azar del tema (cortas y largas) hasta que se cumple el tiempo.
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
