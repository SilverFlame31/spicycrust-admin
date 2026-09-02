<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../config/api-client.php';

// ========================================
// SOLO PERMITIR POST
// ========================================

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
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

$name = trim($input['name'] ?? '');
$slug = trim($input['slug'] ?? '');
$description = trim($input['description'] ?? '');
$status = trim($input['status'] ?? 'active');

if ($name === '' || $slug === '') {
    http_response_code(400);

    echo json_encode([
        'success' => false,
        'message' =>
            'El nombre y el identificador son obligatorios.'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

if (!preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $slug)) {
    http_response_code(400);

    echo json_encode([
        'success' => false,
        'message' =>
            'El identificador solo puede contener letras minúsculas, números y guiones.'
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
// CREAR JUEGO MEDIANTE API V2
// ========================================

$result = spicycrustApiRequest(
    'POST',
    '/games',
    [],
    [
        'name' => $name,
        'slug' => $slug,
        'description' => $description,
        'status' => $status
    ],
    true
);

if (!$result['ok']) {
    spicycrustApiFail(
        $result,
        'No se pudo crear el juego.'
    );
}

$game = is_array($result['data'])
    ? $result['data']
    : [];

// ========================================
// RESPUESTA COMPATIBLE CON EL FRONTEND
// ========================================
// La API key original se muestra una sola vez.
// ========================================

echo json_encode([
    'success' => true,
    'message' => 'Juego creado correctamente.',
    'game' => [
        'id' => (int) ($game['id'] ?? 0),
        'name' => $game['name'] ?? $name,
        'slug' => $game['slug'] ?? $slug,
        'status' => $game['status'] ?? $status
    ],
    'api_key' => $game['api_key'] ?? null
], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
