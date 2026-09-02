<?php

// ========================================
// CLIENTE COMPARTIDO PARA API V2
// ========================================

function spicycrustApiRequest(
    string $method,
    string $path,
    array $query = [],
    ?array $body = null,
    bool $useAdminKey = false
): array {

    $config = require __DIR__ . '/api.php';

    $url =
        $config['base_url'] .
        '/' .
        ltrim($path, '/');

    if ($query !== []) {
        $url .= '?' . http_build_query($query);
    }

    $headers = [
        'Accept: application/json'
    ];

    if ($body !== null) {
        $headers[] = 'Content-Type: application/json';
    }

    if ($useAdminKey) {
        $headers[] =
            'X-Admin-Key: ' .
            $config['admin_key'];
    }

    $ch = curl_init();

    curl_setopt_array(
        $ch,
        [
            CURLOPT_URL => $url,
            CURLOPT_CUSTOMREQUEST => strtoupper($method),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 10,
            CURLOPT_CONNECTTIMEOUT => 5,
            CURLOPT_HTTPHEADER => $headers
        ]
    );

    if ($body !== null) {
        curl_setopt(
            $ch,
            CURLOPT_POSTFIELDS,
            json_encode(
                $body,
                JSON_UNESCAPED_UNICODE |
                JSON_UNESCAPED_SLASHES
            )
        );
    }

    $rawResponse = curl_exec($ch);

    $httpCode =
        (int) curl_getinfo(
            $ch,
            CURLINFO_HTTP_CODE
        );

    $curlError = curl_error($ch);

    curl_close($ch);

    if ($rawResponse === false) {
        return [
            'ok' => false,
            'http_code' => 502,
            'data' => null,
            'message' =>
                'No se pudo conectar con la API de SpicyCrust.',
            'details' => $curlError
        ];
    }

    $data = json_decode($rawResponse, true);

    if (!is_array($data)) {
        return [
            'ok' => false,
            'http_code' => 502,
            'data' => null,
            'message' =>
                'La API devolvió una respuesta inválida.',
            'details' => null
        ];
    }

    $success =
        $httpCode >= 200 &&
        $httpCode < 300 &&
        !empty($data['success']);

    if (!$success) {
        return [
            'ok' => false,
            'http_code' =>
                $httpCode >= 400
                    ? $httpCode
                    : 502,
            'data' => $data,
            'message' =>
                $data['error']['message']
                    ?? 'La API devolvió un error.',
            'details' =>
                $data['error']['details']
                    ?? null
        ];
    }

    return [
        'ok' => true,
        'http_code' => $httpCode,
        'data' => $data['data'] ?? null,
        'message' => null,
        'details' => null
    ];
}


// ========================================
// RESPUESTA DE ERROR PARA EL FRONTEND
// ========================================

function spicycrustApiFail(
    array $result,
    string $fallbackMessage
): never {

    http_response_code(
        (int) ($result['http_code'] ?? 502)
    );

    echo json_encode(
        [
            'success' => false,
            'message' =>
                $result['message']
                    ?: $fallbackMessage
        ],
        JSON_PRETTY_PRINT |
        JSON_UNESCAPED_UNICODE
    );

    exit;
}
