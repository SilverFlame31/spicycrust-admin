<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/api-client.php';

// ========================================
// SOLO PERMITIR PATCH
// ========================================

if ($_SERVER['REQUEST_METHOD'] !== 'PATCH') {
    http_response_code(405);

    echo json_encode([
        'success' => false,
        'message' => 'Método no permitido.'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// ========================================
// LEER Y VALIDAR DATOS
// ========================================

$input = json_decode(
    file_get_contents('php://input'),
    true
);

if (!is_array($input)) {
    http_response_code(400);

    echo json_encode([
        'success' => false,
        'message' => 'JSON inválido.'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

$gameId = $input['game_id'] ?? null;
$status = trim($input['status'] ?? '');

if (!$gameId) {
    http_response_code(400);

    echo json_encode([
        'success' => false,
        'message' => 'Falta el ID del juego.'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

if (!in_array($status, ['active', 'inactive'], true)) {
    http_response_code(400);

    echo json_encode([
        'success' => false,
        'message' => 'Estado inválido.'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// ========================================
// ACTUALIZAR ESTADO MEDIANTE API V2
// ========================================

$result = spicycrustApiRequest(
    'PATCH',
    '/games/' . urlencode((string) $gameId),
    [],
    ['status' => $status],
    true
);

if (!$result['ok']) {
    spicycrustApiFail(
        $result,
        'No se pudo actualizar el estado del juego.'
    );
}

echo json_encode([
    'success' => true,
    'message' =>
        'Estado del juego actualizado correctamente.'
], JSON_UNESCAPED_UNICODE);
