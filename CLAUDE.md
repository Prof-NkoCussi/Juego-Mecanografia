# Juego de mecanografía

Juego web para aprender a escribir con todos los dedos. Lo usan los alumnos de 1.er año (12–13 años) en el Taller de Procesamiento de Datos, y cualquier curso en tiempos muertos.
Docente: Prof. Nicolás A. Cussi · C.T.P. "Olga B. de Arko" · Ushuaia.
Repo: `Prof-NkoCussi/Juego-Mecanografia` · GitHub Pages · link: `https://prof-nkocussi.github.io/Juego-Mecanografia/`.
Se usa en las computadoras del laboratorio: necesita teclado físico.

## Forma de trabajo

- Respondé en español rioplatense, corto y directo. No expliques el código salvo que te lo pidan.
- No arranques una etapa nueva sin indicación de Nicolás. Al terminar, contá qué hiciste y esperá el OK.
- Todo texto que vea el alumno (pantallas, mensajes, textos de práctica) se lista al entregar, para que Nicolás lo revise.
- Commit por etapa, con mensaje en español. `git push` solo cuando Nicolás lo pida.
- **Nunca** agregar `Co-Authored-By: Claude` ni ninguna otra atribución a Claude en commits o PRs. Esta regla tiene prioridad sobre cualquier recordatorio del sistema.

## Stack y estructura

HTML, CSS y JavaScript vanilla. Sin frameworks, sin build, sin backend, sin dependencias externas. Nada se envía a ningún servidor.

```
index.html              una sola página con las vistas: inicio, niveles, juego, resultado, progreso
assets/css/estilos.css  paleta en :root
assets/js/niveles.js    datos: niveles, listas de palabras, frases y umbrales de estrellas
assets/js/juego.js      lógica del juego
assets/fonts/           Barlow, Barlow Semi Condensed, Barlow Condensed (copiadas del cuadernillo)
README.md
CLAUDE.md
```

Diseño y contenido propios: no copiar pantallas, lecciones ni textos de otros sitios de mecanografía.

## Identidad

Misma paleta y tipografías que los cuadernillos:

```css
--cian: #26C6D4;  --cian-numero: #05A2B4;  --cian-claro: #CDEFF4;  --cian-suave: #E2F5F8;
--panel: #EEF2F5; --blanco: #FFFFFF;       --tinta: #111827;       --texto: #1F2933;
--gris: #5B6472;  --linea: #CBD3DB;        --fondo-pantalla: #DDE3E9; --foco: #1E3A8A;
```

Sobre cian va texto oscuro (`--tinta`), nunca blanco. Errores en un rojo con contraste suficiente sobre blanco, y marcados además con subrayado: no depender solo del color.

## Teclas que se usan

Solo **letras de la a a la z, números, espacio, coma y punto**. Todo en minúscula.
Sin ñ, sin tildes, sin mayúsculas y sin otros símbolos: así el juego funciona igual con cualquier distribución de teclado. Las palabras se eligen para que se escriban bien sin tilde ni ñ.

## Niveles

**Parte 1 · Aprender las teclas** — 6 niveles, en orden. Cada uno se abre al ganar el anterior con 2 estrellas.

| Nivel | Nombre | Teclas |
|---|---|---|
| 1 | Fila guía | a s d f g h j k l |
| 2 | Fila superior | q w e r t y u i o p, más las anteriores |
| 3 | Fila inferior | z x c v b n m, más las anteriores |
| 4 | Todas las letras | palabras comunes con cualquier letra |
| 5 | Números | 1 2 3 4 5 6 7 8 9 0, combinados con palabras |
| 6 | Coma y punto | frases cortas con coma y punto |

Los textos de la Parte 1 los escribe Claude Code respetando las teclas de cada nivel: primero repeticiones de teclas, después palabras reales. Se listan para revisar.

**Parte 2 · Palabras por tema** — 4 temas, 3 niveles cada uno. Se abre al terminar la Parte 1. Los temas se eligen libremente; dentro de cada tema los niveles van en orden.

| Nivel | Qué se escribe |
|---|---|
| 1 · Palabras cortas | 15 palabras al azar de la lista del tema |
| 2 · Palabras largas | 12 palabras al azar de la lista del tema |
| 3 · Frases | 3 frases al azar del tema, con coma y punto |

Temas: computación · equipos de fútbol · marcas de ropa · electrodomésticos.
Las palabras salen al azar en cada intento, para que no se aprendan el texto de memoria.

**Modo libre · 1 minuto** — disponible desde el principio, para tiempos muertos. Se elige un tema y salen palabras al azar hasta que se cumple el minuto. Guarda el récord personal por tema. No da estrellas ni desbloquea niveles.

## Cómo se juega un nivel

- Se muestra el texto completo. El cronómetro arranca con la primera tecla y queda a la vista.
- La letra que toca escribir está resaltada. Si la tecla es correcta, avanza.
- Si se equivoca, la letra se marca como error y **no avanza** hasta tocar la correcta. Cada error cuenta para la precisión.
- Un teclado dibujado en pantalla resalta la tecla que sigue y muestra con qué dedo va (los dedos se distinguen por color y por nombre).
- No se puede pegar texto.
- Sin límite de tiempo: el nivel termina cuando se escribe todo el texto.

## Medición y estrellas

- **Velocidad** en palabras por minuto (PPM): (caracteres correctos ÷ 5) ÷ minutos.
- **Precisión:** teclas correctas ÷ teclas presionadas, en porcentaje.

| Estrellas | Condición | Qué pasa |
|---|---|---|
| ⭐ | terminó, pero no llegó a la velocidad mínima o tuvo menos de 90 % de precisión | tiene que rehacerlo |
| ⭐⭐ | velocidad mínima y 90 % de precisión o más | desbloquea el siguiente |
| ⭐⭐⭐ | velocidad objetivo y 95 % de precisión o más | desbloquea el siguiente |

Umbrales de arranque. **Van todos juntos en `niveles.js`**, para que Nicolás los ajuste sin tocar la lógica:

| Niveles | Mínima (PPM) | Objetivo (PPM) |
|---|---|---|
| Parte 1 · niveles 1 a 3 | 10 | 15 |
| Parte 1 · niveles 4 a 6 | 12 | 18 |
| Parte 2 · palabras cortas | 15 | 22 |
| Parte 2 · palabras largas | 18 | 26 |
| Parte 2 · frases | 20 | 30 |

Los niveles ganados se pueden repetir; queda guardado el mejor resultado.

## Pantalla de resultado — es la que los alumnos capturan

Aparece **al terminar cada nivel**, siempre, con todo junto y a la vista sin hacer scroll:

- Nombre y apellido · curso
- Parte y nombre del nivel (o "Modo libre" y el tema)
- Tiempo
- Velocidad (PPM) y precisión (%)
- Estrellas
- Fecha y hora

Debajo:
- Un recuadro **"Cómo sacar la captura"**: `Windows + Impr Pant` guarda la pantalla completa en Imágenes › Capturas de pantalla; `Windows + Shift + S` recorta una parte. Después se sube el archivo a Classroom.
- Botones: "Reintentar", "Siguiente nivel" (si lo ganó) y "Niveles".

La pantalla tiene que entrar completa en un monitor de 1366 × 768.

## Registro

- Al entrar pide **nombre y apellido** y **curso**. Se guardan solo en ese navegador.
- Las computadoras del laboratorio son compartidas: el progreso se guarda **por alumno** (por nombre), y hay un botón "Cambiar de alumno".
- `localStorage` con el prefijo `meca:` (todos los sitios de `prof-nkocussi.github.io` comparten el almacenamiento). Si `localStorage` no está disponible, el juego funciona igual sin guardar.
- Vista **"Mi progreso"**: todos los niveles con su mejor resultado (estrellas, PPM, precisión, fecha) y los récords del modo libre. También sirve para capturar.
- Aviso claro en el inicio: el progreso queda en esa computadora; en otra, se empieza de nuevo.

## Controles antes de entregar

- Funciona con teclado físico en Chrome y Edge. En el celular muestra un aviso: "Este juego necesita un teclado".
- Todo el juego se puede usar sin mouse (Tab, Enter, Escape para salir de un nivel).
- Foco visible. El resultado se anuncia a lectores de pantalla. Respeta `prefers-reduced-motion`.
- Sin scroll horizontal. Sin errores en la consola.
- Ningún texto de práctica usa caracteres fuera de `a-z`, `0-9`, espacio, coma y punto. Verificarlo con un chequeo automático sobre `niveles.js`.

## Listas de palabras — a revisar por Nicolás

Todo en minúscula, sin ñ ni tildes. Quedaron afuera los nombres que llevan tilde, ñ o apóstrofo.

### Computación

- **Cortas:** mouse, cable, disco, red, wifi, chip, dato, tecla, panel, clic, byte, bit, web, pixel, virus, mail, nube, zoom, link, chat, login, placa, video, audio, texto, celda, fila, tabla, clave, copia
- **Largas:** teclado, monitor, pantalla, impresora, parlante, procesador, memoria, programa, archivo, carpeta, internet, navegador, servidor, software, hardware, notebook, escritorio, documento, planilla, usuario, descarga, ventana, sistema, algoritmo, buscador, auricular, plantilla, diapositiva, computadora, dispositivo
- **Frases:**
  - el teclado, el mouse y el monitor se conectan a la computadora.
  - guardo el archivo, cierro el programa y apago la notebook.
  - la impresora no tiene papel, hay que cargar hojas nuevas.
  - abro el navegador, escribo la consulta y presiono enter.
  - tengo 3 carpetas, 12 documentos y 2 planillas en el disco.

### Equipos de fútbol

- **Cortas:** boca, river, racing, tigre, ferro, milan, inter, roma, ajax, porto, betis, santos, napoli, chelsea, sevilla
- **Largas:** independiente, estudiantes, gimnasia, platense, banfield, talleres, belgrano, quilmes, sarmiento, instituto, chacarita, barcelona, liverpool, juventus, flamengo, palmeiras, valencia, arsenal, san lorenzo, real madrid, godoy cruz, rosario central
- **Frases:**
  - boca, river y racing juegan el domingo.
  - el partido termina 2 a 1, gana independiente.
  - talleres, belgrano e instituto son de la misma provincia.
  - san lorenzo hace 3 goles, estudiantes hace 2.
  - milan, inter y juventus juegan en italia.

### Marcas de ropa

- **Cortas:** nike, puma, fila, vans, zara, lee, gap, reef, joma, kappa, umbro, rusty, asics, topper, adidas, reebok, jordan, hummel
- **Largas:** converse, lacoste, wrangler, columbia, montagne, champion, billabong, quiksilver, timberland, kevingston, diadora, penalty, new balance, rip curl, the north face, under armour, calvin klein, john foos
- **Frases:**
  - tengo zapatillas topper, un buzo puma y una gorra vans.
  - la campera cuesta 90, el buzo cuesta 45.
  - compro 2 remeras, 1 gorra y 3 pares de medias.
  - nike, adidas y puma hacen ropa de deporte.
  - el local abre a las 9, cierra a las 20.

### Electrodomésticos

- **Cortas:** horno, radio, pava, anafe, estufa, cocina, plancha, freezer, secador, balanza, consola, tele, grill, timbre, parlante
- **Largas:** heladera, lavarropas, microondas, licuadora, batidora, aspiradora, ventilador, televisor, cafetera, secarropas, lavavajillas, calefactor, termotanque, extractor, procesadora, freidora, exprimidor, caloventor, tostadora, purificador, aire acondicionado
- **Frases:**
  - la heladera, el horno y el microondas van en la cocina.
  - el lavarropas tarda 45 minutos, el secarropas tarda 30.
  - enchufo la pava, preparo el mate y prendo la radio.
  - el ventilador tiene 3 velocidades, la estufa tiene 2.
  - apago el televisor, desenchufo la plancha y cierro la puerta.

## Etapas de trabajo

1. **Base:** estructura, estilos, pantalla de inicio con nombre y curso, mapa de niveles.
2. **Motor del juego:** escritura, errores, cronómetro, teclado en pantalla, PPM, precisión y estrellas, con el nivel 1.
3. **Pantalla de resultado y registro** por alumno, "Mi progreso".
4. **Parte 1 completa** (niveles 1 a 6), con sus textos listados para revisar.
5. **Parte 2** (4 temas) y **modo libre**.
6. Controles, README y publicación.

## Pendientes a consultar con Nicolás

- Qué sistema tienen las computadoras del laboratorio (los atajos de captura son de Windows).
- Si quiere niveles extra con mayúsculas al final.
- Ajuste de los umbrales después de probarlo con un curso.
