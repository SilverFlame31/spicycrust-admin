<!DOCTYPE html>
<html lang="es">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>
        SpicyCrust Admin - Temporadas
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

        <a href="admin-leaderboard.php">
            🍕 Leaderboard
        </a>

        <a
            href="admin-seasons.php"
            class="active"
        >
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
                Administración de Temporadas
            </h2>

            <p>
                Crea temporadas y controla cuáles se encuentran activas.
            </p>

        </div>

    </section>


    <!-- ========================================
         DASHBOARD DE TEMPORADAS
    ========================================= -->

    <div class="seasons-dashboard">


        <!-- ====================================
             CREAR TEMPORADA
        ===================================== -->

        <section class="season-create-panel">

            <div class="section-heading">

                <div>

                    <span class="section-kicker">
                        Nuevo evento
                    </span>

                    <h3>
                        Crear temporada
                    </h3>

                </div>


                <div
                    class="fresh-stamp"
                    aria-hidden="true"
                >
                    NEW<br>
                    SEASON
                </div>

            </div>


            <p class="panel-description">
                Define un nuevo período competitivo para los
                leaderboards de SpicyCrust.
            </p>


            <form id="seasonForm">


                <!-- NOMBRE -->

                <label for="seasonName">

                    Nombre

                    <input
                        type="text"
                        id="seasonName"
                        placeholder="Ej: Temporada Primavera"
                        required
                    >

                </label>


                <!-- IDENTIFICADOR -->

                <label for="seasonSlug">

                    Identificador

                    <input
                        type="text"
                        id="seasonSlug"
                        placeholder="primavera-2026"
                        required
                    >

                    <small class="field-help">
                        Identificador interno único de la temporada.
                    </small>

                </label>


                <!-- FECHA DE INICIO -->

                <label for="seasonStartsAt">

                    Fecha de inicio

                    <input
                        type="datetime-local"
                        id="seasonStartsAt"
                        required
                    >

                </label>


                <!-- FECHA DE TÉRMINO -->

                <label for="seasonEndsAt">

                    Fecha de término

                    <input
                        type="datetime-local"
                        id="seasonEndsAt"
                        required
                    >

                </label>


                <!-- ESTADO -->

                <label for="seasonStatus">

                    Estado inicial

                    <select id="seasonStatus">

                        <option
                            value="active"
                            selected
                        >
                            Activa
                        </option>

                        <option value="completed">
                            Completada
                        </option>

                    </select>

                </label>


                <div class="form-submit-area">

                    <button
                        type="submit"
                        id="createSeasonButton"
                    >
                        📅 Crear temporada
                    </button>

                </div>

            </form>


            <!-- MENSAJE DEL FORMULARIO -->

            <div
                id="seasonFormMessage"
                class="admin-message"
                aria-live="polite"
            ></div>

        </section>


        <!-- ====================================
             INFORMACIÓN DEL CICLO
        ===================================== -->

        <section class="season-info-panel">

            <div class="season-info-icon">
                🏆
            </div>


            <div>

                <span class="section-kicker">
                    ¿Cómo funciona?
                </span>

                <h3>
                    Ciclo de temporada
                </h3>


                <div class="season-flow">


                    <div class="season-flow-step">

                        <strong>
                            1
                        </strong>

                        <span>
                            Crear
                        </span>

                    </div>


                    <div class="season-flow-arrow">
                        →
                    </div>


                    <div class="season-flow-step">

                        <strong>
                            2
                        </strong>

                        <span>
                            Activar
                        </span>

                    </div>


                    <div class="season-flow-arrow">
                        →
                    </div>


                    <div class="season-flow-step">

                        <strong>
                            3
                        </strong>

                        <span>
                            Competir
                        </span>

                    </div>


                    <div class="season-flow-arrow">
                        →
                    </div>


                    <div class="season-flow-step">

                        <strong>
                            4
                        </strong>

                        <span>
                            Completar
                        </span>

                    </div>


                </div>


                <p>
                    Al completar una temporada, sus puntajes
                    permanecen disponibles como historial.
                </p>

            </div>

        </section>


        <!-- ====================================
             LISTA DE TEMPORADAS
        ===================================== -->

        <section class="seasons-list-panel">

            <div class="section-heading">

                <div>

                    <span class="section-kicker">
                        Historial competitivo
                    </span>

                    <h3>
                        Temporadas
                    </h3>

                </div>


                <div
                    class="fresh-stamp"
                    aria-hidden="true"
                >
                    PIZZA<br>
                    CUP
                </div>

            </div>


            <p class="panel-description">
                Administra temporadas activas y revisa períodos
                competitivos anteriores.
            </p>


            <div
                id="seasonTableMessage"
                class="admin-message"
                aria-live="polite"
            ></div>


            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>
                                Temporada
                            </th>

                            <th>
                                Identificador
                            </th>

                            <th>
                                Inicio
                            </th>

                            <th>
                                Término
                            </th>

                            <th>
                                Estado
                            </th>

                            <th>
                                Acciones
                            </th>

                        </tr>

                    </thead>


                    <tbody id="seasonTableBody">

                        <tr>

                            <td colspan="6">
                                Cargando temporadas...
                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>


            <!-- =================================
                 NOTA DE SEGURIDAD
            ================================== -->

            <div class="menu-note">

                <span>
                    📅
                </span>

                <p>
                    Una temporada con puntajes registrados no
                    debe eliminarse. Márcala como
                    <strong>Completada</strong>
                    para conservar el historial del leaderboard.
                </p>

            </div>

        </section>


    </div>


    <!-- ========================================
         DECORACIÓN DE TEMPORADAS
    ========================================= -->

    <div
        class="seasons-decoration-area"
        aria-hidden="true"
    >


        <!-- MASCOTA -->

        <div class="page-mascot mascot-seasons">

            <img
                src="assets/images/mascot.png"
                alt=""
            >

        </div>


        <!-- CARTEL PIZZA CUP -->

        <aside class="season-chalkboard">

            <div class="season-chalkboard-pin"></div>


            <span class="season-chalkboard-kicker">
                SpicyCrust Tavern
            </span>


            <h3>
                PIZZA CUP
            </h3>


            <div class="season-chalkboard-divider"></div>


            <p>
                COMPETE
            </p>

            <p>
                SLICE
            </p>

            <p>
                REPEAT
            </p>


            <div class="season-chalkboard-stars">
                ★ ★ ★
            </div>

        </aside>


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


<script src="assets/js/seasons-admin.js"></script>


</body>

</html>