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
$startsAt = trim($input['starts_at'] ?? '');
$endsAt = trim($input['ends_at'] ?? '');
$status = trim($input['status'] ?? 'active');

if (
    $name === '' ||
    $slug === '' ||
    $startsAt === '' ||
    $endsAt === ''
) {
    http_response_code(400);

    echo json_encode([
        'success' => false,
        'message' => 'Todos los campos son obligatorios.'
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

if (!in_array($status, ['active', 'completed'], true)) {
    http_response_code(400);

    echo json_encode([
        'success' => false,
        'message' => 'Estado inválido.'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

$startTimestamp = strtotime($startsAt);
$endTimestamp = strtotime($endsAt);

if (
    $startTimestamp === false ||
    $endTimestamp === false ||
    $endTimestamp <= $startTimestamp
) {
    http_response_code(400);

    echo json_encode([
        'success' => false,
        'message' =>
            'La fecha de término debe ser posterior a la fecha de inicio.'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

// ========================================
// CREAR TEMPORADA MEDIANTE API V2
// ========================================

$result = spicycrustApiRequest(
    'POST',
    '/seasons',
    [],
    [
        'name' => $name,
        'slug' => $slug,
        'starts_at' => $startsAt,
        'ends_at' => $endsAt,
        'status' => $status
    ],
    true
);

if (!$result['ok']) {
    spicycrustApiFail(
        $result,
        'No se pudo crear la temporada.'
    );
}

echo json_encode([
    'success' => true,
    'message' => 'Temporada creada correctamente.'
], JSON_UNESCAPED_UNICODE);
