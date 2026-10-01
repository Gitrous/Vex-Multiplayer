# Vex Multiplayer

Versión multijugador de **Vex 7**, el juego de plataformas HTML5 hecho con Phaser 3. Hasta **10 jugadores**
por sala se ven moverse en tiempo real en el mismo nivel.

El juego se publicó como un único archivo minificado de 3 MB. En este repositorio está recuperado como
código fuente editable: 252 módulos en `src/game/`, organizados por carpetas (escenas, jugador, bloques,
obstáculos, UI...), con un build que lo vuelve a empaquetar y un test automático que comprueba que se
puede jugar.

## Puesta en marcha

Requiere Node.js 18 o superior.

```bash
npm install
npm run dev      # abre http://localhost:8080; recompila al guardar (recarga la página para ver los cambios)
```

## Jugar con amigos

1. Arranca el servidor: `npm run build && npm start` (o `npm run dev` mientras desarrollas). Muestra las
   direcciones en las que escucha, incluidas las de tu red local.
2. Abre el juego (por el servidor, `http://…:8080`, no el archivo `index.html` directamente). En la esquina
   inferior izquierda está el panel **Sala**: el código de tu sala, tu nombre marcado con «(tú)» y los
   demás jugadores. **Invitar** copia el enlace para compartirlo; tus amigos también pueden pulsar
   **Unirse con código** y escribir el código (o pegar el enlace). Hasta 10 jugadores por sala; el
   undécimo verá «Sala llena».
3. **Menú:** todos aparecen en el menú principal y se ven. Cuando **todos** han pulsado **JUGAR**, entráis
   juntos al hub.
4. **Carrera:** en el hub, el primero que entra en un acto lo elige. Los demás, entren al acto que entren,
   van a ese mismo acto y esperan congelados en la salida. Cuando han llegado todos, empieza una cuenta
   atrás 3‑2‑1 y salís a la vez.
5. **Meta:** al llegar esperas con tu tiempo y ves correr a los demás: la cámara sigue a alguien que aún
   está corriendo y con **←/→** (o las flechas de la barra inferior) cambias de jugador. La carrera no
   termina hasta que acaban todos. Puedes abandonar cuando quieras (pausa → **Exit**, o volver al hub): vas al
   hub y quedas libre. Si entras en un acto mientras hay una carrera en curso, lo juegas por tu cuenta. Entonces se muestra la clasificación por
   tiempo y después el panel de nivel completado.

Cada jugador tiene un color y su nombre encima del personaje (**Cambiar nombre** en el panel, o `?name=Ana`
en la URL). Os veis en el menú, el hub y los actos; en la torre no, porque sus pisos son aleatorios en cada
partida. Si juegas solo en la sala, los actos funcionan como en el juego original.

Para jugar fuera de tu red local, el servidor tiene que estar en una máquina accesible desde Internet con
Node.js (por ejemplo un VPS o un servicio como Render o Fly.io). GitHub Pages no sirve, porque solo aloja
archivos estáticos. `?mp=0` juega sin conexión.

**Colisiones:** marca la casilla **«Colisiones (empujar)»** en el panel de la sala (vale para toda la
sala, cualquiera puede activarla o desactivarla). Con ella activada no os atravesáis: si corres contra
otro jugador lo vas **empujando** a tu velocidad mientras sigas avanzando. Además puedes **subirte encima**
de otro: aterrizas en su cabeza, puedes saltar desde ahí y te lleva consigo si camina. En la salida de una
carrera se ignoran durante 1,5 s para que no salgáis todos disparados. No compartís objetos ni muertes.

## Comandos

| Comando | Qué hace |
| --- | --- |
| `npm start` | Servidor multijugador (sirve el juego ya compilado) |
| `npm run build` | Genera `dist/vex7.js`, con source map que apunta a `src/` |
| `npm run build:release` | Lo mismo, pero minificado |
| `npm test` | Arranca el juego en Chromium sin ventana: menú, hub, caminar y saltar; falla si hay errores |
| `npm run test:mp` | 4 jugadores: menú, hub, carrera, modo espectador y resultados; un quinto rechazado (unos 10 minutos) |
| `npm run test:collisions` | 2 jugadores: atravesarse, activar colisiones, empujar, subirse encima y que te lleve (unos 2 minutos) |
| `npm run test:crowd` | Sala llena de 10: un navegador y 9 jugadores simulados en el hub (1 minuto) |
| `npm run test:server` | Tests de la sala y del servidor real con 10 clientes (segundos) |
| `npm run test:original` | El mismo test con el bundle original, para comparar |
| `npm run format` | Formatea el código con Prettier |

`index.html?build=original` carga el juego original sin modificar (`reference/vex7.min.js`), útil para
comparar comportamientos.

Para ejecutar `npm test` en tu equipo, instala antes el navegador con `npx playwright-core install chromium`,
o indica uno ya instalado con `CHROMIUM_PATH=/ruta/a/chrome`.

## Estructura

```
server/            servidor multijugador (archivos estáticos + WebSocket en /mp)
src/game/          código del juego (un archivo por módulo, CommonJS)
  multiplayer/     cliente multijugador: conexión, jugadores remotos, panel de sala
  main.js          clase Game (Phaser.Game)
  scenes/          Boot y World (World → WorldCreator → WorldLayers → BasicScene)
  entities/        Player, PlayerBase, Entity...
  input/           GameKeys: teclado y controles táctiles → player.keyPressed()
  objects/         blocks/, obstacles/, items/, wires/, tower/ (84 tipos de objeto de nivel)
  subscenes/       menú, hub, actos, torre, skins
  ui/              paneles, HUD, botones
  system/          guardado, logros, tareas diarias, sonido, skins
src/vendor/        librerías minificadas (Phaser, SpinePlugin, SAT.js, splash y anuncios de Azerion)
assets/            gráficos, sonidos, fuentes y datos (levels.json contiene todos los niveles)
reference/         el bundle original, intacto
tools/             build, test y la herramienta que separó el bundle
```

`CLAUDE.md` describe la arquitectura con detalle: bucle de juego, física, entrada, formato de niveles y
puntos de enganche para el multijugador.

## Origen

Código y assets copiados de [ubg98/vex7](https://github.com/ubg98/vex7), una copia del juego publicada por
una web de juegos. Vex 7 es obra de Amazing Adam y fue publicado por Azerion; este repositorio no concede
ningún derecho sobre él. Se eliminaron la analítica y los scripts de anuncios remotos que había añadido
esa web.
