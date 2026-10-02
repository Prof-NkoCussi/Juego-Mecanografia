// Lógica del juego.
(function () {
  'use strict';

  // ---------- Almacenamiento ----------
  // Todos los sitios de prof-nkocussi.github.io comparten localStorage: todo va con el prefijo "meca:".
  // Si localStorage no está disponible, el juego funciona igual sin guardar.
  const PREFIJO = 'meca:';

  const almacen = (function () {
    let disponible = false;
    try {
      const prueba = PREFIJO + 'prueba';
      localStorage.setItem(prueba, '1');
      localStorage.removeItem(prueba);
      disponible = true;
    } catch (e) { /* sin almacenamiento */ }

    return {
      disponible,
      leer(clave) {
        if (!disponible) return null;
        try {
          const valor = localStorage.getItem(PREFIJO + clave);
          return valor === null ? null : JSON.parse(valor);
        } catch (e) { return null; }
      },
      guardar(clave, valor) {
        if (!disponible) return;
        try { localStorage.setItem(PREFIJO + clave, JSON.stringify(valor)); } catch (e) { /* lleno o bloqueado */ }
      },
      borrar(clave) {
        if (!disponible) return;
        try { localStorage.removeItem(PREFIJO + clave); } catch (e) { /* nada */ }
      }
    };
  })();

  // ---------- Alumno ----------
  // El progreso se guarda por nombre: "Nicolás Cussi" y "nicolas  cussi" son el mismo alumno.
  let alumno = null; // { clave, nombre, curso, niveles: {}, libre: {} }

  function claveAlumno(nombre) {
    return nombre.normalize('NFD').replace(/[̀-ͯ]/g, '')
      .toLowerCase().replace(/\s+/g, ' ').trim();
  }

  function limpiarTexto(texto) {
    return texto.replace(/\s+/g, ' ').trim();
  }

  function iniciarSesion(nombre, curso) {
    const clave = claveAlumno(nombre);
    const guardado = almacen.leer('alumno:' + clave) || {};
    alumno = {
      clave,
      nombre,
      curso,
      niveles: guardado.niveles || {},
      libre: guardado.libre || {}
    };
    guardarAlumno();
    almacen.guardar('actual', clave);
  }

  function guardarAlumno() {
    if (alumno) almacen.guardar('alumno:' + alumno.clave, alumno);
  }

  function retomarSesion() {
    const clave = almacen.leer('actual');
    if (!clave) return false;
    const guardado = almacen.leer('alumno:' + clave);
    if (!guardado || !guardado.nombre) return false;
    alumno = {
      clave,
      nombre: guardado.nombre,
      curso: guardado.curso || '',
      niveles: guardado.niveles || {},
      libre: guardado.libre || {}
    };
    return true;
  }

  function cerrarSesion() {
    alumno = null;
    almacen.borrar('actual');
  }

  // ---------- Progreso y desbloqueo ----------
  function idNivelTema(tema, numero) {
    return 'p2-' + tema.id + '-' + numero;
  }

  function estrellasDe(id) {
    const r = alumno && alumno.niveles[id];
    return r ? r.estrellas || 0 : 0;
  }

  function ganado(id) {
    return estrellasDe(id) >= ESTRELLAS_PARA_AVANZAR;
  }

  function abiertoP1(indice) {
    return indice === 0 || ganado(PARTE1[indice - 1].id);
  }

  function parte1Terminada() {
    return ganado(PARTE1[PARTE1.length - 1].id);
  }

  function abiertoTema(tema, indice) {
    if (!parte1Terminada()) return false;
    return indice === 0 || ganado(idNivelTema(tema, NIVELES_TEMA[indice - 1].numero));
  }

  // ---------- Utilidades de DOM ----------
  const $ = (id) => document.getElementById(id);

  function el(etiqueta, atributos, ...hijos) {
    const nodo = document.createElement(etiqueta);
    for (const [clave, valor] of Object.entries(atributos || {})) {
      if (valor === null || valor === undefined || valor === false) continue;
      if (clave === 'class') nodo.className = valor;
      else if (clave === 'text') nodo.textContent = valor;
      else if (clave === 'html') nodo.innerHTML = valor;
      else if (clave.startsWith('on')) nodo.addEventListener(clave.slice(2), valor);
      else nodo.setAttribute(clave, valor === true ? '' : valor);
    }
    for (const hijo of hijos) {
      if (hijo === null || hijo === undefined || hijo === false) continue;
      nodo.append(hijo);
    }
    return nodo;
  }

  const SVG_ESTRELLA = '<path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.4l-5.8 3.1 1.1-6.5L2.6 9.4l6.5-.9z" stroke-width="1.5" stroke-linejoin="round"/>';
  const SVG_CANDADO = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2" fill="currentColor"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2.4"/></svg>';

  function estrellas(cantidad) {
    let html = '';
    for (let i = 1; i <= 3; i++) {
      html += '<svg viewBox="0 0 24 24" aria-hidden="true" class="' + (i <= cantidad ? 'llena' : 'vacia') + '">' + SVG_ESTRELLA + '</svg>';
    }
    return el('span', {
      class: 'estrellas',
      role: 'img',
      'aria-label': cantidad === 1 ? '1 estrella de 3' : cantidad + ' estrellas de 3',
      html
    });
  }

  function candado() {
    return el('span', { class: 'candado', html: SVG_CANDADO + '<span>Bloqueado</span>' });
  }

  // ---------- Vistas ----------
  const VISTAS = ['inicio', 'niveles', 'juego', 'resultado', 'progreso'];
  let vistaActual = null;

  function mostrar(nombre) {
    vistaActual = nombre;
    for (const v of VISTAS) $('vista-' + v).hidden = v !== nombre;
    $('barra').hidden = nombre === 'inicio';
    if (alumno) {
      $('barra-nombre').textContent = alumno.nombre;
      $('barra-curso').textContent = alumno.curso;
    }
    window.scrollTo(0, 0);
    const titulo = $('vista-' + nombre).querySelector('h1');
    if (titulo) titulo.focus();
  }

  // ---------- Inicio ----------
  function mostrarInicio() {
    $('form-registro').reset();
    marcarError('nombre', false);
    marcarError('curso', false);
    mostrar('inicio');
  }

  function marcarError(campo, hayError) {
    const input = $('campo-' + campo);
    $('error-' + campo).hidden = !hayError;
    if (hayError) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
  }

  function alEnviarRegistro(evento) {
    evento.preventDefault();
    const nombre = limpiarTexto($('campo-nombre').value);
    const curso = limpiarTexto($('campo-curso').value);
    marcarError('nombre', !nombre);
    marcarError('curso', !curso);
    if (!nombre) { $('campo-nombre').focus(); return; }
    if (!curso) { $('campo-curso').focus(); return; }
    iniciarSesion(nombre, curso);
    mostrarNiveles();
  }

  // ---------- Mapa de niveles ----------
  function tarjetaNivel(opciones) {
    const { numero, nombre, abierto, estrellasGanadas, alElegir, contenido } = opciones;
    const etiqueta = 'Nivel ' + numero + ': ' + nombre + '. ' +
      (abierto ? (estrellasGanadas ? (estrellasGanadas === 1 ? '1 estrella.' : estrellasGanadas + ' estrellas.') : 'Sin jugar.') : 'Bloqueado.');

    const pie = el('span', { class: 'nivel__pie' },
      abierto ? estrellas(estrellasGanadas) : candado());

    return el('button', {
      type: 'button',
      class: 'nivel' + (estrellasGanadas >= ESTRELLAS_PARA_AVANZAR ? ' nivel--ganado' : ''),
      'aria-disabled': abierto ? null : 'true',
      'aria-label': etiqueta,
      onclick: () => { if (abierto) alElegir(); }
    },
      el('span', { class: 'nivel__numero', 'aria-hidden': 'true', text: String(numero) }),
      el('span', { class: 'nivel__nombre', text: nombre }),
      contenido || null,
      pie
    );
  }

  function dibujarParte1() {
    const lista = $('mapa-p1');
    lista.replaceChildren();
    PARTE1.forEach((nivel, i) => {
      const contenido = nivel.teclas
        ? el('span', { class: 'nivel__teclas', 'aria-hidden': 'true' }, ...nivel.teclas.map((t) => el('kbd', { text: t })))
        : el('span', { class: 'nivel__desc', text: nivel.descripcion });
      lista.append(el('li', null, tarjetaNivel({
        numero: nivel.numero,
        nombre: nivel.nombre,
        abierto: abiertoP1(i),
        estrellasGanadas: estrellasDe(nivel.id),
        alElegir: () => abrirNivel({ id: nivel.id, parte: 'Parte 1 · Nivel ' + nivel.numero, nombre: nivel.nombre, texto: nivel.texto, velocidad: nivel.velocidad }),
        contenido
      })));
    });
  }

  function dibujarParte2() {
    $('ayuda-parte2').textContent = parte1Terminada()
      ? 'Elegí cualquier tema. Dentro de cada tema, los niveles van en orden.'
      : 'Se abre cuando terminás la Parte 1.';

    const lista = $('mapa-p2');
    lista.replaceChildren();
    for (const tema of TEMAS) {
      const niveles = el('ol', { class: 'tema__niveles' });
      NIVELES_TEMA.forEach((nivel, i) => {
        niveles.append(el('li', null, tarjetaNivel({
          numero: nivel.numero,
          nombre: nivel.nombre,
          abierto: abiertoTema(tema, i),
          estrellasGanadas: estrellasDe(idNivelTema(tema, nivel.numero)),
          alElegir: () => abrirNivel({ id: idNivelTema(tema, nivel.numero), parte: 'Parte 2 · ' + tema.nombre, nombre: nivel.nombre, velocidad: nivel.velocidad })
        })));
      });
      lista.append(el('li', { class: 'tema' },
        el('h3', { class: 'tema__nombre', text: tema.nombre }),
        niveles));
    }
  }

  function dibujarModoLibre() {
    const lista = $('mapa-libre');
    lista.replaceChildren();
    for (const tema of TEMAS) {
      const record = alumno && alumno.libre[tema.id];
      const textoRecord = record ? 'Récord: ' + record.ppm + ' PPM' : 'Récord: sin jugar';
      lista.append(el('li', null, el('button', {
        type: 'button',
        class: 'libre',
        onclick: () => abrirNivel({ id: 'libre-' + tema.id, parte: 'Modo libre', nombre: tema.nombre })
      },
        el('span', { class: 'libre__nombre', text: tema.nombre }),
        el('span', { class: 'libre__record', text: textoRecord })
      )));
    }
  }

  function mostrarNiveles() {
    dibujarParte1();
    dibujarParte2();
    dibujarModoLibre();
    mostrar('niveles');
  }

  // ---------- Medición y estrellas ----------
  function calcularEstrellas(ppm, precision, claveVelocidad) {
    const v = UMBRALES.velocidad[claveVelocidad];
    if (ppm >= v.objetivo && precision >= UMBRALES.precisionObjetivo) return 3;
    if (ppm >= v.minima && precision >= UMBRALES.precisionMinima) return 2;
    return 1;
  }

  function formatoTiempo(ms) {
    const total = Math.floor(ms / 1000);
    const min = Math.floor(total / 60);
    const seg = total % 60;
    return min + ':' + String(seg).padStart(2, '0');
  }

  // ---------- Teclado y manos en pantalla ----------
  const FILAS_TECLADO = ['1234567890', 'qwertyuiop', 'asdfghjkl', 'zxcvbnm,.'];
  const DEDO_DE_TECLA = {};
  for (const dedo of DEDOS) for (const t of dedo.teclas) DEDO_DE_TECLA[t] = dedo;
  const teclasDibujadas = {};

  function dibujarTeclado() {
    const teclado = $('teclado');
    for (const fila of FILAS_TECLADO) {
      const filaEl = el('div', { class: 'teclado__fila' });
      for (const t of fila) {
        const tecla = el('span', {
          class: 'tecla-t dedo--' + DEDO_DE_TECLA[t].color + (t === 'f' || t === 'j' ? ' tecla-t--guia' : ''),
          text: t
        });
        teclasDibujadas[t] = tecla;
        filaEl.append(tecla);
      }
      teclado.append(filaEl);
    }
    const espacio = el('span', { class: 'tecla-t tecla-t--espacio dedo--pulgar', text: 'espacio' });
    teclasDibujadas[' '] = espacio;
    teclado.append(el('div', { class: 'teclado__fila' }, espacio));

    // Mano izquierda; la derecha es la misma dada vuelta.
    const forma = (lado) => {
      const d = lado === 'izq' ? ['mi', 'ai', 'ci', 'ii'] : ['md', 'ad', 'cd', 'id'];
      const color = (id) => DEDOS.find((x) => x.id === id).color;
      const dedo = (id, x, y, w, h, extra) =>
        '<rect class="dedo dedo--' + color(id) + '" data-dedo="' + id + '" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + w / 2 + '"' + (extra || '') + '/>';
      return '<g' + (lado === 'der' ? ' transform="translate(160 0) scale(-1 1)"' : '') + '>' +
        '<rect class="palma" x="14" y="80" width="104" height="64" rx="24"/>' +
        dedo(d[0], 16, 46, 22, 50) +
        dedo(d[1], 41, 24, 24, 72) +
        dedo(d[2], 68, 12, 24, 84) +
        dedo(d[3], 95, 26, 24, 70) +
        '<rect class="dedo dedo--pulgar" data-dedo="pu" x="107" y="82" width="22" height="46" rx="11" transform="rotate(40 118 128)"/>' +
        '</g>';
    };
    $('mano-izq').innerHTML = forma('izq');
    $('mano-der').innerHTML = forma('der');
  }

  function indicarTecla(caracter) {
    for (const t of Object.values(teclasDibujadas)) t.classList.remove('tecla-t--siguiente');
    document.querySelectorAll('.mano .dedo--activo').forEach((d) => d.classList.remove('dedo--activo'));
    const indicado = $('dedo-indicado');
    if (caracter === null) { indicado.replaceChildren(); return; }

    const dedo = DEDO_DE_TECLA[caracter];
    if (teclasDibujadas[caracter]) teclasDibujadas[caracter].classList.add('tecla-t--siguiente');
    document.querySelectorAll('.mano [data-dedo="' + dedo.id + '"]').forEach((d) => d.classList.add('dedo--activo'));
    indicado.replaceChildren(
      'Tecla ', el('strong', { text: caracter === ' ' ? 'espacio' : caracter }),
      ' con el dedo ', el('span', { class: 'chip dedo--' + dedo.color, text: dedo.nombre })
    );
  }

  // ---------- Partida ----------
  // nivel: { id, parte, nombre, texto, velocidad }
  let partida = null;

  function abrirNivel(nivel) {
    terminarCronometro();
    $('juego-parte').textContent = nivel.parte;
    $('titulo-juego').textContent = nivel.nombre;

    const hayTexto = Boolean(nivel.texto);
    $('juego-pendiente').hidden = hayTexto;
    $('juego-area').hidden = !hayTexto;
    $('dato-tiempo').textContent = '0:00';
    $('dato-errores').textContent = '0';
    $('aviso-mayus').hidden = true;

    if (!hayTexto) {
      partida = null;
      mostrar('juego');
      return;
    }

    partida = {
      nivel,
      texto: nivel.texto,
      pos: 0,
      presionadas: 0,
      correctas: 0,
      errores: 0,
      falloEnPos: false,
      inicio: null,
      intervalo: null,
      letras: []
    };
    dibujarTexto();
    marcarActual();
    mostrar('juego');
    $('texto').focus();
  }

  function dibujarTexto() {
    const contenedor = $('texto');
    contenedor.replaceChildren();
    let palabra = null;
    for (const caracter of partida.texto) {
      const letra = el('span', { class: 'letra' + (caracter === ' ' ? ' letra--espacio' : ''), text: caracter });
      partida.letras.push(letra);
      if (caracter === ' ') {
        palabra = null;
        contenedor.append(letra);
      } else {
        if (!palabra) {
          palabra = el('span', { class: 'palabra' });
          contenedor.append(palabra);
        }
        palabra.append(letra);
      }
    }
  }

  function marcarActual() {
    const letra = partida.letras[partida.pos];
    if (letra) letra.classList.add('letra--actual');
    indicarTecla(partida.pos < partida.texto.length ? partida.texto[partida.pos] : null);
  }

  function arrancarCronometro() {
    partida.inicio = performance.now();
    partida.intervalo = setInterval(() => {
      $('dato-tiempo').textContent = formatoTiempo(performance.now() - partida.inicio);
    }, 250);
  }

  function terminarCronometro() {
    if (partida && partida.intervalo) {
      clearInterval(partida.intervalo);
      partida.intervalo = null;
    }
  }

  function procesarTecla(evento) {
    if (evento.ctrlKey || evento.metaKey || evento.altKey) return;
    if (evento.key.length !== 1) return; // Shift, Tab, teclas muertas de tilde, etc.
    evento.preventDefault();
    if (evento.repeat) return; // tecla mantenida apretada: no cuenta

    $('aviso-mayus').hidden = !(evento.getModifierState && evento.getModifierState('CapsLock'));

    if (partida.inicio === null) {
      arrancarCronometro();
      $('juego-consigna').textContent = 'Si te equivocás, tocá la tecla correcta para seguir.';
    }

    partida.presionadas++;
    const esperado = partida.texto[partida.pos];
    const letra = partida.letras[partida.pos];

    if (evento.key.toLowerCase() === esperado) {
      partida.correctas++;
      letra.classList.remove('letra--actual', 'letra--fallo');
      letra.classList.add(partida.falloEnPos ? 'letra--corregida' : 'letra--hecha');
      partida.falloEnPos = false;
      partida.pos++;
      if (partida.pos === partida.texto.length) terminarPartida();
      else marcarActual();
    } else {
      partida.errores++;
      partida.falloEnPos = true;
      letra.classList.add('letra--fallo');
      $('dato-errores').textContent = String(partida.errores);
    }
  }

  function terminarPartida() {
    const ms = performance.now() - partida.inicio;
    terminarCronometro();
    indicarTecla(null);

    const minutos = ms / 60000;
    const ppm = Math.round((partida.texto.length / 5) / minutos);
    const precision = Math.floor((partida.correctas / partida.presionadas) * 100);
    const estrellasGanadas = calcularEstrellas(ppm, precision, partida.nivel.velocidad);
    mostrarResultado({ nivel: partida.nivel, ms, ppm, precision, estrellas: estrellasGanadas });
  }

  function salirDelNivel() {
    terminarCronometro();
    partida = null;
    mostrarNiveles();
  }

  // ---------- Resultado (provisorio: la pantalla completa va en la etapa 3) ----------
  let ultimoNivel = null;

  function mostrarResultado(r) {
    ultimoNivel = r.nivel;
    const v = UMBRALES.velocidad[r.nivel.velocidad];
    let mensaje;
    if (r.estrellas === 3) {
      mensaje = '¡Excelente! Llegaste a la velocidad objetivo.';
    } else if (r.estrellas === 2) {
      mensaje = '¡Muy bien, ganaste el nivel! Para 3 estrellas: ' + v.objetivo + ' PPM y ' + UMBRALES.precisionObjetivo + ' % de precisión.';
    } else {
      mensaje = 'Para ganar el nivel necesitás ' + v.minima + ' PPM y ' + UMBRALES.precisionMinima + ' % de precisión. ¡Probá de nuevo!';
    }

    $('resultado-parte').textContent = r.nivel.parte;
    $('titulo-resultado').textContent = r.nivel.nombre;
    $('resultado-estrellas').replaceChildren(estrellas(r.estrellas));
    $('resultado-tiempo').textContent = formatoTiempo(r.ms);
    $('resultado-ppm').textContent = r.ppm + ' PPM';
    $('resultado-precision').textContent = r.precision + ' %';
    $('resultado-mensaje').textContent = mensaje;
    mostrar('resultado');
    $('resultado-anuncio').textContent =
      'Nivel terminado. ' + (r.estrellas === 1 ? '1 estrella' : r.estrellas + ' estrellas') +
      '. Velocidad: ' + r.ppm + ' palabras por minuto. Precisión: ' + r.precision + ' por ciento. ' + mensaje;
  }

  // ---------- Teclado global ----------
  function alPresionarTecla(evento) {
    if (vistaActual === 'juego') {
      if (evento.key === 'Escape') {
        evento.preventDefault();
        salirDelNivel();
        return;
      }
      if (partida) procesarTecla(evento);
    } else if (vistaActual === 'resultado' && evento.key === 'Escape') {
      evento.preventDefault();
      mostrarNiveles();
    }
  }

  // ---------- Arranque ----------
  function sinTeclado() {
    return window.matchMedia && window.matchMedia('(hover: none) and (pointer: coarse)').matches;
  }

  function iniciar() {
    if (sinTeclado()) {
      $('aviso-teclado').hidden = false;
      $('app').hidden = true;
      return;
    }

    if (!almacen.disponible) {
      $('aviso-guardado').textContent = 'Este navegador no permite guardar: tu progreso se pierde al cerrar la página.';
    }

    $('form-registro').addEventListener('submit', alEnviarRegistro);
    $('cambiar-alumno').addEventListener('click', () => { terminarCronometro(); partida = null; cerrarSesion(); mostrarInicio(); });
    $('juego-salir').addEventListener('click', salirDelNivel);
    $('resultado-reintentar').addEventListener('click', () => abrirNivel(ultimoNivel));
    $('resultado-niveles').addEventListener('click', mostrarNiveles);
    document.addEventListener('paste', (e) => { if (vistaActual === 'juego') e.preventDefault(); });
    dibujarTeclado();
    document.addEventListener('keydown', alPresionarTecla);

    if (retomarSesion()) mostrarNiveles();
    else mostrarInicio();
  }

  iniciar();
})();
