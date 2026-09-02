// ========================================
// ELEMENTOS DEL DOM
// ========================================

const leaderboardBody =
    document.getElementById(
        'leaderboardBody'
    );

const leaderboardHeaderRow =
    document.getElementById(
        'leaderboardHeaderRow'
    );

const adminViewFilter =
    document.getElementById(
        'adminViewFilter'
    );

const tableTitle =
    document.getElementById(
        'tableTitle'
    );

const gameFilter =
    document.getElementById(
        'gameFilter'
    );

const seasonFilter =
    document.getElementById(
        'seasonFilter'
    );

const leaderboardLimit =
    document.getElementById(
        'leaderboardLimit'
    );

const playerSearch =
    document.getElementById(
        'playerSearch'
    );


// ========================================
// LISTA DE JUGADORES
// ========================================

const playersToolbar =
    document.getElementById(
        'playersToolbar'
    );

const playersCount =
    document.getElementById(
        'playersCount'
    );

const exportPlayersCsvButton =
    document.getElementById(
        'exportPlayersCsvButton'
    );


// ========================================
// DETALLES DEL JUGADOR
// ========================================

const playerDetails =
    document.getElementById(
        'playerDetails'
    );

const playerDetailsPlaceholder =
    document.getElementById(
        'playerDetailsPlaceholder'
    );

const detailNickname =
    document.getElementById(
        'detailNickname'
    );

const detailEmail =
    document.getElementById(
        'detailEmail'
    );

const detailBestScore =
    document.getElementById(
        'detailBestScore'
    );

const scoreHistoryBody =
    document.getElementById(
        'scoreHistoryBody'
    );

const closePlayerDetails =
    document.getElementById(
        'closePlayerDetails'
    );


// ========================================
// ESTADÍSTICAS
// ========================================

const statsSection =
    document.getElementById(
        'statsSection'
    );

const statPlayers =
    document.getElementById(
        'statPlayers'
    );

const statScores =
    document.getElementById(
        'statScores'
    );

const statHighestScore =
    document.getElementById(
        'statHighestScore'
    );

const statScoresToday =
    document.getElementById(
        'statScoresToday'
    );


// ========================================
// VARIABLES
// ========================================

let currentLeaderboard =
    [];

let currentPlayersList =
    [];

let currentPlayerId =
    null;

let searchTimeout =
    null;

let leaderboardAbortController =
    null;

let playersAbortController =
    null;


// ========================================
// VISTA ACTUAL
// ========================================

function getCurrentView() {

    return adminViewFilter.value;
}


// ========================================
// CANCELAR PETICIONES
// ========================================

function cancelLeaderboardRequest() {

    if (
        leaderboardAbortController
    ) {

        leaderboardAbortController.abort();

        leaderboardAbortController =
            null;
    }
}


function cancelPlayersRequest() {

    if (
        playersAbortController
    ) {

        playersAbortController.abort();

        playersAbortController =
            null;
    }
}


// ========================================
// RESET DETALLES
// ========================================

function resetPlayerDetails() {

    playerDetails.hidden =
        true;


    playerDetailsPlaceholder.hidden =
        false;


    currentPlayerId =
        null;
}


// ========================================
// DESHABILITAR FILTROS
// ========================================

function setFiltersDisabled(
    disabled
) {

    adminViewFilter.disabled =
        disabled;

    gameFilter.disabled =
        disabled;

    seasonFilter.disabled =
        disabled;

    leaderboardLimit.disabled =
        disabled;

    playerSearch.disabled =
        disabled;
}


// ========================================
// CARGAR JUEGOS
// ========================================

async function loadGames() {

    gameFilter.disabled =
        true;


    gameFilter.innerHTML = `
        <option value="">
            Cargando juegos...
        </option>
    `;


    try {

        const response =
            await fetch(
                'api/games.php'
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                'No se pudieron cargar los juegos.'
            );
        }


        gameFilter.innerHTML =
            '';


        data.games.forEach(
            (game) => {

                const option =
                    document.createElement(
                        'option'
                    );


                option.value =
                    game.slug;


                option.textContent =
                    game.status === 'inactive'
                        ? `${game.name} (Inactivo)`
                        : game.name;


                gameFilter.appendChild(
                    option
                );
            }
        );


        if (
            data.games.length === 0
        ) {

            gameFilter.innerHTML = `
                <option value="">
                    No hay juegos disponibles
                </option>
            `;
        }


        gameFilter.disabled =
            data.games.length === 0;


        return true;

    } catch (error) {

        console.error(
            'Error al cargar juegos:',
            error
        );


        gameFilter.innerHTML = `
            <option value="">
                Error al cargar juegos
            </option>
        `;


        gameFilter.disabled =
            true;


        return false;
    }
}


// ========================================
// CARGAR TEMPORADAS
// ========================================

async function loadSeasons() {

    seasonFilter.disabled =
        true;


    seasonFilter.innerHTML = `
        <option value="">
            Cargando temporadas...
        </option>
    `;


    try {

        const response =
            await fetch(
                'api/seasons.php'
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                'No se pudieron cargar las temporadas.'
            );
        }


        seasonFilter.innerHTML =
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
                    season.status === 'completed'
                        ? `${season.name} (Completada)`
                        : season.name;


                seasonFilter.appendChild(
                    option
                );
            }
        );


        if (
            data.seasons.length === 0
        ) {

            seasonFilter.innerHTML = `
                <option value="">
                    No hay temporadas disponibles
                </option>
            `;
        }


        seasonFilter.disabled =
            data.seasons.length === 0;


        return true;

    } catch (error) {

        console.error(
            'Error al cargar temporadas:',
            error
        );


        seasonFilter.innerHTML = `
            <option value="">
                Error al cargar temporadas
            </option>
        `;


        seasonFilter.disabled =
            true;


        return false;
    }
}


// ========================================
// CAMBIAR VISTA
// ========================================

function updateAdminView() {

    const view =
        getCurrentView();


    clearTimeout(
        searchTimeout
    );


    playerSearch.value =
        '';


    resetPlayerDetails();


    cancelLeaderboardRequest();

    cancelPlayersRequest();


    // ========================================
    // LISTA DE JUGADORES
    // ========================================

    if (
        view === 'players'
    ) {

        tableTitle.textContent =
            'Lista de jugadores';


        statsSection.hidden =
            true;


        playersToolbar.hidden =
            false;


        gameFilter.disabled =
            true;

        seasonFilter.disabled =
            true;

        leaderboardLimit.disabled =
            true;

        playerSearch.disabled =
            false;


        playerSearch.placeholder =
            'Buscar nickname o email...';


        leaderboardHeaderRow.innerHTML = `
            <th>
                Jugador
            </th>

            <th>
                Email
            </th>

            <th>
                Fecha de registro
            </th>

            <th>
                Acciones
            </th>
        `;


        loadPlayersList();

        return;
    }


    // ========================================
    // TABLA DE POSICIONES
    // ========================================

    tableTitle.textContent =
        'Leaderboard';


    statsSection.hidden =
        false;


    playersToolbar.hidden =
        true;


    gameFilter.disabled =
        false;

    seasonFilter.disabled =
        false;

    leaderboardLimit.disabled =
        false;

    playerSearch.disabled =
        false;


    playerSearch.placeholder =
        'Buscar por nickname...';


    leaderboardHeaderRow.innerHTML = `
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
    `;


    Promise.all([
        loadLeaderboard(),
        loadStats()
    ]);
}


// ========================================
// CARGAR TABLA DE POSICIONES
// ========================================

async function loadLeaderboard() {

    if (
        getCurrentView() !==
        'leaderboard'
    ) {

        return;
    }


    const game =
        gameFilter.value;

    const season =
        seasonFilter.value;

    const limit =
        leaderboardLimit.value;

    const search =
        playerSearch.value.trim();


    if (
        !game ||
        !season
    ) {

        leaderboardBody.innerHTML = `
            <tr>
                <td colspan="4">
                    Selecciona un juego y una temporada.
                </td>
            </tr>
        `;

        return;
    }


    cancelLeaderboardRequest();


    leaderboardAbortController =
        new AbortController();


    const controller =
        leaderboardAbortController;


    leaderboardBody.innerHTML = `
        <tr>
            <td colspan="4">
                Cargando leaderboard...
            </td>
        </tr>
    `;


    try {

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


        const response =
            await fetch(
                `api/leaderboard.php?${params.toString()}`,
                {
                    signal:
                        controller.signal
                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                'No se pudo cargar el leaderboard.'
            );
        }


        if (
            controller !==
            leaderboardAbortController
        ) {

            return;
        }


        currentLeaderboard =
            data.leaderboard;


        renderLeaderboard(
            currentLeaderboard
        );

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


        leaderboardBody.innerHTML = `
            <tr>

                <td colspan="4">

                    No se pudo cargar el leaderboard.

                    <button
                        type="button"
                        id="retryLeaderboardButton"
                    >
                        Reintentar
                    </button>

                </td>

            </tr>
        `;


        const retryButton =
            document.getElementById(
                'retryLeaderboardButton'
            );


        if (retryButton) {

            retryButton.addEventListener(
                'click',
                loadLeaderboard
            );
        }

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

function renderLeaderboard(
    players
) {

    leaderboardBody.innerHTML =
        '';


    if (
        players.length === 0
    ) {

        leaderboardBody.innerHTML = `
            <tr>
                <td colspan="4">
                    No se encontraron resultados.
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


            const actionsCell =
                document.createElement(
                    'td'
                );


            const viewButton =
                document.createElement(
                    'button'
                );


            viewButton.type =
                'button';


            viewButton.className =
                'view-player';


            viewButton.dataset.playerId =
                player.player_id;


            viewButton.textContent =
                'Ver';


            actionsCell.appendChild(
                viewButton
            );


            row.appendChild(
                positionCell
            );

            row.appendChild(
                nicknameCell
            );

            row.appendChild(
                scoreCell
            );

            row.appendChild(
                actionsCell
            );


            leaderboardBody.appendChild(
                row
            );
        }
    );
}


// ========================================
// CARGAR LISTA DE JUGADORES
// ========================================

async function loadPlayersList() {

    if (
        getCurrentView() !==
        'players'
    ) {

        return;
    }


    cancelPlayersRequest();


    playersAbortController =
        new AbortController();


    const controller =
        playersAbortController;


    const search =
        playerSearch.value.trim();


    currentPlayersList =
        [];


    exportPlayersCsvButton.disabled =
        true;


    playersCount.textContent =
        'Cargando jugadores...';


    leaderboardBody.innerHTML = `
        <tr>
            <td colspan="4">
                Cargando jugadores...
            </td>
        </tr>
    `;


    try {

        const params =
            new URLSearchParams();


        if (
            search !== ''
        ) {

            params.set(
                'search',
                search
            );
        }


        const query =
            params.toString();


        const url =
            query
                ? `api/players.php?${query}`
                : 'api/players.php';


        const response =
            await fetch(
                url,
                {
                    signal:
                        controller.signal
                }
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                'No se pudieron cargar los jugadores.'
            );
        }


        if (
            controller !==
            playersAbortController
        ) {

            return;
        }


        currentPlayersList =
            data.players;


        renderPlayersList(
            currentPlayersList
        );


        updatePlayersToolbar();

    } catch (error) {

        if (
            error.name ===
            'AbortError'
        ) {

            return;
        }


        console.error(
            'Error al cargar jugadores:',
            error
        );


        currentPlayersList =
            [];


        playersCount.textContent =
            'Error al cargar jugadores';


        exportPlayersCsvButton.disabled =
            true;


        leaderboardBody.innerHTML = `
            <tr>

                <td colspan="4">

                    No se pudo cargar la lista de jugadores.

                    <button
                        type="button"
                        id="retryPlayersButton"
                    >
                        Reintentar
                    </button>

                </td>

            </tr>
        `;


        const retryButton =
            document.getElementById(
                'retryPlayersButton'
            );


        if (retryButton) {

            retryButton.addEventListener(
                'click',
                loadPlayersList
            );
        }

    } finally {

        if (
            controller ===
            playersAbortController
        ) {

            playersAbortController =
                null;
        }
    }
}


// ========================================
// TOOLBAR DE JUGADORES
// ========================================

function updatePlayersToolbar() {

    const total =
        currentPlayersList.length;


    playersCount.textContent =
        total === 1
            ? '1 jugador'
            : `${total} jugadores`;


    exportPlayersCsvButton.disabled =
        total === 0;
}


// ========================================
// MOSTRAR JUGADORES
// ========================================

function renderPlayersList(
    players
) {

    leaderboardBody.innerHTML =
        '';


    if (
        players.length === 0
    ) {

        leaderboardBody.innerHTML = `
            <tr>
                <td colspan="4">
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


            const nicknameCell =
                document.createElement(
                    'td'
                );


            nicknameCell.textContent =
                player.nickname ||
                'Sin nickname';


            const emailCell =
                document.createElement(
                    'td'
                );


            emailCell.textContent =
                player.email;


            const createdCell =
                document.createElement(
                    'td'
                );


            createdCell.textContent =
                player.created_at;


            const actionsCell =
                document.createElement(
                    'td'
                );


            const viewButton =
                document.createElement(
                    'button'
                );


            viewButton.type =
                'button';


            viewButton.className =
                'view-player';


            viewButton.dataset.playerId =
                player.id;


            viewButton.textContent =
                'Ver';


            actionsCell.appendChild(
                viewButton
            );


            row.appendChild(
                nicknameCell
            );

            row.appendChild(
                emailCell
            );

            row.appendChild(
                createdCell
            );

            row.appendChild(
                actionsCell
            );


            leaderboardBody.appendChild(
                row
            );
        }
    );
}


// ========================================
// PROTEGER CSV
// ========================================

function escapeCsvValue(
    value
) {

    let text =
        String(
            value ?? ''
        );


    if (
        /^[=+\-@]/.test(text)
    ) {

        text =
            `'${text}`;
    }


    text =
        text.replace(
            /"/g,
            '""'
        );


    return `"${text}"`;
}


// ========================================
// EXPORTAR CSV
// ========================================

function exportPlayersCsv() {

    if (
        currentPlayersList.length === 0
    ) {

        return;
    }


    const rows =
        [];


    rows.push([
        'Nickname',
        'Email',
        'Fecha de registro'
    ]);


    currentPlayersList.forEach(
        (player) => {

            rows.push([
                player.nickname || '',
                player.email || '',
                player.created_at || ''
            ]);
        }
    );


    const csv =
        rows
            .map(
                (row) =>
                    row
                        .map(
                            escapeCsvValue
                        )
                        .join(',')
            )
            .join('\r\n');


    const blob =
        new Blob(
            [
                '\uFEFF',
                csv
            ],
            {
                type:
                    'text/csv;charset=utf-8;'
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            'a'
        );


    const date =
        new Date()
            .toISOString()
            .slice(0, 10);


    link.href =
        url;


    link.download =
        `spicycrust-jugadores-${date}.csv`;


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );


    URL.revokeObjectURL(
        url
    );
}


// ========================================
// BOTÓN EXPORTAR
// ========================================

exportPlayersCsvButton.addEventListener(
    'click',
    exportPlayersCsv
);


// ========================================
// ESTADÍSTICAS
// ========================================

async function loadStats() {

    if (
        getCurrentView() !==
        'leaderboard'
    ) {

        return;
    }


    const game =
        gameFilter.value;

    const season =
        seasonFilter.value;


    if (
        !game ||
        !season
    ) {

        resetStats();

        return;
    }


    statPlayers.textContent =
        '...';

    statScores.textContent =
        '...';

    statHighestScore.textContent =
        '...';

    statScoresToday.textContent =
        '...';


    try {

        const params =
            new URLSearchParams({
                game:
                    game,

                season:
                    season
            });


        const response =
            await fetch(
                `api/stats.php?${params.toString()}`
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                'No se pudieron cargar las estadísticas.'
            );
        }


        statPlayers.textContent =
            Number(
                data.stats.total_players
            ).toLocaleString();


        statScores.textContent =
            Number(
                data.stats.total_scores
            ).toLocaleString();


        statHighestScore.textContent =
            Number(
                data.stats.highest_score
            ).toLocaleString();


        statScoresToday.textContent =
            Number(
                data.stats.scores_today
            ).toLocaleString();

    } catch (error) {

        console.error(
            'Error al cargar estadísticas:',
            error
        );


        statPlayers.textContent =
            'Error';

        statScores.textContent =
            'Error';

        statHighestScore.textContent =
            'Error';

        statScoresToday.textContent =
            'Error';
    }
}


// ========================================
// RESET ESTADÍSTICAS
// ========================================

function resetStats() {

    statPlayers.textContent =
        '0';

    statScores.textContent =
        '0';

    statHighestScore.textContent =
        '0';

    statScoresToday.textContent =
        '0';
}


// ========================================
// DETALLES DEL JUGADOR
// ========================================

async function loadPlayerDetails(
    playerId
) {

    currentPlayerId =
        playerId;


    playerDetails.hidden =
        false;


    playerDetailsPlaceholder.hidden =
        true;


    detailNickname.textContent =
        'Cargando...';

    detailEmail.textContent =
        'Cargando...';

    detailBestScore.textContent =
        '...';


    scoreHistoryBody.innerHTML = `
        <tr>
            <td colspan="5">
                Cargando historial...
            </td>
        </tr>
    `;


    try {

        const params =
            new URLSearchParams({
                id:
                    playerId
            });


        // En leaderboard mostramos solamente
        // historial del juego/temporada actual.
        //
        // En Lista de jugadores mostramos
        // todo el historial del jugador.

        if (
            getCurrentView() ===
            'leaderboard'
        ) {

            if (
                gameFilter.value
            ) {

                params.set(
                    'game',
                    gameFilter.value
                );
            }


            if (
                seasonFilter.value
            ) {

                params.set(
                    'season',
                    seasonFilter.value
                );
            }
        }


        const response =
            await fetch(
                `api/player.php?${params.toString()}`
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                'No se pudo cargar el jugador.'
            );
        }


        detailNickname.textContent =
            data.player.nickname ||
            'Sin nickname';


        detailEmail.textContent =
            data.player.email;


        const scores =
            data.scores;


        let bestScore =
            0;


        if (
            scores.length > 0
        ) {

            bestScore =
                Math.max(
                    ...scores.map(
                        (score) =>
                            Number(
                                score.score
                            )
                    )
                );
        }


        detailBestScore.textContent =
            bestScore.toLocaleString();


        scoreHistoryBody.innerHTML =
            '';


        if (
            scores.length === 0
        ) {

            scoreHistoryBody.innerHTML = `
                <tr>
                    <td colspan="5">
                        Este jugador no tiene puntajes registrados.
                    </td>
                </tr>
            `;

            return;
        }


        scores.forEach(
            (score) => {

                const row =
                    document.createElement(
                        'tr'
                    );


                const scoreCell =
                    document.createElement(
                        'td'
                    );


                scoreCell.textContent =
                    Number(
                        score.score
                    ).toLocaleString();


                const gameCell =
                    document.createElement(
                        'td'
                    );


                gameCell.textContent =
                    score.game_name;


                const seasonCell =
                    document.createElement(
                        'td'
                    );


                seasonCell.textContent =
                    score.season_name;


                const dateCell =
                    document.createElement(
                        'td'
                    );


                dateCell.textContent =
                    score.created_at;


                const actionsCell =
                    document.createElement(
                        'td'
                    );


                const deleteButton =
                    document.createElement(
                        'button'
                    );


                deleteButton.type =
                    'button';


                deleteButton.className =
                    'delete-score';


                deleteButton.dataset.scoreId =
                    score.id;


                deleteButton.textContent =
                    'Eliminar';


                actionsCell.appendChild(
                    deleteButton
                );


                row.appendChild(
                    scoreCell
                );

                row.appendChild(
                    gameCell
                );

                row.appendChild(
                    seasonCell
                );

                row.appendChild(
                    dateCell
                );

                row.appendChild(
                    actionsCell
                );


                scoreHistoryBody.appendChild(
                    row
                );
            }
        );

    } catch (error) {

        console.error(
            'Error al cargar jugador:',
            error
        );


        detailNickname.textContent =
            'Error';

        detailEmail.textContent =
            'Error';

        detailBestScore.textContent =
            'Error';


        scoreHistoryBody.innerHTML = `
            <tr>

                <td colspan="5">

                    No se pudieron cargar los datos del jugador.

                    <button
                        type="button"
                        id="retryPlayerButton"
                    >
                        Reintentar
                    </button>

                </td>

            </tr>
        `;


        const retryButton =
            document.getElementById(
                'retryPlayerButton'
            );


        if (retryButton) {

            retryButton.addEventListener(
                'click',
                () => {

                    loadPlayerDetails(
                        playerId
                    );
                }
            );
        }
    }
}


// ========================================
// BOTÓN VER
// ========================================

leaderboardBody.addEventListener(
    'click',
    (event) => {

        const button =
            event.target.closest(
                '.view-player'
            );


        if (!button) {

            return;
        }


        loadPlayerDetails(
            button.dataset.playerId
        );
    }
);


// ========================================
// ELIMINAR PUNTAJE
// ========================================

scoreHistoryBody.addEventListener(
    'click',
    async (event) => {

        const button =
            event.target.closest(
                '.delete-score'
            );


        if (!button) {

            return;
        }


        const scoreId =
            button.dataset.scoreId;


        const confirmed =
            confirm(
                '¿Estás seguro de que deseas eliminar este puntaje? Esta acción no se puede deshacer.'
            );


        if (!confirmed) {

            return;
        }


        button.disabled =
            true;


        button.textContent =
            'Eliminando...';


        try {

            const response =
                await fetch(
                    'api/delete-score.php',
                    {
                        method:
                            'DELETE',

                        headers: {
                            'Content-Type':
                                'application/json'
                        },

                        body:
                            JSON.stringify({
                                score_id:
                                    scoreId
                            })
                    }
                );


            const data =
                await response.json();


            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(
                    data.message ||
                    'No se pudo eliminar el puntaje.'
                );
            }


            if (
                getCurrentView() ===
                'leaderboard'
            ) {

                await Promise.all([
                    loadLeaderboard(),
                    loadStats()
                ]);

            } else {

                await loadPlayersList();
            }


            if (
                currentPlayerId
            ) {

                await loadPlayerDetails(
                    currentPlayerId
                );
            }

        } catch (error) {

            console.error(
                'Error al eliminar puntaje:',
                error
            );


            button.disabled =
                false;


            button.textContent =
                'Error - Reintentar';
        }
    }
);


// ========================================
// CERRAR DETALLES
// ========================================

closePlayerDetails.addEventListener(
    'click',
    () => {

        resetPlayerDetails();
    }
);


// ========================================
// CAMBIO DE VISTA
// ========================================

adminViewFilter.addEventListener(
    'change',
    () => {

        updateAdminView();
    }
);


// ========================================
// BÚSQUEDA
// ========================================

playerSearch.addEventListener(
    'input',
    () => {

        clearTimeout(
            searchTimeout
        );


        searchTimeout =
            setTimeout(
                () => {

                    resetPlayerDetails();


                    if (
                        getCurrentView() ===
                        'players'
                    ) {

                        loadPlayersList();

                    } else {

                        loadLeaderboard();
                    }

                },
                300
            );
    }
);


// ========================================
// CAMBIO DE JUEGO
// ========================================

gameFilter.addEventListener(
    'change',
    async () => {

        if (
            getCurrentView() !==
            'leaderboard'
        ) {

            return;
        }


        clearTimeout(
            searchTimeout
        );


        playerSearch.value =
            '';


        resetPlayerDetails();


        await Promise.all([
            loadLeaderboard(),
            loadStats()
        ]);
    }
);


// ========================================
// CAMBIO DE TEMPORADA
// ========================================

seasonFilter.addEventListener(
    'change',
    async () => {

        if (
            getCurrentView() !==
            'leaderboard'
        ) {

            return;
        }


        clearTimeout(
            searchTimeout
        );


        playerSearch.value =
            '';


        resetPlayerDetails();


        await Promise.all([
            loadLeaderboard(),
            loadStats()
        ]);
    }
);


// ========================================
// CAMBIO DE CANTIDAD
// ========================================

leaderboardLimit.addEventListener(
    'change',
    () => {

        if (
            getCurrentView() ===
            'leaderboard'
        ) {

            resetPlayerDetails();

            loadLeaderboard();
        }
    }
);


// ========================================
// INICIALIZAR
// ========================================

async function initializePage() {

    setFiltersDisabled(
        true
    );


    playersToolbar.hidden =
        true;


    resetPlayerDetails();


    leaderboardBody.innerHTML = `
        <tr>
            <td colspan="4">
                Inicializando panel...
            </td>
        </tr>
    `;


    const results =
        await Promise.all([
            loadGames(),
            loadSeasons()
        ]);


    const gamesLoaded =
        results[0];

    const seasonsLoaded =
        results[1];


    adminViewFilter.disabled =
        false;


    playerSearch.disabled =
        false;


    if (
        gamesLoaded &&
        seasonsLoaded &&
        gameFilter.value &&
        seasonFilter.value
    ) {

        gameFilter.disabled =
            false;

        seasonFilter.disabled =
            false;

        leaderboardLimit.disabled =
            false;


        await Promise.all([
            loadLeaderboard(),
            loadStats()
        ]);

    } else {

        leaderboardBody.innerHTML = `
            <tr>

                <td colspan="4">

                    No se pudo inicializar completamente el panel.

                    <button
                        type="button"
                        id="retryInitializationButton"
                    >
                        Reintentar
                    </button>

                </td>

            </tr>
        `;


        const retryButton =
            document.getElementById(
                'retryInitializationButton'
            );


        if (retryButton) {

            retryButton.addEventListener(
                'click',
                initializePage
            );
        }
    }
}


// ========================================
// INICIAR
// ========================================

initializePage();