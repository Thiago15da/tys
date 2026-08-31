# Cápsula del Tiempo

SPA inmersiva en dark mode: pre-loader cinemático → hero con text-reveal →
línea de tiempo scrolleable → reloj en vivo que no se detiene. Con dos secretos
escondidos adentro.

Mobile-first estricto. Todo el movimiento es Framer Motion; no hay ni un
componente de librería de UI.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```

---

## Dónde va tu historia

**Un solo archivo: `src/data/mockData.js`.** Ningún componente tiene texto
hardcodeado. Reemplazás los valores de ahí y la experiencia entera se actualiza.

| Export | Qué controla |
| --- | --- |
| `START_DATE` | La fecha base del contador. Hoy: `2026-05-19T00:00:00` |
| `heroContent` | Eyebrow, título (array = una línea por ítem), subtítulo |
| `audioTrack` | Título, artista, ruta del mp3, volumen normal y "agachado" |
| `storyChapters` | **Las tarjetas de la historia.** Una por momento |
| `counterContent` | Encabezado y etiquetas del reloj |
| `footerContent` | Firma del cierre |
| `secretContent` | La palabra secreta y el mensaje oculto |

### Anatomía de un capítulo

```js
{
  id: "cap-01",              // único y estable
  stamp: "19 · 05 · 2026",   // la marca chica de arriba
  kicker: "El principio",    // etiqueta corta, o null
  title: "…",                // titular en serif
  body: ["…", "…"],          // array = varios párrafos
  accent: "gold",            // gold | rose | violet | teal
  side: "left",              // sólo afecta desktop
  media: null,               // { src, alt } para tarjeta con foto
  pull: false,               // true = cita grande sin caja
}
```

Dos recursos para que la lectura no se vuelva monótona: `pull: true` cada 3–4
tarjetas (rompe el ritmo de las cajas) y rotar el `accent`, que tiñe el nodo de
la línea, el kicker y el borde al pasar por encima.

### La música

Dejá el archivo en `public/audio/` y apuntá `audioTrack.src` ahí.

Mientras no exista, el reproductor entra solo en **modo simulado**: la barra, el
ecualizador y los tiempos corren igual con un reloj virtual (aparece un chip
`demo` al expandirlo). Podés maquetar la página completa sin el mp3.

> El navegador nunca deja arrancar audio sin un gesto del usuario. El botón
> late suavemente hasta el primer play; eso es a propósito.

---

## Los secretos

**1. Konami custom.** Tecleá `BANQUITO` en cualquier momento (sin foco en
ningún campo). La música baja el volumen con un fundido, el fondo vira de
violeta/rosa a cacao y aparece el modal con `<SecretMemory/>`.

Como casi nadie tiene teclado en el celular, hay una **puerta trasera táctil**:
mantené presionado 1,6s el punto dorado del footer. Un anillo se completa
alrededor mientras lo sostenés. Una vez descubierto, el punto queda abierto — un
toque simple lo vuelve a abrir.

Mientras tecleás la palabra aparecen unos puntitos en el footer marcando cuánto
llevás acertado. Es el guiño dentro del guiño.

**2. Barra de progreso de lectura.** 1px arriba de todo. No es de color fijo:
arranca en oro, vira a rosa en la mitad de la historia y termina en verde-agua
con un halo, sólo al llegar al final.

---

## Mapa de componentes

```
src/
├── data/mockData.js          ← EL ÚNICO ARCHIVO QUE TOCÁS
├── App.jsx                   orquesta el estado global (carga, secreto)
├── index.css                 design tokens, glassmorphism, keyframes
│
├── components/
│   ├── Preloader.jsx         porcentaje + línea que se llena
│   ├── AuroraBackground.jsx  aurora + polvo en canvas + grano de película
│   ├── ScrollProgress.jsx    la barra de 1px que cambia de color
│   ├── Hero.jsx              text-reveal enmascarado + barrido de luz
│   ├── Timeline.jsx          el riel que se traza al scrollear
│   ├── StoryCard.jsx         la tarjeta (y la paleta de acentos)
│   ├── TimeCapsuleCounter.jsx  el reloj en vivo
│   ├── Odometer.jsx          las cintas de dígitos
│   ├── AudioPlayer.jsx       reproductor flotante custom
│   ├── SecretModal.jsx       el telón del easter egg
│   ├── SecretMemory.jsx      ← PLACEHOLDER del mensaje secreto
│   └── Footer.jsx            cierre + la puerta trasera táctil
│
├── hooks/
│   ├── useTimeElapsed.js     diferencia calendario-exacta, tick sin deriva
│   ├── useSecretCode.js      listener del Konami + long-press
│   └── useMagnetic.js        magnetic hover con física de resorte
│
└── lib/AudioEngine.jsx       motor de audio + modo simulado
```

---

## Despliegue (GitHub Pages)

Cada push a la rama por defecto compila y publica solo, vía
`.github/workflows/deploy.yml`. No hay nada que subir a mano.

**Un único paso manual, la primera vez:** en el repo, *Settings → Pages →
Build and deployment → Source: **GitHub Actions***. El workflow intenta
activarlo por API (`enablement: true`), así que puede que ya esté hecho; si el
job "Configurar Pages" falla, es esto lo que falta.

Mientras sea un *project page* el sitio queda en:

    https://thiago15da.github.io/tys/

### Por qué la base es relativa

`vite.config.js` usa `base: './'`. Un *project page* sirve el sitio desde
`/tys/`, pero en cuanto le conectás un dominio propio pasa a servirse desde la
raíz. Con rutas relativas **el mismo build funciona en los dos lados**: el día
del dominio no hay que recompilar ni cambiar configuración.

Esto vale porque es una sola página sin router. Si algún día agregás rutas del
lado del cliente, hay que volver a una base absoluta y sumar un `404.html` de
fallback.

Por lo mismo, las rutas de `public/` en `mockData.js` van **sin barra
inicial** (`"audio/es-verdad.mp3"`, `"fotos/primera.jpg"`): el helper
`src/lib/asset.js` las resuelve contra la base. Las URLs externas pasan
intactas.

### Conectar el dominio

1. En tu proveedor de DNS, según qué quieras usar:

   **Dominio raíz** (`tudominio.com`) — cuatro registros `A`:

       185.199.108.153
       185.199.109.153
       185.199.110.153
       185.199.111.153

   Y opcionalmente los `AAAA` para IPv6:

       2606:50c0:8000::153
       2606:50c0:8001::153
       2606:50c0:8002::153
       2606:50c0:8003::153

   **Subdominio** (`www.tudominio.com`) — un `CNAME` apuntando a
   `thiago15da.github.io`.

2. En *Settings → Pages → Custom domain*, cargá el dominio y guardá.

3. Agregá el dominio en `public/CNAME` (una línea, sólo el dominio, sin
   `https://`). Con despliegue por Actions el archivo viaja en el artefacto y
   evita que la configuración se pierda entre publicaciones.

4. Esperá a que verifique el DNS y tildá **Enforce HTTPS**. El certificado
   puede demorar unos minutos en emitirse.

> La propagación de DNS puede tardar. Si el sitio da 404 justo después de
> cargar el dominio, casi siempre es eso y no la configuración.

---

## Decisiones técnicas que conviene no deshacer

**El degradé de los títulos va en el elemento que se anima, nunca en un padre.**
`background-clip: text` no pinta el texto de un descendiente que tenga su propio
`transform`: el navegador lo compone en otra capa y las letras salen
transparentes. Por eso cada línea del hero y cada celda del odómetro llevan el
degradé encima. Para que el hero igual se lea como un solo gradiente continuo,
cada línea muestra su rebanada de un fondo que mide N veces su alto.

**El odómetro tiene una celda de más.** La cinta es `0,1,…,9,0`. Sin ese cero
duplicado, al pasar de 9 a 0 la rueda giraría nueve posiciones para atrás y se
vería como un rebobinado. Con la celda extra rodamos hacia adelante y saltamos
al cero real en el mismo frame.

**En el contador nunca uses `key={value}` para reiniciar el latido.** React
desmontaría el odómetro en cada tick y los números aparecerían de golpe en vez
de rodar. El pulso se dispara sobre un MotionValue.

**El tick del reloj es un `setTimeout` auto-corregido** alineado al borde del
segundo, y se re-sincroniza al volver de segundo plano. No acumula deriva como
`setInterval` ni quema batería como un rAF a 60fps.

**Las clases de acento están escritas completas.** Tailwind escanea el código
fuente: `text-${accent}` no existiría en el CSS final. Por eso `ACCENTS` en
`StoryCard.jsx` guarda strings enteros.

**El audio usa dos contextos.** Uno estable con los controles (lo consume el
easter egg para bajar el volumen) y otro volátil con el estado (lo consume sólo
el reproductor). Así la página no re-renderiza mientras suena la música.

**Las tarjetas apilan dos capas de animación.** La externa reacciona al scroll
(parallax, opacidad); la interna hace la entrada con spring. Si las juntás en el
mismo nodo, el transform del scroll pisa al de entrada y el rebote se pierde.

Todo respeta `prefers-reduced-motion`: sin parallax, sin giros, sin partículas
en movimiento.
