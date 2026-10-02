/*
  CHITA AUTOMOTORES — datos del sitio (única fuente de verdad)

  NEGOCIO
  - Dirección, teléfono fijo y celular: impresos en los marcos de patente que llevan
    las unidades de Chita en sus propias fotos; el fijo coincide con 6 directorios públicos.
  - Instagram y Facebook: perfiles oficiales provistos por el cliente.
  - No se cargan horarios (las fuentes públicas se contradicen), ni año de fundación,
    ni reseñas, ni precios: no hay dato confirmado.

  INVENTARIO
  - Para agregar una unidad: copiar un objeto, cambiar los datos y sumar las fotos en
    assets/img/ (nombre-N-1080.webp y nombre-N-540.webp). El sitio genera solo el
    índice, la escena de la unidad, el mensaje de WhatsApp y los datos estructurados.
  - `datos`: salen de la publicación de Chita (marca, versión, año, km).
  - `enFotos`: solo lo que se ve en las fotos. Nada de equipamiento inventado.
  - `precio: null` se muestra como "Consultar".
*/
window.CHITA = {
  negocio: {
    nombre: 'Chita Automotores',
    calle: 'Gral. Galarza 1712',
    esquina: 'Díaz Vélez',
    ciudad: 'Concepción del Uruguay',
    provincia: 'Entre Ríos',
    pais: 'Argentina',
    cp: 'E3260',
    telFijo: { visible: '03442 44-2782', e164: '+543442442782' },
    celular: { visible: '3442 64-7442', e164: '+5493442647442', wa: '5493442647442' },
    mapsLugar: 'https://www.google.com/maps/place/Chita+Automotores/',
    mapsRuta: 'https://www.google.com/maps/dir/?api=1&destination=Chita+Automotores%2C+Gral.+Galarza+1712%2C+Concepci%C3%B3n+del+Uruguay%2C+Entre+R%C3%ADos',
    instagram: { usuario: 'chita.automotores', url: 'https://www.instagram.com/chita.automotores/' },
    facebook: { usuario: 'Chitaautomotores', url: 'https://www.facebook.com/Chitaautomotores' }
  },

  inventario: [
    {
      id: 'chevrolet-tracker-2021',
      marca: 'Chevrolet',
      modelo: 'Tracker',
      version: 'Premier 1.2T',
      anio: 2021,
      km: 100000,
      precio: null,
      motor: '1.2 turbo',
      recorte: 'hero-tracker',
      publicacion: 'tracker-pub',
      enFotos: ['Color gris plata', 'Techo solar', 'Llantas de aleación', 'Tapizado en dos tonos', 'Pantalla central', 'Cambio automático'],
      fotos: [
        { n: 'tracker-1', pos: '50% 62%', alt: 'Chevrolet Tracker gris plata frente a la vidriera de Chita, vista delantera derecha' },
        { n: 'tracker-2', pos: '50% 58%', alt: 'Chevrolet Tracker Premier gris plata sobre la vereda, vista delantera izquierda' },
        { n: 'tracker-3', pos: '50% 56%', alt: 'Chevrolet Tracker, vista trasera derecha, con la fachada de Chita detrás' },
        { n: 'tracker-4', pos: '50% 58%', alt: 'Chevrolet Tracker, vista trasera izquierda, con ópticas y luneta' },
        { n: 'tracker-5', pos: '50% 64%', alt: 'Tablero, volante y pantalla central del Tracker, vistos desde atrás' },
        { n: 'tracker-6', pos: '50% 58%', alt: 'Butacas delanteras del Tracker en dos tonos, con techo solar' },
        { n: 'tracker-7', pos: '50% 60%', alt: 'Asiento trasero del Tracker en dos tonos' }
      ]
    },
    {
      id: 'fiat-palio-2017',
      marca: 'Fiat',
      modelo: 'Palio',
      version: 'Attractive 1.4N',
      anio: 2017,
      km: 128000,
      precio: null,
      motor: '1.4',
      recorte: null,
      publicacion: 'palio-pub',
      enFotos: ['Color blanco', 'Cinco puertas', 'Caja manual', 'Tapizado de tela gris'],
      fotos: [
        { n: 'palio-1', pos: '50% 58%', alt: 'Fiat Palio blanco dentro del salón de Chita, con el logo en la pared' },
        { n: 'palio-2', pos: '50% 60%', alt: 'Fiat Palio blanco, vista delantera izquierda, dentro del salón' },
        { n: 'palio-3', pos: '50% 56%', alt: 'Fiat Palio blanco, vista trasera derecha' },
        { n: 'palio-4', pos: '50% 56%', alt: 'Fiat Palio blanco, vista trasera izquierda' },
        { n: 'palio-5', pos: '50% 60%', alt: 'Butacas delanteras del Palio en tela gris, con palanca de cambios' },
        { n: 'palio-6', pos: '50% 60%', alt: 'Asiento trasero del Palio en tela gris' }
      ]
    }
  ]
};
