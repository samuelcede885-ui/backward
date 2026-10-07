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

  // Catálogo de backward.mitiendanube.com (nombres y precios de la tienda).
  // images[0] es la foto principal; images[1] la otra cara de la franela.
  // sizes: S, M, L y XL (confirmadas). stock: null oculta la barra de stock.
  products: [
    {
      id: 'red-boxy', name: 'Red Boxy T-shirt', model: 'Boxy fit · Rojo', price: 25,
      images: ['assets/img/products/red-1.jpg', 'assets/img/products/red-2.jpg'],
      sizes: ['S', 'M', 'L', 'XL'], stock: null,
      desc: 'Franela boxy roja. Al frente: BACKWARD® "Cowboy Stuff – Exclusive Piece", con los caballos y la estrella. Espalda lisa.'
    },
    {
      id: 'dark-grey-boxy', name: 'Dark Grey Boxy T-shirt', model: 'Boxy fit · Gris oscuro', price: 25,
      images: ['assets/img/products/dark-grey-1.jpg', 'assets/img/products/dark-grey-2.jpg'],
      sizes: ['S', 'M', 'L', 'XL'], stock: null,
      desc: 'Franela boxy gris oscuro. Espalda: la bota vaquera de BACKWARD STUDIOS© ("Cowboy boot – Exclusive item", "New movement based in Venezuela"). Al frente: "Cowboy // Stuff©".'
    },
    {
      id: 'white-boxy', name: 'White Boxy T-shirt', model: 'Boxy fit · Blanco', price: 25,
      images: ['assets/img/products/white-1.jpg', 'assets/img/products/white-2.jpg'],
      sizes: ['S', 'M', 'L', 'XL'], stock: null,
      desc: 'Franela boxy blanca con el estampado de los mocasines de BACKWARD STUDIOS. La otra cara es lisa.'
    },
    {
      id: 'forest-green-boxy', name: 'Forest Green Boxy T-shirt', model: 'Boxy fit · Verde bosque', price: 25,
      images: ['assets/img/products/forest-green-1.jpg', 'assets/img/products/forest-green-2.jpg'],
      sizes: ['S', 'M', 'L', 'XL'], stock: null,
      desc: 'Franela boxy verde bosque. Espalda: BACKWARD® Lamp Design, la lámpara naranja ("Creative department // Inspired by culture"). Al frente: "Italian lamp designed in 1965" y "Minimalism – Art and aesthetics".'
    },
    {
      id: 'granite-boxy', name: 'Granite Boxy T-shirt', model: 'Boxy fit · Granito', price: 25,
      images: ['assets/img/products/granite-1.jpg', 'assets/img/products/granite-2.jpg'],
      sizes: ['S', 'M', 'L', 'XL'], stock: null,
      desc: 'Franela boxy granito con letras color durazno. Espalda: "The Essential Luxury©". Al frente: "Studios© Backward".'
    },
    {
      id: 'navy-blue-boxy', name: 'Navy Blue Boxy T-shirt', model: 'Boxy fit · Azul marino', price: 25,
      images: ['assets/img/products/navy-1.jpg', 'assets/img/products/navy-2.jpg'],
      sizes: ['S', 'M', 'L', 'XL'], stock: null,
      desc: 'Franela boxy azul marino. Al frente: "Backward Classic" ("Classic daily aesthetics // Inspired by culture") con las estrellas. Espalda lisa.'
    }
  ]
};
