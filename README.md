# Mecanografía

Juego web para aprender a escribir con todos los dedos.
Lo usan los alumnos de 1.er año en el Taller de Procesamiento de Datos, y cualquier curso en tiempos muertos.

**Jugar:** https://prof-nkocussi.github.io/Juego-Mecanografia/

Prof. Nicolás A. Cussi · C.T.P. "Olga B. de Arko" · Ushuaia

## Cómo se juega

- Se necesita una computadora con **teclado físico** (en el celular aparece un aviso).
- Al entrar, el alumno escribe su **nombre y apellido** y su **curso**.
- La letra que toca escribir está resaltada. Si se equivoca, la letra se marca en rojo y no avanza hasta tocar la correcta.
- El teclado en pantalla muestra la tecla que sigue y con qué dedo va.
- Al terminar cada nivel aparece la **pantalla de resultado** con nombre, curso, nivel, tiempo, velocidad, precisión, estrellas, fecha y hora. Esa pantalla es la que se captura y se sube a Classroom.
- Todo se puede usar sin mouse: Tab, Enter y Escape para salir de un nivel.

### Niveles

- **Parte 1 · Aprender las teclas:** 6 niveles en orden (fila guía, fila superior, fila inferior, todas las letras, números, coma y punto). Cada uno se abre al ganar el anterior con 2 estrellas.
- **Parte 2 · Palabras por tema:** se abre al terminar la Parte 1. 4 temas (computación, equipos de fútbol, marcas de ropa, electrodomésticos) con 3 niveles cada uno: palabras cortas, palabras largas y frases. Las palabras salen al azar en cada intento.
- **Modo libre · 1 minuto:** disponible desde el principio. Se elige un tema y se escribe todo lo posible en un minuto. Guarda el récord por tema.

### Estrellas

- **Velocidad:** palabras por minuto (PPM) = (caracteres correctos ÷ 5) ÷ minutos.
- **Precisión:** teclas correctas ÷ teclas presionadas.

| Estrellas | Condición |
|---|---|
| ⭐ | terminó, pero no llegó a la velocidad mínima o tuvo menos de 90 % de precisión |
| ⭐⭐ | velocidad mínima y 90 % de precisión o más: abre el siguiente nivel |
| ⭐⭐⭐ | velocidad objetivo y 95 % de precisión o más |

## Dónde se guarda el progreso

- Solo en el navegador de esa computadora (`localStorage`, con el prefijo `meca:`). No se envía nada a ningún servidor.
- El progreso se guarda **por alumno** (por nombre): en una computadora compartida, cada uno se anota con su nombre y retoma lo suyo. El botón "Cambiar de alumno" vuelve a la pantalla de inicio.
- En otra computadora, o si se borran los datos del navegador, se empieza de nuevo.
- **Mi progreso** muestra todos los niveles con el mejor resultado y los récords del modo libre. También sirve para capturar.

## Para el docente

### Ajustar umbrales, textos y listas

Todo está en [`assets/js/niveles.js`](assets/js/niveles.js), sin tocar la lógica:

- `UMBRALES`: velocidad mínima y objetivo de cada grupo de niveles, y los porcentajes de precisión.
- `PARTE1`: los textos de los niveles 1 a 6.
- `TEMAS`: palabras cortas, largas y frases de cada tema.

Los textos solo pueden usar **letras de la a a la z, números, espacio, coma y punto**, todo en minúscula (sin ñ, sin tildes, sin mayúsculas). Así el juego funciona igual con cualquier distribución de teclado.

Después de cambiar textos, verificarlos con [Node.js](https://nodejs.org/):

```
node herramientas/verificar-textos.js
```

El chequeo avisa si hay caracteres no permitidos, si un nivel de la Parte 1 usa teclas de niveles posteriores o si a un tema le faltan palabras.

### Probar en la computadora

Abrir `index.html` con doble clic alcanza: no hace falta instalar nada.

## Estructura

```
index.html                 una sola página con todas las vistas
assets/css/estilos.css     estilos y paleta
assets/js/niveles.js       niveles, textos, listas y umbrales
assets/js/juego.js         lógica del juego
assets/fonts/              tipografías Barlow (licencia OFL, ver OFL.txt)
herramientas/              chequeo de los textos
```

HTML, CSS y JavaScript, sin frameworks ni dependencias externas.
