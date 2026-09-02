// ========================================
// ELEMENTOS DEL DOM
// ========================================

const gameForm =
    document.getElementById('gameForm');

const gameName =
    document.getElementById('gameName');

const gameSlug =
    document.getElementById('gameSlug');

const gameDescription =
    document.getElementById('gameDescription');

const gameStatus =
    document.getElementById('gameStatus');

const gameFormMessage =
    document.getElementById('gameFormMessage');

const gameTableBody =
    document.getElementById('gameTableBody');


const apiKeyResult =
    document.getElementById('apiKeyResult');

const apiKeyGameName =
    document.getElementById('apiKeyGameName');

const generatedApiKey =
    document.getElementById('generatedApiKey');


// ========================================
// CARGAR JUEGOS
// ========================================

async function loadGamesAdmin() {

    gameTableBody.innerHTML = `
        <tr>
            <td colspan="6">
                Cargando juegos...
            </td>
        </tr>
    `;


    try {

        const response =
            await fetch('api/games.php');


        const data =
            await response.json();


        if (!data.success) {

            showGamesError();

            return;
        }


        renderGames(
            data.games
        );

    } catch (error) {

        console.error(
            'Error al cargar juegos:',
            error
        );


        showGamesError();
    }
}


// ========================================
// MOSTRAR JUEGOS
// ========================================

function renderGames(games) {

    gameTableBody.innerHTML = '';


    if (games.length === 0) {

        gameTableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    No existen juegos.
                </td>
            </tr>
        `;

        return;
    }


    games.forEach(
        (game) => {

            const row =
                document.createElement('tr');


            row.innerHTML = `
                <td>
                    ${game.name}
                </td>

                <td>
                    ${game.slug}
                </td>

                <td>
                    ${game.description || '-'}
                </td>

                <td>
                    ${formatGameStatus(
                        game.status
                    )}
                </td>

                <td>
                    ${Number(
                        game.score_count
                    ).toLocaleString()}
                </td>

                <td>
                    ${createGameActions(
                        game
                    )}
                </td>
            `;


            gameTableBody.appendChild(
                row
            );
        }
    );
}


// ========================================
// ACCIONES
// ========================================

function createGameActions(game) {

    let statusButton;


    if (game.status === 'active') {

        statusButton = `
            <button
                type="button"
                class="game-status-button"
                data-game-id="${game.id}"
                data-new-status="inactive"
            >
                Desactivar
            </button>
        `;

    } else {

        statusButton = `
            <button
                type="button"
                class="game-status-button"
                data-game-id="${game.id}"
                data-new-status="active"
            >
                Reactivar
            </button>
        `;
    }


    let deleteButton = '';


    if (Number(game.score_count) === 0) {

        deleteButton = `
            <button
                type="button"
                class="delete-game-button"
                data-game-id="${game.id}"
                data-game-name="${game.name}"
            >
                Eliminar
            </button>
        `;
    }


    return `
        ${statusButton}
        ${deleteButton}
    `;
}


// ========================================
// FORMATEAR ESTADO
// ========================================

function formatGameStatus(status) {

    if (status === 'active') {
        return 'Activo';
    }


    if (status === 'inactive') {
        return 'Inactivo';
    }


    return status;
}


// ========================================
// ERROR
// ========================================

function showGamesError() {

    gameTableBody.innerHTML = `
        <tr>
            <td colspan="6">
                No se pudieron cargar los juegos.
            </td>
        </tr>
    `;
}


// ========================================
// GENERAR IDENTIFICADOR DESDE EL NOMBRE
// ========================================

gameName.addEventListener(
    'input',
    () => {

        const slug =
            gameName.value
                .toLowerCase()
                .trim()
                .normalize('NFD')
                .replace(
                    /[\u0300-\u036f]/g,
                    ''
                )
                .replace(
                    /[^a-z0-9]+/g,
                    '-'
                )
                .replace(
                    /^-+|-+$/g,
                    ''
                );


        gameSlug.value =
            slug;
    }
);


// ========================================
// CREAR JUEGO
// ========================================

gameForm.addEventListener(
    'submit',
    async (event) => {

        event.preventDefault();


        gameFormMessage.textContent =
            'Creando juego...';


        apiKeyResult.hidden =
            true;


        const gameData = {

            name:
                gameName.value.trim(),

            slug:
                gameSlug.value.trim(),

            description:
                gameDescription.value.trim(),

            status:
                gameStatus.value
        };


        try {

            const response =
                await fetch(
                    'api/create-game.php',
                    {
                        method: 'POST',

                        headers: {
                            'Content-Type':
                                'application/json'
                        },

                        body:
                            JSON.stringify(
                                gameData
                            )
                    }
                );


            const data =
                await response.json();


            if (!data.success) {

                gameFormMessage.textContent =
                    data.message ||
                    'No se pudo crear el juego.';

                return;
            }


            gameFormMessage.textContent =
                'Juego creado correctamente.';


            // ========================================
            // MOSTRAR CLAVE DE API UNA SOLA VEZ
            // ========================================

            apiKeyGameName.textContent =
                data.game.name;


            generatedApiKey.value =
                data.api_key;


            apiKeyResult.hidden =
                false;


            // ========================================
            // LIMPIAR FORMULARIO
            // ========================================

            gameForm.reset();


            // ========================================
            // ACTUALIZAR TABLA
            // ========================================

            await loadGamesAdmin();

        } catch (error) {

            console.error(
                'Error al crear juego:',
                error
            );


            gameFormMessage.textContent =
                'Ocurrió un error al crear el juego.';
        }
    }
);


// ========================================
// CAMBIAR ESTADO
// ========================================

gameTableBody.addEventListener(
    'click',
    async (event) => {

        const statusButton =
            event.target.closest(
                '.game-status-button'
            );


        if (statusButton) {

            await changeGameStatus(
                statusButton
            );

            return;
        }


        const deleteButton =
            event.target.closest(
                '.delete-game-button'
            );


        if (deleteButton) {

            await deleteGame(
                deleteButton
            );
        }
    }
);


// ========================================
// ACTIVAR / DESACTIVAR
// ========================================

async function changeGameStatus(button) {

    const gameId =
        button.dataset.gameId;

    const newStatus =
        button.dataset.newStatus;


    let message;


    if (newStatus === 'inactive') {

        message =
            '¿Deseas desactivar este juego? Sus puntajes históricos seguirán disponibles.';

    } else {

        message =
            '¿Deseas reactivar este juego?';
    }


    if (!confirm(message)) {
        return;
    }


    button.disabled =
        true;

    button.textContent =
        'Actualizando...';


    try {

        const response =
            await fetch(
                'api/update-game-status.php',
                {
                    method: 'PATCH',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body:
                        JSON.stringify({
                            game_id:
                                gameId,

                            status:
                                newStatus
                        })
                }
            );


        const data =
            await response.json();


        if (!data.success) {

            alert(
                data.message ||
                'No se pudo actualizar el juego.'
            );

            await loadGamesAdmin();

            return;
        }


        await loadGamesAdmin();

    } catch (error) {

        console.error(
            'Error al actualizar juego:',
            error
        );


        alert(
            'Ocurrió un error al actualizar el juego.'
        );


        await loadGamesAdmin();
    }
}


// ========================================
// ELIMINAR JUEGO
// ========================================

async function deleteGame(button) {

    const gameId =
        button.dataset.gameId;

    const gameNameValue =
        button.dataset.gameName;


    const confirmed =
        confirm(
            `¿Eliminar "${gameNameValue}" permanentemente? Esta acción no se puede deshacer.`
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
                'api/delete-game.php',
                {
                    method: 'DELETE',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body:
                        JSON.stringify({
                            game_id:
                                gameId
                        })
                }
            );


        const data =
            await response.json();


        if (!data.success) {

            alert(
                data.message ||
                'No se pudo eliminar el juego.'
            );


            await loadGamesAdmin();

            return;
        }


        alert(
            'Juego eliminado correctamente.'
        );


        await loadGamesAdmin();

    } catch (error) {

        console.error(
            'Error al eliminar juego:',
            error
        );


        alert(
            'Ocurrió un error al eliminar el juego.'
        );


        await loadGamesAdmin();
    }
}


// ========================================
// INICIALIZAR
// ========================================

loadGamesAdmin();