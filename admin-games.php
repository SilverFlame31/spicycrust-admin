<!DOCTYPE html>
<html lang="es">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>
        SpicyCrust Admin - Juegos
    </title>

    <link
        rel="stylesheet"
        href="assets/css/style.css"
    >

</head>


<body>


<!-- ========================================
     HEADER
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

        <a href="admin-seasons.php">
            📅 Temporadas
        </a>

        <a
            href="admin-games.php"
            class="active"
        >
            🎮 Juegos
        </a>

        <a href="event.php">
            🖥 Evento
        </a>

    </nav>

</header>


<main>


    <!-- ========================================
         PAGE TITLE
    ========================================= -->

  <section class="page-title-section games-page-title">

    <div class="games-title-copy">

        <span class="eyebrow">
            SpicyCrust Tavern
        </span>

        <h2>
            Administración de Juegos
        </h2>

        <p>
            Agrega juegos y controla cuáles están disponibles.
        </p>

    </div>


    <div
        class="page-mascot mascot-games"
        aria-hidden="true"
    >

        <img
            src="assets/images/mascot.png"
            alt=""
        >

    </div>

</section>


    <!-- ========================================
         MAIN GAME LAYOUT
    ========================================= -->

    <div class="games-dashboard">


        <!-- ====================================
             CREATE GAME
        ===================================== -->

        <section class="game-create-panel">

            <div class="section-heading">

                <div>

                    <span class="section-kicker">
                        Nueva receta
                    </span>

                    <h3>
                        Agregar juego
                    </h3>

                </div>

                <div
                    class="fresh-stamp"
                    aria-hidden="true"
                >
                    NEW<br>
                    GAME
                </div>

            </div>


            <p class="panel-description">
                Registra un nuevo juego dentro del ecosistema
                SpicyCrust.
            </p>


            <form id="gameForm">


                <!-- NOMBRE -->

                <label for="gameName">

                    Nombre del juego

                    <input
                        type="text"
                        id="gameName"
                        placeholder="Ej: Rhythm Slice"
                        required
                    >

                </label>


                <!-- IDENTIFICADOR -->

                <label for="gameSlug">

                    Identificador

                    <input
                        type="text"
                        id="gameSlug"
                        placeholder="rhythm-slice"
                        required
                    >

                    <small class="field-help">
                        Se utiliza internamente para identificar
                        el juego.
                    </small>

                </label>


                <!-- DESCRIPCIÓN -->

                <label
                    for="gameDescription"
                    class="full-field"
                >

                    Descripción

                    <textarea
                        id="gameDescription"
                        placeholder="Descripción breve del juego..."
                    ></textarea>

                </label>


                <!-- ESTADO -->

                <label for="gameStatus">

                    Estado inicial

                    <select id="gameStatus">

                        <option
                            value="active"
                            selected
                        >
                            Activo
                        </option>

                        <option value="inactive">
                            Inactivo
                        </option>

                    </select>

                </label>


                <div class="form-submit-area">

                    <button type="submit">
                        🍕 Crear juego
                    </button>

                </div>


            </form>


            <!-- =================================
                 FORM FEEDBACK
            ================================== -->

            <div
                id="gameFormMessage"
                class="admin-message"
                aria-live="polite"
            ></div>


        </section>


        <!-- ====================================
             API KEY
        ===================================== -->

        <section
            id="apiKeyResult"
            class="api-key-panel"
            hidden
        >

            <div class="api-key-icon">
                🔑
            </div>


            <div class="api-key-content">

                <span class="section-kicker">
                    Credencial generada
                </span>

                <h3>
                    API Key
                </h3>


                <p>
                    Se generó una API Key para
                    <strong id="apiKeyGameName">
                        -
                    </strong>.
                </p>


                <div class="api-key-warning">

                    ⚠ Guarda esta clave ahora.

                    <strong>
                        No se volverá a mostrar.
                    </strong>

                </div>


                <label for="generatedApiKey">

                    API Key

                    <input
                        type="text"
                        id="generatedApiKey"
                        readonly
                    >

                </label>


                <button
                    type="button"
                    id="copyApiKeyButton"
                    class="secondary-button"
                >
                    📋 Copiar API Key
                </button>

            </div>

        </section>


        <!-- ====================================
             EXISTING GAMES
        ===================================== -->

        <section class="games-list-panel">

            <div class="section-heading">

                <div>

                    <span class="section-kicker">
                        Nuestro menú
                    </span>

                    <h3>
                        Juegos existentes
                    </h3>

                </div>


                <div
                    class="fresh-stamp"
                    aria-hidden="true"
                >
                    HOT<br>
                    &amp;<br>
                    READY
                </div>

            </div>


            <p class="panel-description">
                Los juegos desactivados conservan sus puntajes
                e historial.
            </p>


            <div class="table-container">

                <table>

                    <thead>

                        <tr>

                            <th>
                                Juego
                            </th>

                            <th>
                                Identificador
                            </th>

                            <th>
                                Descripción
                            </th>

                            <th>
                                Estado
                            </th>

                            <th>
                                Puntajes
                            </th>

                            <th>
                                Acciones
                            </th>

                        </tr>

                    </thead>


                    <tbody id="gameTableBody">

                        <tr>

                            <td colspan="6">
                                Cargando juegos...
                            </td>

                        </tr>

                    </tbody>

                </table>

            </div>


            <div class="menu-note">

                <span>
                    🍕
                </span>

                <p>
                    Un juego con puntajes registrados no puede
                    eliminarse. Desactívalo para retirarlo del
                    evento sin perder su historial.
                </p>

            </div>

        </section>


    </div>
<div class="page-mascot mascot-games" aria-hidden="true">
    <img src="assets/images/mascot.png" alt="">
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


<script src="assets/js/games-admin.js"></script>


<!-- ========================================
     SMALL PAGE-SPECIFIC BEHAVIOR

     Existing games-admin.js still handles
     all CRUD functionality.

     This only handles copying the generated
     API key.
========================================= -->

<script>

    const copyApiKeyButton =
        document.getElementById(
            'copyApiKeyButton'
        );

    const generatedApiKey =
        document.getElementById(
            'generatedApiKey'
        );


    copyApiKeyButton.addEventListener(
        'click',
        async () => {

            const apiKey =
                generatedApiKey.value;


            if (!apiKey) {

                return;
            }


            try {

                await navigator.clipboard.writeText(
                    apiKey
                );


                const originalText =
                    copyApiKeyButton.textContent;


                copyApiKeyButton.textContent =
                    '✓ Copiada';


                setTimeout(
                    () => {

                        copyApiKeyButton.textContent =
                            originalText;

                    },
                    1500
                );

            } catch (error) {

                generatedApiKey.select();

                document.execCommand(
                    'copy'
                );


                copyApiKeyButton.textContent =
                    '✓ Copiada';


                setTimeout(
                    () => {

                        copyApiKeyButton.textContent =
                            '📋 Copiar API Key';

                    },
                    1500
                );
            }
        }
    );

</script>


</body>

</html>