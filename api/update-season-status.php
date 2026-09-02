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

$seasonId = $input['season_id'] ?? null;
$status = trim($input['status'] ?? '');

if (!$seasonId) {
    http_response_code(400);

    echo json_encode([
        'success' => false,
        'message' => 'Falta el ID de la temporada.'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

if (!in_array($status, ['active', 'completed'], true)) {
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
    '/seasons/' . urlencode((string) $seasonId),
    [],
    ['status' => $status],
    true
);

if (!$result['ok']) {
    spicycrustApiFail(
        $result,
        'No se pudo actualizar la temporada.'
    );
}

echo json_encode([
    'success' => true,
    'message' =>
        'Estado de temporada actualizado correctamente.'
], JSON_UNESCAPED_UNICODE);
