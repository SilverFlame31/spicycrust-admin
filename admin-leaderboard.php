<!DOCTYPE html>
<html lang="es">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>
        SpicyCrust Admin - Leaderboard
    </title>

    <link
        rel="stylesheet"
        href="assets/css/style.css"
    >

</head>


<body>


<!-- ========================================
     ENCABEZADO
========================================= -->

<header class="admin-header">

    <div class="admin-brand">

        <div class="admin-brand-mark">
            🍕
        </div>


        <div>

            <h1>
                SpicyCrust
            </h1>

            <p>
                Admin Panel
            </p>

        </div>

    </div>


    <nav class="admin-nav">

        <a
            href="admin-leaderboard.php"
            class="active"
        >
            🍕 Leaderboard
        </a>

        <a href="admin-seasons.php">
            📅 Temporadas
        </a>

        <a href="admin-games.php">
            🎮 Juegos
        </a>

        <a href="event.php">
            🖥 Evento
        </a>

    </nav>

</header>


<main>


    <!-- ========================================
         TÍTULO
    ========================================= -->

    <section class="page-title-section">

        <div>

            <span class="eyebrow">
                SpicyCrust Tavern
            </span>

            <h2>
                Panel de Leaderboard
            </h2>

            <p>
                Revisa puntajes, jugadores y actividad del evento.
            </p>

        </div>

    </section>


    <!-- ========================================
         ESTADÍSTICAS
    ========================================= -->

    <section
        id="statsSection"
        class="stats-section"
    >

        <article class="stat-card">

            <div class="stat-icon">
                👥
            </div>

            <div>

                <h3>
                    Jugadores
                </h3>

                <p id="statPlayers">
                    ...
                </p>

                <small>
                    jugadores únicos
                </small>

            </div>

        </article>


        <article class="stat-card">

            <div class="stat-icon">
                🍕
            </div>

            <div>

                <h3>
                    Puntajes
                </h3>

                <p id="statScores">
                    ...
                </p>

                <small>
                    registros totales
                </small>

            </div>

        </article>


        <article class="stat-card">

            <div class="stat-icon">
                🏆
            </div>

            <div>

                <h3>
                    Mejor puntaje
                </h3>

                <p id="statHighestScore">
                    ...
                </p>

                <small>
                    récord actual
                </small>

            </div>

        </article>


        <article class="stat-card">

            <div class="stat-icon">
                🔥
            </div>

            <div>

                <h3>
                    Puntajes hoy
                </h3>

                <p id="statScoresToday">
                    ...
                </p>

                <small>
                    actividad del día
                </small>

            </div>

        </article>

    </section>


    <!-- ========================================
         FILTROS
    ========================================= -->

    <section class="filters-section">

        <div class="filter-item">

            <label for="adminViewFilter">
                Vista
            </label>

            <select id="adminViewFilter">

                <option
                    value="leaderboard"
                    selected
                >
                    Leaderboard
                </option>

                <option value="players">
                    Lista de jugadores
                </option>

            </select>

        </div>


        <div class="filter-item">

            <label for="gameFilter">
                Juego
            </label>

            <select id="gameFilter">

                <option value="">
                    Cargando juegos...
                </option>

            </select>

        </div>


        <div class="filter-item">

            <label for="seasonFilter">
                Temporada
            </label>

            <select id="seasonFilter">

                <option value="">
                    Cargando temporadas...
                </option>

            </select>

        </div>


        <div class="filter-item">

            <label for="leaderboardLimit">
                Cantidad
            </label>

            <select id="leaderboardLimit">

                <option value="10">
                    Top 10
                </option>

                <option
                    value="20"
                    selected
                >
                    Top 20
                </option>

                <option value="50">
                    Top 50
                </option>

                <option value="100">
                    Top 100
                </option>

            </select>

        </div>


        <div class="filter-item filter-search">

            <label for="playerSearch">
                Buscar
            </label>

            <input
                type="search"
                id="playerSearch"
                placeholder="Buscar por nickname..."
                autocomplete="off"
            >

        </div>

    </section>


    <!-- ========================================
         TOOLBAR DE JUGADORES
    ========================================= -->

    <section
        id="playersToolbar"
        class="players-toolbar"
        hidden
    >

        <div>

            <span class="toolbar-label">
                Jugadores encontrados
            </span>

            <strong id="playersCount">
                0 jugadores
            </strong>

        </div>


        <button
            type="button"
            id="exportPlayersCsvButton"
            disabled
        >
            📧 Exportar emails a CSV
        </button>

    </section>


    <!-- ========================================
         DASHBOARD
    ========================================= -->

    <div class="leaderboard-dashboard">


        <!-- ====================================
             COLUMNA IZQUIERDA
             LEADERBOARD / LISTA
        ===================================== -->

        <section class="leaderboard-section">

            <div class="section-heading">

                <div>

                    <span class="section-kicker">
                        Nuestro Top
                    </span>

                    <h3 id="tableTitle">
                        Leaderboard
                    </h3>

                </div>


                <div
                    class="fresh-stamp"
                    aria-hidden="true"
                >
                    HOT<br>
                    &amp;<br>
                    FRESH
                </div>

            </div>


            <div class="table-container">

                <table>

                    <thead>

                        <tr id="leaderboardHeaderRow">

                            <th>
                                Posición
                            </th>

                            <th>
                                Jugador
                            </th>

                            <th>
                                Puntaje
                            </th>

                            <th>
                                Acciones
                            </th>

                        </tr>

                    </thead>


                    <tbody id="leaderboardBody">

                        <tr>

                            <td colspan="4">
                                Cargando leaderboard...
                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>

        </section>


        <!-- ====================================
             COLUMNA DERECHA
        ===================================== -->

        <div class="leaderboard-side-column">


            <!-- =================================
                 DETALLES DEL JUGADOR
            ================================== -->

            <section
                id="playerDetails"
                class="player-details-panel"
                hidden
            >

                <div class="player-details-header">

                    <div>

                        <span class="section-kicker">
                            Perfil
                        </span>

                        <h3>
                            Detalles del jugador
                        </h3>

                    </div>


                    <button
                        type="button"
                        id="closePlayerDetails"
                        class="close-details-button"
                        aria-label="Cerrar detalles"
                    >
                        ×
                    </button>

                </div>


                <!-- =================================
                     PERFIL
                ================================== -->

                <div class="player-profile">

                    <div class="player-avatar">
                        🍕
                    </div>


                    <div>

                        <span class="player-label">
                            Jugador
                        </span>

                        <h4 id="detailNickname">
                            -
                        </h4>

                    </div>

                </div>


                <!-- =================================
                     INFORMACIÓN
                ================================== -->

                <div class="player-info-list">

                    <div class="player-info-row">

                        <span class="player-info-icon">
                            ✉
                        </span>

                        <div>

                            <span class="player-info-label">
                                Email
                            </span>

                            <strong id="detailEmail">
                                -
                            </strong>

                        </div>

                    </div>


                    <div class="player-info-row">

                        <span class="player-info-icon">
                            🏆
                        </span>

                        <div>

                            <span class="player-info-label">
                                Mejor puntaje
                            </span>

                            <strong id="detailBestScore">
                                -
                            </strong>

                        </div>

                    </div>

                </div>


                <!-- =================================
                     HISTORIAL
                ================================== -->

                <div class="score-history">

                    <div class="history-heading">

                        <span>
                            🍕
                        </span>

                        <h4>
                            Historial de puntajes
                        </h4>

                        <span>
                            🍕
                        </span>

                    </div>


                    <div class="table-container">

                        <table>

                            <thead>

                                <tr>

                                    <th>
                                        Puntaje
                                    </th>

                                    <th>
                                        Juego
                                    </th>

                                    <th>
                                        Temporada
                                    </th>

                                    <th>
                                        Fecha
                                    </th>

                                    <th>
                                        Acciones
                                    </th>

                                </tr>

                            </thead>


                            <tbody id="scoreHistoryBody">

                                <tr>

                                    <td colspan="5">
                                        Selecciona un jugador.
                                    </td>

                                </tr>

                            </tbody>

                        </table>

                    </div>

                </div>

            </section>


            <!-- =================================
                 PLACEHOLDER SIN JUGADOR
            ================================== -->

            <section
                id="playerDetailsPlaceholder"
                class="player-details-placeholder"
            >

                <div class="placeholder-pizza">
                    🍕
                </div>

                <h3>
                    Detalles del jugador
                </h3>

                <p>
                    Presiona
                    <strong>Ver</strong>
                    junto a un jugador para revisar su información
                    e historial de puntajes.
                </p>

            </section>


            <!-- =================================
                 MASCOTA
            ================================== -->

            <div
                class="leaderboard-decoration-area"
                aria-hidden="true"
            >

                <div class="page-mascot mascot-leaderboard">

                    <img
                        src="assets/images/mascot.png"
                        alt=""
                    >

                </div>

            </div>


        </div>


    </div>


</main>


<footer class="admin-footer">

    <span>
        🍕 SpicyCrust Admin Panel
    </span>

    <span>
        Hot scores. Fresh pizza.
    </span>

</footer>


<script src="assets/js/app.js"></script>


</body>

</html>