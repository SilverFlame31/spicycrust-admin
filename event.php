<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SpicyCrust - Leaderboard</title>
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body class="event-body">

<main class="event-page" id="eventPage">

    <!-- ========================================
         CARTEL DEL EVENTO SPICYCRUST
    ========================================= -->
    <header class="event-header">
        <div class="event-sign-flags" aria-hidden="true">
            <span></span>
            <span></span>
        </div>

        <div class="event-brand">
            <div class="event-brand-icon">🍕</div>

            <div class="event-brand-copy">
                <span class="event-kicker">SpicyCrust Tavern</span>
                <h1>SpicyCrust</h1>
                <p>Hot scores. Fresh pizza.</p>
            </div>
        </div>

        <div class="event-header-badge">
            <span>★</span>
            EVENT MODE
            <span>★</span>
        </div>
    </header>


    <!-- ========================================
         CONTROLES NORMALES
    ========================================= -->
    <div class="event-controls" id="eventControls">

        <div class="event-control-heading">
            <span class="event-control-icon">🍕</span>
            <div>
                <strong>Configurar tablero</strong>
                <small>Selecciona qué leaderboard mostrar.</small>
            </div>
        </div>

        <label>
            Juego
            <select id="eventGameFilter">
                <option value="">Cargando juegos...</option>
            </select>
        </label>

        <label>
            Temporada
            <select id="eventSeasonFilter">
                <option value="">Cargando temporadas...</option>
            </select>
        </label>

        <label>
            Cantidad
            <select id="eventLeaderboardLimit">
                <option value="10" selected>Top 10</option>
                <option value="20">Top 20</option>
                <option value="50">Top 50</option>
                <option value="100">Top 100</option>
            </select>
        </label>

        <label>
            Buscar jugador
            <input
                type="text"
                id="eventPlayerSearch"
                placeholder="Buscar nickname..."
                autocomplete="off"
            >
        </label>

        <div class="event-control-actions">
            <button
                type="button"
                id="fullscreenButton"
                class="event-secondary-button"
            >
                ⛶ Pantalla completa
            </button>

            <button
                type="button"
                id="eventModeButton"
                class="event-mode-button"
            >
                🏆 Iniciar modo evento
            </button>
        </div>

    </div>


    <!-- ========================================
         ESCENARIO PÚBLICO DEL EVENTO
    ========================================= -->
    <div class="event-stage">

        <div class="event-ambient event-ambient-left" aria-hidden="true">
            <span>SLICE!</span>
            <span>SLICE!</span>
            <span>SLICE!</span>
        </div>

        <div class="event-ambient event-ambient-right" aria-hidden="true">
            <small>HOT &amp;</small>
            <strong>FRESH</strong>
            <b>🍕 PIZZA</b>
        </div>

        <div class="event-board">

            <div class="event-board-top">
                <div class="event-board-label">
                    <span>🍕</span>
                    LIVE LEADERBOARD
                </div>

                <div class="event-live-indicator">
                    <span></span>
                    LIVE
                </div>
            </div>


            <!-- MARQUESINA DEL JUEGO -->
            <div class="event-info">
                <span class="event-info-eyebrow">NOW SERVING</span>

                <div class="event-game-marquee">
                    <span class="event-note" aria-hidden="true">♪</span>
                    <h2 id="eventGameTitle">Juego</h2>
                    <span class="event-note" aria-hidden="true">♫</span>
                </div>

                <div class="event-season-ribbon">
                    <p id="eventSeasonTitle">Temporada</p>
                </div>
            </div>


            <!-- ESTADO DEL MODO EVENTO -->
            <div
    id="eventModeStatus"
    hidden
    style="display: none !important;"
>
    <p
        id="eventRotationStatus"
        style="display: none !important;"
    >
        Preparando rotación...
    </p>
</div>

            <!-- TABLA DE POSICIONES -->
            <div class="event-leaderboard">

                <div class="event-menu-title">
                    <span>RANKING DE JUGADORES</span>
                    <div class="event-menu-stamp">HOT<br>&amp;<br>FRESH</div>
                </div>

                <div class="event-table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Pos.</th>
                                <th>Jugador</th>
                                <th>Puntaje</th>
                            </tr>
                        </thead>

                        <tbody id="eventLeaderboardBody">
                            <tr>
                                <td colspan="3">Cargando leaderboard...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>


            <!-- MASCOTA -->
            <div class="page-mascot mascot-event" aria-hidden="true">
                <img src="assets/images/mascot.png" alt="">
            </div>


            <!-- PIZARRA DECORATIVA -->
            <div class="event-score-sign" aria-hidden="true">
                <span>FRESH</span>
                <strong>PIZZA</strong>
                <em>GREAT</em>
                <b>SCORES!</b>
            </div>


            <!-- SALIDA DEL MODO EVENTO -->
            <div
                id="eventModeExitContainer"
                class="event-mode-exit"
                hidden
            >
                <button type="button" id="exitEventModeButton">
                    ✕ Salir del modo evento
                </button>
            </div>


            <!-- PIE DEL TABLERO -->
            <footer class="event-footer">
                <div>
                    <span class="event-footer-icon">🔥</span>
                    <span>HOT SCORES</span>
                </div>

                <p id="lastUpdated">Cargando...</p>

                <div>
                    <span>FRESH PIZZA</span>
                    <span class="event-footer-icon">🍕</span>
                </div>
            </footer>

        </div>

    </div>

</main>

<script src="assets/js/event.js"></script>
</body>
</html>
