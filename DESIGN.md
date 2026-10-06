---
name: BACKWARD®
description: Inspired By Culture. EST.23 — Art and aesthetics.
colors:
  navy: "#151f32"
  navy-deep: "#0e1524"
  navy-line: "#26324a"
  fog: "#aab4c8"
  studio: "#f1f1ef"
  studio-edge: "#dcdcd7"
  ink: "#10141d"
  ink-soft: "#4a5363"
  denim: "#2c3e4e"
  gold: "#d8bc48"
typography:
  wordmark:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.5rem, 12.4vw, 14.5rem)"
    fontWeight: 900
    lineHeight: 0.86
    letterSpacing: "-0.02em"
  display:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 7vw, 6rem)"
    fontWeight: 900
    lineHeight: 0.9
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  label:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.01em"
rounded:
  patch: "3px"
  avatar: "50%"
spacing:
  pad: "clamp(1rem, 4vw, 3.5rem)"
  section: "clamp(3.5rem, 8vw, 7rem)"
components:
  patch-primary:
    backgroundColor: "{colors.gold}"
    textColor: "{colors.navy}"
    rounded: "{rounded.patch}"
    padding: "0.85rem 1.4rem"
    height: "3.25rem"
  patch-navy:
    backgroundColor: "{colors.navy}"
    textColor: "{colors.studio}"
    rounded: "{rounded.patch}"
    padding: "0.85rem 1.4rem"
  patch-ghost:
    textColor: "{colors.studio}"
    rounded: "{rounded.patch}"
    padding: "0.85rem 1.4rem"
  patch-small:
    backgroundColor: "{colors.studio}"
    textColor: "{colors.navy}"
    rounded: "{rounded.patch}"
    padding: "0.5rem 1rem"
    height: "2.5rem"
---

# Design System: BACKWARD®

## Overview

**Creative North Star: "La etiqueta de cuero, ampliada"**

La web toma prestado todo de la propia ropa de BACKWARD®: el azul marino del logo y del parche de cuero, el blanco de estudio de sus fotos, el denim lavado y el tartán de la destacada "culture". Cada botón es un parche con costura. La página alterna campos navy completos con planos blancos de estudio, igual que el feed alterna estudio y calle.

La voz tipográfica es el logotipo: una sans muy negra, inclinada y algo expandida, siempre en mayúsculas. El texto corrido usa la misma familia en redonda, sin adornos.

**Key Characteristics:**
- El navy cubre al menos la mitad de cada pantalla.
- La mostaza solo aparece en la acción principal y en el "Escríbenos." final.
- Fotografía real de la marca en marcos blancos de estudio, nunca ilustración.
- La cinta "Inspired By Culture" avanza hacia atrás, en contra de la lectura y del scroll.

## Colors

Un navy dominante, el blanco del estudio y un único acento mostaza tomado de la funda del drop.

### Primary
- **Navy BACKWARD** (#151F32): el fondo de la cabecera, el hero, la sección culture y el cierre; el color del logo y del parche de cuero.

### Secondary
- **Mostaza drop** (#D8BC48): solo para la acción principal ("Pedir por DM") y el "Escríbenos." del cierre, además del anillo de foco y la selección de texto. Nunca como texto sobre el blanco de estudio (1.7:1).

### Tertiary
- **Denim** (#2C3E4E): el tartán, los separadores de la cinta y la barra de scroll.

### Neutral
- **Blanco estudio** (#F1F1EF): el fondo de las secciones de producto y los marcos de las fotos.
- **Borde estudio** (#DCDCD7): las líneas sobre el blanco y el fondo de las imágenes mientras cargan.
- **Tinta** (#10141D) / **Tinta suave** (#4A5363): el texto sobre el blanco.
- **Niebla** (#AAB4C8): el texto secundario sobre el navy (el gris nunca es neutro, siempre va teñido de navy).
- **Navy profundo** (#0E1524) / **Línea navy** (#26324A): el pie de página y los separadores sobre navy.

### Named Rules
**La regla de la etiqueta.** La mostaza marca la acción; si aparece en más de dos sitios por pantalla, deja de significar "escríbenos".

## Typography

**Display Font:** Archivo (variable, servida en local), negra 900, cursiva, font-stretch 112 %, en mayúsculas.
**Body Font:** Archivo redonda 400 a 600.

**Character:** una sola familia que va de la voz del logotipo (cursiva negra expandida) al texto tranquilo (redonda), como el logo y el texto de una etiqueta.

- El wordmark ocupa todo el ancho del hero y nunca pasa a dos líneas.
- Tracking mínimo de -0.02em en los titulares.

## Elevation

Plana. Las únicas sombras son la sombra suave bajo las fotos de la tira de contactos y la que aparece al pasar el cursor sobre los parches (0 10px 22px -10px). No hay tarjetas.

## Components

- **Parche:** un rectángulo con radio de 3px y una costura punteada interior (outline dashed de 1.5px con offset de -6px). Variantes: mostaza (principal), navy, ghost y pequeño (cabecera). Al pasar el cursor sube 2px y la flecha avanza 3px.
- **Tira de contactos:** fotos con un marco blanco de estudio que cruzan del navy al blanco.
- **Cinta:** el texto de la marca en cursiva negra, desplazándose hacia la derecha; se queda estática con reduced-motion.
- **Lista de destacadas:** filas con el círculo de la destacada de Instagram, el nombre en cursiva y una nota en niebla.
- **Lista de canales:** filas a todo el ancho; al pasar el cursor el nombre se desplaza y se vuelve mostaza.

## Do's and Don'ts

- Do: usar fotos reales de la marca; sustituir los recortes provisionales de `assets/img/` por los originales.
- Do: escribir como la marca, con frases cortas y mezcla de español e inglés.
- Don't: inventar precios, tallas, testimonios ni un catálogo.
- Don't: usar la mostaza como texto sobre el blanco de estudio.
- Don't: añadir tarjetas, degradados ni ilustraciones.
