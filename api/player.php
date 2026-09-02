<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/api-client.php';

// ========================================
// PARÁMETROS
// ========================================

$playerId = $_GET['id'] ?? null;
$gameSlug = trim($_GET['game'] ?? '');
$seasonSlug = trim($_GET['season'] ?? '');

if (!$playerId) {
    http_response_code(400);

    echo json_encode([
        'success' => false,
        'message' => 'Falta el ID del jugador.'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

$query = [];

if ($gameSlug !== '') {
    $query['game'] = $gameSlug;
}

if ($seasonSlug !== '') {
    $query['season'] = $seasonSlug;
}

// ========================================
// CONSULTAR API V2
// ========================================

$result = spicycrustApiRequest(
    'GET',
    '/players/' . urlencode((string) $playerId),
    $query
);

if (!$result['ok']) {
    spicycrustApiFail(
        $result,
        'No se pudo obtener el jugador.'
    );
}

$data = is_array($result['data'])
    ? $result['data']
    : [];

// ========================================
// RESPUESTA COMPATIBLE CON EL FRONTEND
// ========================================

echo json_encode([
    'success' => true,
    'player' => $data['player'] ?? null,
    'scores' => $data['scores'] ?? []
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
