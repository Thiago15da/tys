# Audio

Dejá acá el archivo de la canción y apuntá `audioTrack.src` en
`src/data/mockData.js` a esta ruta.

    public/audio/es-verdad.mp3   →   src: "/audio/es-verdad.mp3"

Mientras el archivo no exista, el reproductor entra solo en **modo simulado**:
la barra de progreso, el ecualizador y los tiempos siguen funcionando (aparece
un chip "demo" al expandirlo). Podés maquetar la página entera sin el mp3.

Formatos seguros en todos los navegadores: `.mp3` o `.m4a` (AAC).
