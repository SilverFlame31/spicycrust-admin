<?php

// ========================================
// CONFIGURACIÓN DE LA API SPICYCRUST
// ========================================
//
// En desarrollo local se usa localhost:8080.
// En producción puedes definir estas variables
// de entorno sin modificar los endpoints:
//
// SPICYCRUST_API_BASE_URL
// SPICYCRUST_ADMIN_KEY
// ========================================

return [
    'base_url' =>
        rtrim(
            getenv('SPICYCRUST_API_BASE_URL')
                ?: 'http://localhost:8080/api/v1',
            '/'
        ),

    'admin_key' =>
        getenv('SPICYCRUST_ADMIN_KEY')
            ?: 'change-me-before-production'
];
