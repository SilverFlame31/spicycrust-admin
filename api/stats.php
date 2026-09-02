<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/api-client.php';

// ========================================
// FILTROS OPCIONALES
// ========================================

$gameSlug = trim($_GET['game'] ?? '');
$seasonSlug = trim($_GET['season'] ?? '');

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
// La API V2 debe aceptar game y season para
// mantener las estadísticas filtradas del panel.
// ========================================

$result = spicycrustApiRequest(
    'GET',
    '/stats',
    $query
);

if (!$result['ok']) {
    spicycrustApiFail(
        $result,
        'No se pudieron obtener las estadísticas.'
    );
}

$stats = is_array($result['data'])
    ? $result['data']
    : [];

// ========================================
// RESPUESTA COMPATIBLE CON EL FRONTEND
// ========================================

echo json_encode([
    'success' => true,
    'stats' => [
        'total_players' =>
            (int) ($stats['total_players'] ?? 0),
        'total_scores' =>
            (int) ($stats['total_scores'] ?? 0),
        'highest_score' =>
            (int) ($stats['highest_score'] ?? 0),
        'scores_today' =>
            (int) ($stats['scores_today'] ?? 0)
    ]
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
