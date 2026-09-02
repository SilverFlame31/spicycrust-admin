<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/api-client.php';

// ========================================
// PARÁMETROS
// ========================================

$gameSlug = $_GET['game'] ?? 'rhythm-slice';
$seasonSlug = $_GET['season'] ?? 'season-01';
$search = trim($_GET['search'] ?? '');
$limit = (int) ($_GET['limit'] ?? 20);

$allowedLimits = [10, 20, 50, 100];

if (!in_array($limit, $allowedLimits, true)) {
    $limit = 20;
}

$query = [
    'game' => $gameSlug,
    'season' => $seasonSlug,
    'limit' => $limit
];

if ($search !== '') {
    $query['search'] = $search;
}

// ========================================
// CONSULTAR API V2
// ========================================

$result = spicycrustApiRequest(
    'GET',
    '/leaderboard',
    $query
);

if (!$result['ok']) {
    spicycrustApiFail(
        $result,
        'No se pudo obtener el leaderboard.'
    );
}

$ranking =
    is_array($result['data']['ranking'] ?? null)
        ? $result['data']['ranking']
        : [];

$leaderboard = [];

foreach ($ranking as $row) {
    $leaderboard[] = [
        'player_id' => (int) ($row['player_id'] ?? 0),
        'nickname' => $row['nickname'] ?? 'Jugador',
        'best_score' => (int) ($row['score'] ?? 0),
        'position' => (int) ($row['rank'] ?? 0)
    ];
}

// ========================================
// RESPUESTA COMPATIBLE CON EL FRONTEND
// ========================================

echo json_encode([
    'success' => true,
    'game' => $gameSlug,
    'season' => $seasonSlug,
    'search' => $search,
    'limit' => $limit,
    'leaderboard' => $leaderboard
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
