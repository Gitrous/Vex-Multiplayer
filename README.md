# Vex Multiplayer

Base para una versión multijugador de **Vex 7**, el juego de plataformas HTML5 hecho con Phaser 3.

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

| Comando | Qué hace |
| --- | --- |
| `npm run build` | Genera `dist/vex7.js`, con source map que apunta a `src/` |
| `npm run build:release` | Lo mismo, pero minificado |
| `npm test` | Arranca el juego en Chromium sin ventana: menú, hub, caminar y saltar; falla si hay errores |
| `npm run test:original` | El mismo test con el bundle original, para comparar |
| `npm run format` | Formatea el código con Prettier |

`index.html?build=original` carga el juego original sin modificar (`reference/vex7.min.js`), útil para
comparar comportamientos.

Para ejecutar `npm test` en tu equipo, instala antes el navegador con `npx playwright-core install chromium`,
o indica uno ya instalado con `CHROMIUM_PATH=/ruta/a/chrome`.

## Estructura

```
src/game/          código del juego (un archivo por módulo, CommonJS)
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
