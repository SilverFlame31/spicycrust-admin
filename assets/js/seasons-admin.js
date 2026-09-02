// ========================================
// ELEMENTOS DEL DOM
// ========================================

const seasonForm =
    document.getElementById(
        'seasonForm'
    );

const seasonName =
    document.getElementById(
        'seasonName'
    );

const seasonSlug =
    document.getElementById(
        'seasonSlug'
    );

const seasonStartsAt =
    document.getElementById(
        'seasonStartsAt'
    );

const seasonEndsAt =
    document.getElementById(
        'seasonEndsAt'
    );

const seasonStatus =
    document.getElementById(
        'seasonStatus'
    );

const seasonFormMessage =
    document.getElementById(
        'seasonFormMessage'
    );

const seasonTableBody =
    document.getElementById(
        'seasonTableBody'
    );

const seasonTableMessage =
    document.getElementById(
        'seasonTableMessage'
    );

const createSeasonButton =
    document.getElementById(
        'createSeasonButton'
    );


// ========================================
// VARIABLES
// ========================================

let seasonRequestRunning =
    false;


// ========================================
// GENERAR IDENTIFICADOR
// ========================================

function generateSlug(
    text
) {

    return text
        .toLowerCase()
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
}


// ========================================
// NOMBRE → IDENTIFICADOR
// ========================================

seasonName.addEventListener(
    'input',
    () => {

        seasonSlug.value =
            generateSlug(
                seasonName.value
            );
    }
);


// ========================================
// CARGAR TEMPORADAS
// ========================================

async function loadSeasons() {

    seasonTableBody.innerHTML = `
        <tr>
            <td colspan="6">
                Cargando temporadas...
            </td>
        </tr>
    `;


    seasonTableMessage.textContent =
        '';


    try {

        const response =
            await fetch(
                'api/seasons.php'
            );


        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}`
            );
        }


        const data =
            await response.json();


        if (!data.success) {

            throw new Error(
                data.message ||
                'No se pudieron cargar las temporadas.'
            );
        }


        renderSeasons(
            data.seasons
        );

    } catch (error) {

        console.error(
            'Error al cargar temporadas:',
            error
        );


        seasonTableBody.innerHTML = `
            <tr>

                <td colspan="6">

                    No se pudieron cargar las temporadas.

                    <button
                        type="button"
                        id="retrySeasonsButton"
                    >
                        Reintentar
                    </button>

                </td>

            </tr>
        `;


        const retryButton =
            document.getElementById(
                'retrySeasonsButton'
            );


        if (retryButton) {

            retryButton.addEventListener(
                'click',
                loadSeasons
            );
        }
    }
}


// ========================================
// MOSTRAR TEMPORADAS
// ========================================

function renderSeasons(
    seasons
) {

    seasonTableBody.innerHTML =
        '';


    if (
        seasons.length === 0
    ) {

        seasonTableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    No hay temporadas registradas.
                </td>
            </tr>
        `;

        return;
    }


    seasons.forEach(
        (season) => {

            const row =
                document.createElement(
                    'tr'
                );


            // ========================================
            // NOMBRE
            // ========================================

            const nameCell =
                document.createElement(
                    'td'
                );


            nameCell.textContent =
                season.name;


            // ========================================
            // IDENTIFICADOR
            // ========================================

            const slugCell =
                document.createElement(
                    'td'
                );


            slugCell.textContent =
                season.slug;


            // ========================================
            // INICIO
            // ========================================

            const startsCell =
                document.createElement(
                    'td'
                );


            startsCell.textContent =
                season.starts_at;


            // ========================================
            // TÉRMINO
            // ========================================

            const endsCell =
                document.createElement(
                    'td'
                );


            endsCell.textContent =
                season.ends_at;


            // ========================================
            // ESTADO
            // ========================================

            const statusCell =
                document.createElement(
                    'td'
                );


            statusCell.textContent =
                season.status === 'active'
                    ? 'Activa'
                    : 'Completada';


            // ========================================
            // ACCIONES
            // ========================================

            const actionsCell =
                document.createElement(
                    'td'
                );


            // BOTÓN ACTIVA / COMPLETADA

            const statusButton =
                document.createElement(
                    'button'
                );


            statusButton.type =
                'button';


            statusButton.className =
                'season-status-button';


            statusButton.dataset.seasonId =
                season.id;


            statusButton.dataset.currentStatus =
                season.status;


            if (
                season.status ===
                'active'
            ) {

                statusButton.textContent =
                    'Completar';

            } else {

                statusButton.textContent =
                    'Reactivar';
            }


            actionsCell.appendChild(
                statusButton
            );


            // ========================================
            // BOTÓN ELIMINAR
            // ========================================

            const deleteButton =
                document.createElement(
                    'button'
                );


            deleteButton.type =
                'button';


            deleteButton.className =
                'delete-season-button';


            deleteButton.dataset.seasonId =
                season.id;


            deleteButton.dataset.seasonName =
                season.name;


            deleteButton.textContent =
                'Eliminar';


            actionsCell.appendChild(
                deleteButton
            );


            // ========================================
            // AGREGAR CELDAS
            // ========================================

            row.appendChild(
                nameCell
            );

            row.appendChild(
                slugCell
            );

            row.appendChild(
                startsCell
            );

            row.appendChild(
                endsCell
            );

            row.appendChild(
                statusCell
            );

            row.appendChild(
                actionsCell
            );


            seasonTableBody.appendChild(
                row
            );
        }
    );
}


// ========================================
// CREAR TEMPORADA
// ========================================

seasonForm.addEventListener(
    'submit',
    async (event) => {

        event.preventDefault();


        if (
            seasonRequestRunning
        ) {

            return;
        }


        const name =
            seasonName.value.trim();

        const slug =
            seasonSlug.value.trim();

        const startsAt =
            seasonStartsAt.value;

        const endsAt =
            seasonEndsAt.value;

        const status =
            seasonStatus.value;


        if (
            !name ||
            !slug ||
            !startsAt ||
            !endsAt
        ) {

            seasonFormMessage.textContent =
                'Completa todos los campos.';

            return;
        }


        seasonRequestRunning =
            true;


        createSeasonButton.disabled =
            true;


        createSeasonButton.textContent =
            'Creando...';


        seasonFormMessage.textContent =
            'Creando temporada...';


        try {

            const response =
                await fetch(
                    'api/create-season.php',
                    {
                        method:
                            'POST',

                        headers: {
                            'Content-Type':
                                'application/json'
                        },

                        body:
                            JSON.stringify({
                                name:
                                    name,

                                slug:
                                    slug,

                                starts_at:
                                    startsAt,

                                ends_at:
                                    endsAt,

                                status:
                                    status
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
                    'No se pudo crear la temporada.'
                );
            }


            seasonFormMessage.textContent =
                data.message;


            seasonForm.reset();


            seasonStatus.value =
                'active';


            await loadSeasons();

        } catch (error) {

            console.error(
                'Error al crear temporada:',
                error
            );


            seasonFormMessage.textContent =
                error.message;

        } finally {

            seasonRequestRunning =
                false;


            createSeasonButton.disabled =
                false;


            createSeasonButton.textContent =
                'Crear temporada';
        }
    }
);


// ========================================
// ACCIONES DE TABLA
// ========================================

seasonTableBody.addEventListener(
    'click',
    async (event) => {

        // ========================================
        // CAMBIAR ESTADO
        // ========================================

        const statusButton =
            event.target.closest(
                '.season-status-button'
            );


        if (statusButton) {

            await changeSeasonStatus(
                statusButton
            );

            return;
        }


        // ========================================
        // ELIMINAR
        // ========================================

        const deleteButton =
            event.target.closest(
                '.delete-season-button'
            );


        if (deleteButton) {

            await deleteSeason(
                deleteButton
            );
        }
    }
);


// ========================================
// CAMBIAR ESTADO
// ========================================

async function changeSeasonStatus(
    button
) {

    if (
        seasonRequestRunning
    ) {

        return;
    }


    const seasonId =
        button.dataset.seasonId;


    const currentStatus =
        button.dataset.currentStatus;


    const newStatus =
        currentStatus === 'active'
            ? 'completed'
            : 'active';


    const actionText =
        newStatus === 'completed'
            ? 'completar'
            : 'reactivar';


    const confirmed =
        confirm(
            `¿Seguro que deseas ${actionText} esta temporada?`
        );


    if (!confirmed) {

        return;
    }


    seasonRequestRunning =
        true;


    button.disabled =
        true;


    button.textContent =
        newStatus === 'completed'
            ? 'Completando...'
            : 'Reactivando...';


    seasonTableMessage.textContent =
        'Actualizando temporada...';


    try {

        const response =
            await fetch(
                'api/update-season-status.php',
                {
                    method:
                        'PATCH',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body:
                        JSON.stringify({
                            season_id:
                                seasonId,

                            status:
                                newStatus
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
                'No se pudo actualizar la temporada.'
            );
        }


        seasonTableMessage.textContent =
            data.message;


        await loadSeasons();

    } catch (error) {

        console.error(
            'Error al actualizar temporada:',
            error
        );


        seasonTableMessage.textContent =
            error.message;


        button.disabled =
            false;


        button.textContent =
            currentStatus === 'active'
                ? 'Completar'
                : 'Reactivar';

    } finally {

        seasonRequestRunning =
            false;
    }
}


// ========================================
// ELIMINAR TEMPORADA
// ========================================

async function deleteSeason(
    button
) {

    if (
        seasonRequestRunning
    ) {

        return;
    }


    const seasonId =
        button.dataset.seasonId;


    const seasonName =
        button.dataset.seasonName;


    const confirmed =
        confirm(
            `¿Seguro que deseas eliminar permanentemente "${seasonName}"?\n\nEsta acción no se puede deshacer.`
        );


    if (!confirmed) {

        return;
    }


    seasonRequestRunning =
        true;


    button.disabled =
        true;


    button.textContent =
        'Eliminando...';


    seasonTableMessage.textContent =
        'Eliminando temporada...';


    try {

        const response =
            await fetch(
                'api/delete-season.php',
                {
                    method:
                        'DELETE',

                    headers: {
                        'Content-Type':
                            'application/json'
                    },

                    body:
                        JSON.stringify({
                            season_id:
                                seasonId
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
                'No se pudo eliminar la temporada.'
            );
        }


        seasonTableMessage.textContent =
            data.message;


        await loadSeasons();

    } catch (error) {

        console.error(
            'Error al eliminar temporada:',
            error
        );


        seasonTableMessage.textContent =
            error.message;


        button.disabled =
            false;


        button.textContent =
            'Eliminar';

    } finally {

        seasonRequestRunning =
            false;
    }
}


// ========================================
// INICIALIZAR
// ========================================

loadSeasons();