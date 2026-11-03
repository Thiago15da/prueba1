# Castiglioni & Asociados — propuesta visual NovaTec

**Demo institucional no oficial · NovaTec Engineering · noviembre de 2026**

Esta propuesta de rediseño está basada en información pública de [castiglioni.com.py](https://www.castiglioni.com.py/), no en una aprobación de la firma.

## Investigación verificada

- Estudio Jurídico Castiglioni & Asociados, Asunción, Paraguay.
- Contacto publicado: **info@castiglioni.com.py**, **+595 981 267406**, **Humaitá 505, Asunción**.
- Socios identificados en el sitio: **Carmelo Castiglioni** y **Fabrizio Castiglioni**.
- La biografía de Carmelo publicada por el estudio lo identifica como abogado y doctor en Ciencias Jurídicas por la Facultad de Derecho y Ciencias Sociales de la Universidad Nacional de Asunción.
- Áreas: Derecho Civil, Derecho Corporativo, Litigios, Propiedad Intelectual y Derecho de la Competencia.
- El apartado de litigios incluye recupero judicial y extrajudicial de créditos (facturas, cheques, pagarés).
- Misión publicada: servicio profesional personalizado, cercanía, comunicación directa, ética y transparencia.
- **No se incluyen datos inventados de antigüedad, casos ganados, clientes, premios o títulos académicos adicionales.**

Fuentes oficiales:
1. https://www.castiglioni.com.py/
2. https://www.castiglioni.com.py/nosotros/
3. https://www.castiglioni.com.py/areas-de-practica/
4. https://www.castiglioni.com.py/equipo/

## Arquitectura de la demo
- `index.html` — inicio, posicionamiento, áreas de práctica, enfoque y contacto.
- `areas-de-practica.html` — cinco servicios principales y recuperación de créditos.
- `equipo.html` — socios reconocidos en la web actual, sin biografías inventadas.
- `contacto.html` — consulta preparada mediante correo o WhatsApp (sin backend).
- `assets/style.css` — sistema visual, tipografía, responsive y accesibilidad.
- `assets/app.js` — navegación móvil, preguntas y formulario.
- `tests/qa.mjs` + GitHub Actions — comprobaciones funcionales y visuales.
- Las fotografías de los socios no pudieron recuperarse desde la web oficial durante la preparación de la demo. Se presentan sus iniciales en lugar de fotografías falsas.

Se usan imágenes arquitectónicas genéricas identificadas como **ilustrativas**. La demo incluye `noindex,nofollow` para evitar confusión con el sitio oficial.

## Para producción
Confirmar con la firma el uso de logo e imágenes oficiales, biografías completas, alcance de los servicios, privacidad de datos, consentimiento y destino de formularios. Reemplazar las imágenes ilustrativas, añadir política de privacidad, activar backend real y revisar SEO/dominio tras aprobación.

Esta versión no realiza captación automática de datos, no envía mensajes sin intervención del visitante y no promete resultados jurídicos.

## Vista previa y publicación

La versión fuente está en **Thiago15da/prueba1**. Como este repositorio nuevo no tenía GitHub Pages habilitado y la integración carece de permiso para activarlo automáticamente, existe una copia de vista previa aislada en **https://novatec.com.py/demos/castiglioni/**, sin modificar el sitio oficial de Castiglioni ni otras demos de NovaTec.

Para habilitar Pages directamente en `prueba1`, su propietario debe ir a **Settings → Pages → Build and deployment → Source: GitHub Actions** y luego ejecutar manualmente el workflow **Castiglioni — Publicar al habilitar Pages**. No se volverán a iniciar despliegues fallidos automáticamente.
