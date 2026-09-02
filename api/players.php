<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/api-client.php';

// ========================================
// BÚSQUEDA OPCIONAL
// ========================================

$search = trim($_GET['search'] ?? '');
$query = [];

if ($search !== '') {
    $query['search'] = $search;
}

// ========================================
// CONSULTAR API V2
// ========================================

$result = spicycrustApiRequest(
    'GET',
    '/players',
    $query
);

if (!$result['ok']) {
    spicycrustApiFail(
        $result,
        'No se pudieron obtener los jugadores.'
    );
}

$data = is_array($result['data'])
    ? $result['data']
    : [];

$players = is_array($data['players'] ?? null)
    ? $data['players']
    : [];

// Conserva el orden alfabético que utilizaba
// el panel antes de migrar a la API V2.
usort(
    $players,
    static function (array $a, array $b): int {
        $nicknameComparison = strcasecmp(
            (string) ($a['nickname'] ?? ''),
            (string) ($b['nickname'] ?? '')
        );

        if ($nicknameComparison !== 0) {
            return $nicknameComparison;
        }

        return strcasecmp(
            (string) ($a['email'] ?? ''),
            (string) ($b['email'] ?? '')
        );
    }
);

// ========================================
// RESPUESTA COMPATIBLE CON EL FRONTEND
// ========================================

echo json_encode([
    'success' => true,
    'search' => $search,
    'total' => count($players),
    'players' => $players
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
