# Guía del Proyecto --- SpicyCrust

## 1. ¿Qué es este proyecto?

SpicyCrust es un sistema para recibir, guardar y mostrar puntajes de los
juegos del proyecto.

Actualmente el sistema incluye:

-   Una **API V2** que se comunica con la base de datos.
-   Un **panel de administración** para gestionar juegos, temporadas,
    jugadores y puntajes.
-   Un **leaderboard** para consultar los mejores puntajes.
-   Una vista de **Event Mode** para mostrar rankings durante eventos.
-   Una base de datos **MariaDB/MySQL** donde se guardan juegos,
    temporadas, jugadores y puntajes.

La idea principal es que el panel de administración y los juegos no
trabajen directamente con la base de datos. Toda la comunicación con los
datos debe pasar por la API.

## 2. Arquitectura general

``` text
Juegos / Panel Admin / Event Mode
              |
              v
        SpicyCrust API V2
              |
              v
        MariaDB / MySQL
```

En el panel de administración se utilizan archivos PHP intermedios
("bridge"):

``` text
Frontend del Admin
       |
       v
spicycrust-admin/api/*.php
       |
       v
SpicyCrust API V2
       |
       v
Base de datos
```

Esto permite que el frontend mantenga una estructura simple y evita que
el panel consulte directamente la base de datos.

## 3. Carpetas principales

### `spicycrust-api-v2`

Contiene la API principal del sistema.

Elementos importantes:

-   `public/index.php` --- rutas y lógica principal de la API.
-   `public/router.php` --- permite ejecutar la API con el servidor
    integrado de PHP durante desarrollo local.
-   `config/config.php` --- configuración general de la API y base de
    datos.
-   `config/database.php` --- crea la conexión PDO con MariaDB/MySQL.

### `spicycrust-admin`

Contiene el panel de administración y la vista para eventos.

Elementos importantes:

-   `admin-leaderboard.php` --- administración/consulta del leaderboard.
-   `admin-games.php` --- gestión de juegos.
-   `admin-seasons.php` --- gestión de temporadas.
-   `event.php` --- leaderboard para eventos.
-   `api/` --- archivos PHP que conectan el panel con API V2.
-   `assets/js/` --- lógica JavaScript del panel.
-   `assets/css/style.css` --- estilos visuales.
-   `config/api.php` --- configuración compartida de la dirección de API
    y credenciales del panel.
-   `config/api-client.php` --- funciones compartidas para realizar
    solicitudes hacia API V2.

## 4. Cómo cambiar la API utilizada por el panel

El panel no tiene la URL de API escrita individualmente en cada
endpoint.

La configuración se encuentra centralizada en:

``` text
spicycrust-admin/config/api.php
```

Durante desarrollo local, la API puede apuntar a:

``` text
http://localhost:8080/api/v1
```

Cuando la API sea desplegada en un servidor, solo se debe cambiar la URL
base en este archivo por la dirección real.

Por ejemplo:

``` text
https://api.ejemplo.cl/api/v1
```

También se debe configurar allí la clave administrativa correspondiente
si cambia.

**No es necesario modificar `games.php`, `seasons.php`,
`leaderboard.php`, etc. solamente porque cambie la dirección del
servidor.**

## 5. Ejecutar API V2 localmente

Desde PowerShell o una terminal:

``` powershell
cd C:\xampp\htdocs\spicycrust-api-v2
php -S localhost:8080 -t public public/router.php
```

Luego se puede comprobar el estado de la API usando:

``` text
http://localhost:8080/api/v1/health
```

Una respuesta correcta debe indicar que la API y la conexión con la base
de datos están funcionando.

## 6. Endpoints principales

API V2 utiliza rutas bajo:

``` text
/api/v1
```

Entre los endpoints principales están:

``` text
GET    /health
GET    /games
POST   /games
PATCH  /games/{id}
DELETE /games/{id}

GET    /seasons
POST   /seasons
PATCH  /seasons/{id}
DELETE /seasons/{id}

POST   /scores
DELETE /scores/{id}

GET    /leaderboard
GET    /players
GET    /players/{id}
GET    /stats
```

## 7. Juegos y API Keys

Cada juego puede tener una API Key para enviar puntajes.

Al crear un juego:

1.  API V2 genera una clave aleatoria.
2.  La clave original se entrega una sola vez.
3.  La base de datos guarda solamente un hash de la clave.
4.  El juego utiliza la clave original al enviar puntajes.

Las solicitudes de puntaje utilizan el header:

``` text
X-Game-Key
```

Una API Key perdida no debe recuperarse desde el hash. Se debe
generar/establecer una nueva.

Las claves utilizadas durante desarrollo deben reemplazarse antes de
producción.

## 8. Acciones administrativas

Las operaciones administrativas de API V2 requieren una clave
administrativa mediante:

``` text
X-Admin-Key
```

El panel guarda esta configuración de forma centralizada para que los
archivos del frontend no necesiten conocer la clave.

Para producción se recomienda almacenar las credenciales mediante
variables de entorno en lugar de mantener secretos directamente en
archivos del proyecto.

## 9. Base de datos

La base de datos utilizada actualmente es:

``` text
spicycrust_game_api
```

Las tablas principales son:

-   `games` --- información de cada juego.
-   `players` --- jugadores registrados o identificados.
-   `seasons` --- temporadas/eventos de ranking.
-   `scores` --- puntajes enviados por los juegos.

El panel de administración no debería consultar estas tablas
directamente. API V2 es responsable de leer y modificar los datos.

## 10. Flujo de un puntaje

Ejemplo simplificado:

``` text
Jugador termina partida
        |
        v
Juego envía POST /scores
        |
        v
API valida X-Game-Key
        |
        v
API identifica juego, temporada y jugador
        |
        v
Puntaje guardado en MariaDB
        |
        v
GET /leaderboard puede mostrar el nuevo resultado
```

## 11. Leaderboard

El leaderboard puede filtrar por juego y temporada.

También permite limitar la cantidad de resultados y buscar jugadores.

El ranking utiliza el mejor puntaje de cada jugador para el juego y
temporada seleccionados.

## 12. Protección al eliminar datos

Los juegos y temporadas con historial de puntajes no deben eliminarse
libremente.

Si existe información histórica asociada, la API puede rechazar la
eliminación. En estos casos se recomienda desactivar/completar el
elemento en lugar de eliminarlo.

Esto ayuda a evitar la pérdida accidental de resultados existentes.

## 13. Desarrollo local vs. producción

En desarrollo:

``` text
Admin -> localhost:8080 -> MariaDB local
```

En producción:

``` text
Admin -> URL pública de API -> Base de datos del servidor
```

El código de los endpoints puede mantenerse igual. Principalmente
cambian la configuración, credenciales y entorno del servidor.

Antes de producción se recomienda:

-   Utilizar HTTPS.
-   Cambiar las claves de prueba.
-   Guardar secretos en variables de entorno.
-   Restringir CORS.
-   No mostrar errores internos de base de datos al usuario.
-   Implementar autenticación administrativa adecuada.
-   Añadir rate limiting.
-   Añadir validaciones/medidas anti-cheat para los puntajes.

## 14. Resumen rápido para otro desarrollador

Si necesitas trabajar en este proyecto:

1.  Inicia MariaDB/MySQL.
2.  Inicia `spicycrust-api-v2`.
3.  Comprueba `/api/v1/health`.
4.  Abre `spicycrust-admin` mediante Apache/XAMPP.
5.  Si cambia el servidor de API, modifica
    `spicycrust-admin/config/api.php`.
6.  No conectes nuevas funciones del panel directamente a MariaDB;
    agrega o utiliza un endpoint de API V2.
7.  Para nuevas funciones, mantén el flujo **Frontend -\> bridge del
    Admin -\> API V2 -\> Base de datos**.

------------------------------------------------------------------------

Este documento describe la arquitectura actual del proyecto y está
pensado como una guía rápida de mantenimiento y despliegue.
