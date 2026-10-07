/*
 * Datos de la tienda. Esto es lo único que hay que editar para cambiar
 * productos, precios o datos de pago.
 */
window.STORE = {
  currency: 'USD',
  delivery: null,              // costo de delivery en USD; null = se acuerda por chat
  tasaBs: 200,                 // Bs por 1 USD para el monto de Pago Móvil (actualízala)

  // Adónde llega el comprobante. Si whatsapp está vacío se usa el DM de Instagram.
  whatsapp: '',                // ej.: '584241234567' (código de país, sin + ni espacios)
  instagram: 'backward.ve',

  // PENDIENTE DE CONFIRMAR: estos datos vienen de la maqueta de pago de referencia.
  // Cámbialos por los datos reales de BACKWARD antes de publicar la tienda.
  pagoMovil: { cedula: '12.640.559', telefono: '04241764709', banco: 'Provincial' },
  binance: { payId: '1058945117' },

  // PRODUCTOS DE EJEMPLO (demo: true muestra "Precio de ejemplo").
  // Reemplazar por el catálogo real de backward.mitiendanube.com.
  products: [
    {
      id: 'denim-vintage',
      name: 'Denim ancho',
      model: 'Lavado vintage',
      price: 45,
      img: 'assets/img/drop-denim.jpg',
      sizes: ['28', '30', '32', '34', '36'],
      stock: 14, stockMax: 20,
      desc: 'Jean de corte ancho con lavado vintage y parche de cuero BACKWARD® en la pretina. Cae largo sobre el pie.',
      demo: true
    },
    {
      id: 'tee-logo',
      name: 'Tee negra',
      model: 'Logo gráfico',
      price: 25,
      img: 'assets/img/calle-tee.jpg',
      sizes: ['S', 'M', 'L', 'XL'],
      stock: 22, stockMax: 30,
      desc: 'Camiseta negra con el logotipo BACKWARD® estampado en la espalda.',
      demo: true
    },
    {
      id: 'hoodie-gris',
      name: 'Hoodie gris',
      model: 'Básico',
      price: 40,
      img: 'assets/img/estudio-hoodie.jpg',
      sizes: ['S', 'M', 'L', 'XL'],
      stock: 6, stockMax: 20,
      desc: 'Hoodie gris de corte holgado con capucha.',
      demo: true
    }
  ]
};
