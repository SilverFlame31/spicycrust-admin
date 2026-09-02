<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/api-client.php';

// ========================================
// SOLO PERMITIR DELETE
// ========================================

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
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

if (!$gameId) {
    http_response_code(400);

    echo json_encode([
        'success' => false,
        'message' => 'Falta el ID del juego.'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// ========================================
// ELIMINAR MEDIANTE API V2
// ========================================
// La API bloquea la eliminación si el juego
// ya tiene puntajes registrados.
// ========================================

$result = spicycrustApiRequest(
    'DELETE',
    '/games/' . urlencode((string) $gameId),
    [],
    null,
    true
);

if (!$result['ok']) {
    spicycrustApiFail(
        $result,
        'No se pudo eliminar el juego.'
    );
}

echo json_encode([
    'success' => true,
    'message' => 'Juego eliminado correctamente.'
], JSON_UNESCAPED_UNICODE);
