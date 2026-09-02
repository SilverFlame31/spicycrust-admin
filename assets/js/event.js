// ========================================
// ELEMENTOS DEL DOM
// ========================================

const eventPage =
    document.getElementById(
        'eventPage'
    );

const eventControls =
    document.getElementById(
        'eventControls'
    );

const eventLeaderboardBody =
    document.getElementById(
        'eventLeaderboardBody'
    );

const eventGameFilter =
    document.getElementById(
        'eventGameFilter'
    );

const eventSeasonFilter =
    document.getElementById(
        'eventSeasonFilter'
    );

const eventLeaderboardLimit =
    document.getElementById(
        'eventLeaderboardLimit'
    );

const eventPlayerSearch =
    document.getElementById(
        'eventPlayerSearch'
    );

const eventGameTitle =
    document.getElementById(
        'eventGameTitle'
    );

const eventSeasonTitle =
    document.getElementById(
        'eventSeasonTitle'
    );

const fullscreenButton =
    document.getElementById(
        'fullscreenButton'
    );

const eventModeButton =
    document.getElementById(
        'eventModeButton'
    );

const exitEventModeButton =
    document.getElementById(
        'exitEventModeButton'
    );

const eventModeExitContainer =
    document.getElementById(
        'eventModeExitContainer'
    );

const eventModeStatus =
    document.getElementById(
        'eventModeStatus'
    );

const eventRotationStatus =
    document.getElementById(
        'eventRotationStatus'
    );

const lastUpdated =
    document.getElementById(
        'lastUpdated'
    );


// ========================================
// CONFIGURACIÓN
// ========================================

const EVENT_ROTATION_TIME =
    15000;

const NORMAL_REFRESH_TIME =
    10000;


// ========================================
// VARIABLES
// ========================================

let searchTimeout =
    null;

let autoRefreshInterval =
    null;

let eventRotationInterval =
    null;

let hasSuccessfulLeaderboard =
    false;

let eventModeActive =
    false;

let eventRotationItems =
    [];

let currentRotationIndex =
    0;

let activeGames =
    [];

let activeSeasons =
    [];


let leaderboardAbortController =
    null;

let eventModeAbortController =
    null;


// ========================================
// CONTROLES
// ========================================

function setEventControlsDisabled(
    disabled
) {

    eventGameFilter.disabled =
        disabled;

    eventSeasonFilter.disabled =
        disabled;

    eventLeaderboardLimit.disabled =
        disabled;

    eventPlayerSearch.disabled =
        disabled;
}


// ========================================
// OBTENER JSON
// ========================================

async function fetchJson(
    url,
    options = {}
) {

    const response =
        await fetch(
            url,
            options
        );


    if (!response.ok) {

        let message =
            `HTTP ${response.status}`;


        try {

            const errorData =
                await response.json();


            if (
                errorData.message
            ) {

                message =
                    errorData.message;
            }

        } catch (error) {

            // Respuesta no JSON.
        }


        throw new Error(
            message
        );
    }


    const data =
        await response.json();


    if (!data.success) {

        throw new Error(
            data.message ||
            'Respuesta inválida.'
        );
    }


    return data;
}


// ========================================
// JUEGOS ACTIVOS
// ========================================

async function loadEventGames() {

    eventGameFilter.disabled =
        true;


    eventGameFilter.innerHTML = `
        <option value="">
            Cargando juegos...
        </option>
    `;


    try {

        const data =
            await fetchJson(
                'api/games.php?status=active'
            );


        activeGames =
            data.games;


        eventGameFilter.innerHTML =
            '';


        activeGames.forEach(
            (game) => {

                const option =
                    document.createElement(
                        'option'
                    );


                option.value =
                    game.slug;

                option.textContent =
                    game.name;


                eventGameFilter.appendChild(
                    option
                );
            }
        );


        if (
            activeGames.length === 0
        ) {

            eventGameFilter.innerHTML = `
                <option value="">
                    No hay juegos activos
                </option>
            `;
        }


        eventGameFilter.disabled =
            activeGames.length === 0;


        updateEventTitles();


        return true;

    } catch (error) {

        console.error(
            'Error al cargar juegos:',
            error
        );


        activeGames =
            [];


        eventGameFilter.innerHTML = `
            <option value="">
                Error al cargar juegos
            </option>
        `;


        eventGameFilter.disabled =
            true;


        return false;
    }
}


// ========================================
// TODAS LAS TEMPORADAS
// ========================================

async function loadEventSeasons() {

    eventSeasonFilter.disabled =
        true;


    eventSeasonFilter.innerHTML = `
        <option value="">
            Cargando temporadas...
        </option>
    `;


    try {

        const data =
            await fetchJson(
                'api/seasons.php'
            );


        eventSeasonFilter.innerHTML =
            '';


        data.seasons.forEach(
            (season) => {

                const option =
                    document.createElement(
                        'option'
                    );


                option.value =
                    season.slug;


                option.textContent =
                    season.status ===
                    'completed'
                        ? `${season.name} (Completada)`
                        : season.name;


                eventSeasonFilter.appendChild(
                    option
                );
            }
        );


        if (
            data.seasons.length === 0
        ) {

            eventSeasonFilter.innerHTML = `
                <option value="">
                    No hay temporadas
                </option>
            `;
        }


        eventSeasonFilter.disabled =
            data.seasons.length === 0;


        updateEventTitles();


        return true;

    } catch (error) {

        console.error(
            'Error al cargar temporadas:',
            error
        );


        eventSeasonFilter.innerHTML = `
            <option value="">
                Error al cargar temporadas
            </option>
        `;


        eventSeasonFilter.disabled =
            true;


        return false;
    }
}


// ========================================
// TEMPORADAS ACTIVAS
// ========================================

async function loadActiveSeasons() {

    try {

        const data =
            await fetchJson(
                'api/seasons.php?status=active'
            );


        activeSeasons =
            data.seasons;


        return true;

    } catch (error) {

        console.error(
            'Error al cargar temporadas activas:',
            error
        );


        activeSeasons =
            [];


        return false;
    }
}


// ========================================
// JUEGOS ACTIVOS PARA MODO EVENTO
// ========================================

async function loadActiveGamesForEventMode() {

    try {

        const data =
            await fetchJson(
                'api/games.php?status=active'
            );


        activeGames =
            data.games;


        return true;

    } catch (error) {

        console.error(
            'Error al cargar juegos activos:',
            error
        );


        activeGames =
            [];


        return false;
    }
}


// ========================================
// OBTENER TABLA DE POSICIONES
// ========================================

async function getLeaderboard(
    game,
    season,
    limit,
    search = '',
    signal = null
) {

    const params =
        new URLSearchParams({
            game:
                game,

            season:
                season,

            limit:
                limit
        });


    if (
        search !== ''
    ) {

        params.set(
            'search',
            search
        );
    }


    const options =
        {};


    if (signal) {

        options.signal =
            signal;
    }


    const data =
        await fetchJson(
            `api/leaderboard.php?${params.toString()}`,
            options
        );


    return data.leaderboard;
}


// ========================================
// CANCELAR PETICIONES
// ========================================

function cancelManualLeaderboardRequest() {

    if (
        leaderboardAbortController
    ) {

        leaderboardAbortController.abort();

        leaderboardAbortController =
            null;
    }
}


function cancelEventModeRequest() {

    if (
        eventModeAbortController
    ) {

        eventModeAbortController.abort();

        eventModeAbortController =
            null;
    }
}


// ========================================
// TABLA DE POSICIONES NORMAL
// ========================================

async function loadEventLeaderboard(
    manualLoad = true
) {

    if (
        eventModeActive
    ) {

        return;
    }


    const game =
        eventGameFilter.value;

    const season =
        eventSeasonFilter.value;

    const limit =
        eventLeaderboardLimit.value;

    const search =
        eventPlayerSearch.value.trim();


    if (
        !game ||
        !season
    ) {

        if (
            !hasSuccessfulLeaderboard
        ) {

            eventLeaderboardBody.innerHTML = `
                <tr>
                    <td colspan="3">
                        No hay datos disponibles.
                    </td>
                </tr>
            `;
        }

        return;
    }


    cancelManualLeaderboardRequest();


    leaderboardAbortController =
        new AbortController();


    const controller =
        leaderboardAbortController;


    if (
        manualLoad ||
        !hasSuccessfulLeaderboard
    ) {

        eventLeaderboardBody.innerHTML = `
            <tr>
                <td colspan="3">
                    Cargando leaderboard...
                </td>
            </tr>
        `;
    }


    try {

        const players =
            await getLeaderboard(
                game,
                season,
                limit,
                search,
                controller.signal
            );


        if (
            controller !==
            leaderboardAbortController
        ) {

            return;
        }


        renderEventLeaderboard(
            players
        );


        hasSuccessfulLeaderboard =
            true;


        updateLastUpdated();

    } catch (error) {

        if (
            error.name ===
            'AbortError'
        ) {

            return;
        }


        console.error(
            'Error al cargar leaderboard:',
            error
        );


        handleLeaderboardError(
            manualLoad
        );

    } finally {

        if (
            controller ===
            leaderboardAbortController
        ) {

            leaderboardAbortController =
                null;
        }
    }
}


// ========================================
// MOSTRAR TABLA DE POSICIONES
// ========================================

function renderEventLeaderboard(
    players
) {

    eventLeaderboardBody.innerHTML =
        '';


    if (
        players.length === 0
    ) {

        eventLeaderboardBody.innerHTML = `
            <tr>
                <td colspan="3">
                    No se encontraron jugadores.
                </td>
            </tr>
        `;

        return;
    }


    players.forEach(
        (player) => {

            const row =
                document.createElement(
                    'tr'
                );


            const positionCell =
                document.createElement(
                    'td'
                );

            positionCell.textContent =
                player.position;


            const nicknameCell =
                document.createElement(
                    'td'
                );

            nicknameCell.textContent =
                player.nickname;


            const scoreCell =
                document.createElement(
                    'td'
                );

            scoreCell.textContent =
                Number(
                    player.best_score
                ).toLocaleString();


            row.appendChild(
                positionCell
            );

            row.appendChild(
                nicknameCell
            );

            row.appendChild(
                scoreCell
            );


            eventLeaderboardBody.appendChild(
                row
            );
        }
    );
}


// ========================================
// ERROR NORMAL
// ========================================

function handleLeaderboardError(
    manualLoad
) {

    if (
        hasSuccessfulLeaderboard &&
        !manualLoad
    ) {

        lastUpdated.textContent =
            'Problema de conexión. Reintentando...';

        return;
    }


    eventLeaderboardBody.innerHTML = `
        <tr>

            <td colspan="3">

                No se pudo cargar el leaderboard.

                <button
                    type="button"
                    id="retryEventLeaderboard"
                >
                    Reintentar
                </button>

            </td>

        </tr>
    `;


    lastUpdated.textContent =
        'Error de actualización';


    const retryButton =
        document.getElementById(
            'retryEventLeaderboard'
        );


    if (retryButton) {

        retryButton.addEventListener(
            'click',
            () => {

                loadEventLeaderboard(
                    true
                );
            }
        );
    }
}


// ========================================
// BÚSQUEDA
// ========================================

eventPlayerSearch.addEventListener(
    'input',
    () => {

        if (
            eventModeActive
        ) {

            return;
        }


        clearTimeout(
            searchTimeout
        );


        searchTimeout =
            setTimeout(
                () => {

                    loadEventLeaderboard(
                        true
                    );

                },
                300
            );
    }
);


// ========================================
// TÍTULOS
// ========================================

function updateEventTitles() {

    if (
        eventModeActive
    ) {

        return;
    }


    const selectedGame =
        eventGameFilter.options[
            eventGameFilter.selectedIndex
        ];


    const selectedSeason =
        eventSeasonFilter.options[
            eventSeasonFilter.selectedIndex
        ];


    eventGameTitle.textContent =
        selectedGame &&
        selectedGame.value
            ? selectedGame.textContent.trim()
            : 'Sin juego activo';


    eventSeasonTitle.textContent =
        selectedSeason &&
        selectedSeason.value
            ? selectedSeason.textContent.trim()
            : 'Sin temporada';
}


// ========================================
// FILTROS
// ========================================

eventGameFilter.addEventListener(
    'change',
    async () => {

        if (
            eventModeActive
        ) {

            return;
        }


        clearTimeout(
            searchTimeout
        );


        eventPlayerSearch.value =
            '';


        hasSuccessfulLeaderboard =
            false;


        updateEventTitles();


        await loadEventLeaderboard(
            true
        );
    }
);


eventSeasonFilter.addEventListener(
    'change',
    async () => {

        if (
            eventModeActive
        ) {

            return;
        }


        clearTimeout(
            searchTimeout
        );


        eventPlayerSearch.value =
            '';


        hasSuccessfulLeaderboard =
            false;


        updateEventTitles();


        await loadEventLeaderboard(
            true
        );
    }
);


eventLeaderboardLimit.addEventListener(
    'change',
    async () => {

        if (
            eventModeActive
        ) {

            return;
        }


        await loadEventLeaderboard(
            true
        );
    }
);


// ========================================
// PANTALLA COMPLETA
// ========================================

fullscreenButton.addEventListener(
    'click',
    async () => {

        try {

            if (
                !document.fullscreenElement
            ) {

                await document
                    .documentElement
                    .requestFullscreen();

            } else {

                await document
                    .exitFullscreen();
            }

        } catch (error) {

            console.error(
                'No se pudo cambiar a pantalla completa:',
                error
            );
        }
    }
);


document.addEventListener(
    'fullscreenchange',
    () => {

        if (
            document.fullscreenElement
        ) {

            fullscreenButton.textContent =
                'Salir de pantalla completa';

        } else {

            fullscreenButton.textContent =
                'Pantalla completa';


            if (
                eventModeActive
            ) {

                stopEventMode(
                    false
                );
            }
        }
    }
);


// ========================================
// ÚLTIMA ACTUALIZACIÓN
// ========================================

function updateLastUpdated() {

    const now =
        new Date();


    lastUpdated.textContent =
        `Última actualización: ${now.toLocaleTimeString()}`;
}


// ========================================
// ACTUALIZACIÓN AUTOMÁTICA NORMAL
// ========================================

function startAutoRefresh() {

    stopAutoRefresh();


    autoRefreshInterval =
        setInterval(
            () => {

                if (
                    !eventModeActive
                ) {

                    loadEventLeaderboard(
                        false
                    );
                }

            },
            NORMAL_REFRESH_TIME
        );
}


function stopAutoRefresh() {

    if (
        autoRefreshInterval
    ) {

        clearInterval(
            autoRefreshInterval
        );


        autoRefreshInterval =
            null;
    }
}


// ========================================
// CREAR ROTACIÓN
// ========================================

function buildEventRotation() {

    eventRotationItems =
        [];


    activeSeasons.forEach(
        (season) => {

            activeGames.forEach(
                (game) => {

                    eventRotationItems.push({
                        gameSlug:
                            game.slug,

                        gameName:
                            game.name,

                        seasonSlug:
                            season.slug,

                        seasonName:
                            season.name
                    });
                }
            );
        }
    );


    currentRotationIndex =
        0;
}


// ========================================
// ESTADO DE ROTACIÓN
// ========================================

function updateRotationStatus() {

    if (
        eventRotationItems.length === 0
    ) {

        eventRotationStatus.textContent =
            'Sin leaderboards disponibles.';

        return;
    }


    eventRotationStatus.textContent =
        `${currentRotationIndex + 1} de ${eventRotationItems.length}`;
}


// ========================================
// BUSCAR PRÓXIMA TABLA DE POSICIONES CON DATOS
// ========================================
//
// Revisa como máximo una vuelta completa.
// Si una combinación está vacía,
// avanza inmediatamente a la siguiente.
// ========================================

async function showNextNonEmptyLeaderboard(
    startIndex
) {

    if (
        !eventModeActive ||
        eventRotationItems.length === 0
    ) {

        return false;
    }


    const total =
        eventRotationItems.length;


    for (
        let attempt = 0;
        attempt < total;
        attempt++
    ) {

        if (
            !eventModeActive
        ) {

            return false;
        }


        const index =
            (
                startIndex +
                attempt
            ) %
            total;


        const item =
            eventRotationItems[
                index
            ];


        currentRotationIndex =
            index;


        eventGameTitle.textContent =
            item.gameName;


        eventSeasonTitle.textContent =
            item.seasonName;


        eventRotationStatus.textContent =
            'Buscando leaderboard con resultados...';


        cancelEventModeRequest();


        eventModeAbortController =
            new AbortController();


        const controller =
            eventModeAbortController;


        try {

            const players =
                await getLeaderboard(
                    item.gameSlug,
                    item.seasonSlug,
                    10,
                    '',
                    controller.signal
                );


            if (
                !eventModeActive
            ) {

                return false;
            }


            if (
                controller !==
                eventModeAbortController
            ) {

                return false;
            }


            // ========================================
            // VACÍO → SIGUIENTE
            // ========================================

            if (
                players.length === 0
            ) {

                continue;
            }


            // ========================================
            // TIENE DATOS
            // ========================================

            renderEventLeaderboard(
                players
            );


            updateRotationStatus();


            updateLastUpdated();


            return true;

        } catch (error) {

            if (
                error.name ===
                'AbortError'
            ) {

                return false;
            }


            console.error(
                'Error durante modo evento:',
                error
            );


            // Si una combinación falla,
            // probamos la siguiente.
            continue;

        } finally {

            if (
                controller ===
                eventModeAbortController
            ) {

                eventModeAbortController =
                    null;
            }
        }
    }


    // ========================================
    // TODAS ESTÁN VACÍAS / FALLARON
    // ========================================

    eventGameTitle.textContent =
        'SpicyCrust';


    eventSeasonTitle.textContent =
        'Sin resultados disponibles';


    eventRotationStatus.textContent =
        'No hay leaderboards con puntajes.';


    eventLeaderboardBody.innerHTML = `
        <tr>
            <td colspan="3">
                Todavía no hay puntajes para mostrar.
            </td>
        </tr>
    `;


    lastUpdated.textContent =
        'Esperando resultados...';


    return false;
}


// ========================================
// MOSTRAR PRIMERA TABLA DE POSICIONES
// ========================================

async function showCurrentEventLeaderboard() {

    return await showNextNonEmptyLeaderboard(
        currentRotationIndex
    );
}


// ========================================
// ROTAR
// ========================================

async function rotateEventLeaderboard() {

    if (
        !eventModeActive ||
        eventRotationItems.length === 0
    ) {

        return;
    }


    const nextIndex =
        (
            currentRotationIndex +
            1
        ) %
        eventRotationItems.length;


    await showNextNonEmptyLeaderboard(
        nextIndex
    );
}


// ========================================
// INTERVALO DE ROTACIÓN
// ========================================

function startEventRotation() {

    stopEventRotation();


    eventRotationInterval =
        setInterval(
            rotateEventLeaderboard,
            EVENT_ROTATION_TIME
        );
}


function stopEventRotation() {

    if (
        eventRotationInterval
    ) {

        clearInterval(
            eventRotationInterval
        );


        eventRotationInterval =
            null;
    }
}


// ========================================
// INICIAR MODO EVENTO
// ========================================

async function startEventMode() {

    if (
        eventModeActive
    ) {

        return;
    }


    eventModeButton.disabled =
        true;


    eventModeButton.textContent =
        'Preparando...';


    try {

        cancelManualLeaderboardRequest();


        const [
            gamesResult,
            seasonsResult
        ] =
            await Promise.all([
                loadActiveGamesForEventMode(),
                loadActiveSeasons()
            ]);


        if (
            !gamesResult ||
            !seasonsResult
        ) {

            throw new Error(
                'No se pudo cargar la configuración del evento.'
            );
        }


        if (
            activeGames.length === 0
        ) {

            alert(
                'No hay juegos activos para mostrar.'
            );

            return;
        }


        if (
            activeSeasons.length === 0
        ) {

            alert(
                'No hay temporadas activas para mostrar.'
            );

            return;
        }


        buildEventRotation();


        if (
            eventRotationItems.length === 0
        ) {

            alert(
                'No hay leaderboards disponibles para rotar.'
            );

            return;
        }


        stopAutoRefresh();


        eventModeActive =
            true;


        eventControls.hidden =
            true;


        eventModeStatus.hidden =
            false;


        eventModeExitContainer.hidden =
            false;


        eventPlayerSearch.value =
            '';


        hasSuccessfulLeaderboard =
            false;


        currentRotationIndex =
            0;


        try {

            if (
                !document.fullscreenElement
            ) {

                await document
                    .documentElement
                    .requestFullscreen();
            }

        } catch (fullscreenError) {

            console.warn(
                'No se pudo iniciar fullscreen automáticamente:',
                fullscreenError
            );
        }


        eventLeaderboardBody.innerHTML = `
            <tr>
                <td colspan="3">
                    Buscando leaderboard...
                </td>
            </tr>
        `;


        await showCurrentEventLeaderboard();


        startEventRotation();

    } catch (error) {

        console.error(
            'Error al iniciar modo evento:',
            error
        );


        alert(
            'No se pudo iniciar el modo evento.'
        );

    } finally {

        eventModeButton.disabled =
            false;


        eventModeButton.textContent =
            'Iniciar modo evento';
    }
}


// ========================================
// DETENER MODO EVENTO
// ========================================

async function stopEventMode(
    exitFullscreen = true
) {

    if (
        !eventModeActive
    ) {

        return;
    }


    eventModeActive =
        false;


    stopEventRotation();


    cancelEventModeRequest();


    eventControls.hidden =
        false;


    eventModeStatus.hidden =
        true;


    eventModeExitContainer.hidden =
        true;


    eventRotationItems =
        [];


    currentRotationIndex =
        0;


    updateEventTitles();


    if (
        exitFullscreen &&
        document.fullscreenElement
    ) {

        try {

            await document
                .exitFullscreen();

        } catch (error) {

            console.warn(
                'No se pudo salir de fullscreen:',
                error
            );
        }
    }


    hasSuccessfulLeaderboard =
        false;


    await loadEventLeaderboard(
        true
    );


    startAutoRefresh();
}


// ========================================
// BOTONES DEL MODO EVENTO
// ========================================

eventModeButton.addEventListener(
    'click',
    startEventMode
);


exitEventModeButton.addEventListener(
    'click',
    () => {

        stopEventMode(
            true
        );
    }
);


// ========================================
// INICIALIZAR
// ========================================

async function initializeEventPage() {

    setEventControlsDisabled(
        true
    );


    cancelManualLeaderboardRequest();

    cancelEventModeRequest();


    eventLeaderboardBody.innerHTML = `
        <tr>
            <td colspan="3">
                Inicializando leaderboard...
            </td>
        </tr>
    `;


    lastUpdated.textContent =
        'Cargando...';


    const results =
        await Promise.all([
            loadEventGames(),
            loadEventSeasons()
        ]);


    const gamesLoaded =
        results[0];

    const seasonsLoaded =
        results[1];


    if (
        gamesLoaded &&
        seasonsLoaded &&
        eventGameFilter.value &&
        eventSeasonFilter.value
    ) {

        setEventControlsDisabled(
            false
        );


        updateEventTitles();


        await loadEventLeaderboard(
            true
        );


        startAutoRefresh();

    } else {

        eventLeaderboardBody.innerHTML = `
            <tr>

                <td colspan="3">

                    No se pudo inicializar el leaderboard.

                    <button
                        type="button"
                        id="retryEventInitialization"
                    >
                        Reintentar
                    </button>

                </td>

            </tr>
        `;


        lastUpdated.textContent =
            'Error al cargar';


        const retryButton =
            document.getElementById(
                'retryEventInitialization'
            );


        if (retryButton) {

            retryButton.addEventListener(
                'click',
                initializeEventPage
            );
        }
    }
}


initializeEventPage();