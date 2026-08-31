# Audio — FALTA ESTE ARCHIVO

La página necesita acá un archivo llamado exactamente:

    es-verdad.mp3

Sin él la música no suena. No es un problema de código: el reproductor entra
solo en **modo simulado** (la barra y el ecualizador se mueven igual, y al
expandirlo aparece un chip que dice "demo"), pero no hay nada que reproducir.

Formatos seguros en todos los celulares: `.mp3` o `.m4a` (AAC).

## Cómo arranca la música

Al entrar, la pantalla espera un toque —"Tocá para entrar"— y recién ahí suena.

Eso no es una decisión de diseño que se pueda sacar: **ningún navegador deja
que una página arranque sonando sola**. Bloquean el audio hasta que quien la
abre hace algo, y en un celular son todavía más estrictos. Ese toque es el
permiso; sin él la música no sonaría nunca, ni con autoplay ni de ninguna otra
forma.

El reproductor flotante de la esquina queda igual, pero ya arranca sonando: su
botón sirve para pausar, no para empezar.
