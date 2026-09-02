<?php

require_once __DIR__ . '/config/api-client.php';

// ========================================
// COMPROBAR CONEXIÓN CON LA API V2
// ========================================

$result = spicycrustApiRequest(
    'GET',
    '/health'
);

if (!$result['ok']) {
    http_response_code(502);
    echo 'No se pudo conectar con la API de SpicyCrust.';
    exit;
}

echo 'Conexión con la API de SpicyCrust exitosa.';
