<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/api-client.php';

// ========================================
// FILTRO OPCIONAL POR ESTADO
// ========================================

$status = trim($_GET['status'] ?? '');

if (
    $status !== '' &&
    !in_array($status, ['active', 'inactive'], true)
) {
    http_response_code(400);

    echo json_encode([
        'success' => false,
        'message' => 'Estado inválido.'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

$query = [];

if ($status !== '') {
    $query['status'] = $status;
}

// ========================================
// CONSULTAR API V2
// ========================================

$result = spicycrustApiRequest(
    'GET',
    '/games',
    $query
);

if (!$result['ok']) {
    spicycrustApiFail(
        $result,
        'No se pudieron obtener los juegos.'
    );
}

$games = is_array($result['data'])
    ? $result['data']
    : [];

foreach ($games as &$game) {
    $game['score_count'] =
        (int) ($game['score_count'] ?? 0);
}
unset($game);

// ========================================
// RESPUESTA COMPATIBLE CON EL FRONTEND
// ========================================

echo json_encode([
    'success' => true,
    'status_filter' => $status !== '' ? $status : null,
    'games' => $games
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
