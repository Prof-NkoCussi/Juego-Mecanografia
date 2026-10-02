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
        alElegir: () => abrirNivel('Parte 1 · Nivel ' + nivel.numero, nivel.nombre),
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
          alElegir: () => abrirNivel('Parte 2 · ' + tema.nombre, nivel.nombre)
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
        onclick: () => abrirNivel('Modo libre', tema.nombre)
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

  // ---------- Juego (provisorio hasta la etapa 2) ----------
  function abrirNivel(parte, nombre) {
    $('juego-parte').textContent = parte;
    $('titulo-juego').textContent = nombre;
    mostrar('juego');
  }

  // ---------- Teclado global ----------
  function alPresionarTecla(evento) {
    if (evento.key === 'Escape' && vistaActual === 'juego') {
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
    $('cambiar-alumno').addEventListener('click', () => { cerrarSesion(); mostrarInicio(); });
    $('juego-volver').addEventListener('click', mostrarNiveles);
    document.addEventListener('keydown', alPresionarTecla);

    if (retomarSesion()) mostrarNiveles();
    else mostrarInicio();
  }

  iniciar();
})();
