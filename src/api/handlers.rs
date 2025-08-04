use axum::{extract::Extension, Json};
use std::time::Instant;
use tracing::info;
use utoipa::OpenApi;

use crate::{error::ApiResult, models::*, services::LibPostalService};

/// Parse an address into components
#[utoipa::path(
    post,
    path = "/api/v1/parse",
    request_body = ParseRequest,
    responses(
        (status = 200, description = "Address parsed successfully", body = ApiResponse<ParsedAddressResponse>),
        (status = 400, description = "Invalid input"),
        (status = 429, description = "Rate limit exceeded"),
        (status = 500, description = "Internal server error")
    ),
    tag = "Address Processing"
)]
pub async fn parse_address(
    Extension(request_id): Extension<String>,
    Json(request): Json<ParseRequest>,
) -> ApiResult<Json<ApiResponse<ParsedAddressResponse>>> {
    let start_time = Instant::now();

    // Validate request
    request
        .validate()
        .map_err(crate::error::ApiError::InvalidInput)?;

    info!(
        request_id = %request_id,
        address = %request.address,
        "Processing parse request"
    );

    // Get LibPostal service
    let service = LibPostalService::global()?;

    // Parse the address
    let parsed = service.parse_address(
        &request.address,
        request.language.as_deref(),
        request.country.as_deref(),
    ).await?;

    let response_data = ParsedAddressResponse {
        original: request.address,
        components: AddressComponents::from(parsed),
    };

    let processing_time = start_time.elapsed().as_millis() as u64;
    let response = ApiResponse::new(response_data, request_id, processing_time);

    info!(
        request_id = %response.meta.request_id,
        processing_time_ms = processing_time,
        "Parse request completed successfully"
    );

    Ok(Json(response))
}

/// Normalize an address with expansions
#[utoipa::path(
    post,
    path = "/api/v1/normalize",
    request_body = NormalizeRequest,
    responses(
        (status = 200, description = "Address normalized successfully", body = ApiResponse<NormalizedAddressResponse>),
        (status = 400, description = "Invalid input"),
        (status = 429, description = "Rate limit exceeded"),
        (status = 500, description = "Internal server error")
    ),
    tag = "Address Processing"
)]
pub async fn normalize_address(
    Extension(request_id): Extension<String>,
    Json(request): Json<NormalizeRequest>,
) -> ApiResult<Json<ApiResponse<NormalizedAddressResponse>>> {
    let start_time = Instant::now();

    // Validate request
    request
        .validate()
        .map_err(crate::error::ApiError::InvalidInput)?;

    info!(
        request_id = %request_id,
        address = %request.address,
        level = ?request.level,
        "Processing normalize request"
    );

    // Get LibPostal service
    let service = LibPostalService::global()?;

    // Normalize the address
    let normalized = service.normalize_address(
        &request.address,
        request.level.as_deref(),
        request.languages.as_deref(),
    ).await?;

    let expansion_count = normalized.expansions.len();
    let response_data = NormalizedAddressResponse {
        original: normalized.original,
        expansions: normalized.expansions,
        expansion_count,
    };

    let processing_time = start_time.elapsed().as_millis() as u64;
    let response = ApiResponse::new(response_data, request_id, processing_time);

    info!(
        request_id = %response.meta.request_id,
        processing_time_ms = processing_time,
        expansion_count = expansion_count,
        "Normalize request completed successfully"
    );

    Ok(Json(response))
}

/// Health check endpoint
#[utoipa::path(
    get,
    path = "/api/v1/health",
    responses(
        (status = 200, description = "Service is healthy", body = ApiResponse<HealthResponse>),
        (status = 503, description = "Service unavailable")
    ),
    tag = "Health"
)]
pub async fn health_check(
    Extension(request_id): Extension<String>,
) -> ApiResult<Json<ApiResponse<HealthResponse>>> {
    let start_time = Instant::now();

    // Get LibPostal service and check health
    let service = LibPostalService::global()?;
    service.health_check().await?;

    // Get system info (simplified - in production you might want actual memory stats)
    let response_data = HealthResponse {
        status: "healthy".to_string(),
        libpostal_status: "ready".to_string(),
    };

    let processing_time = start_time.elapsed().as_millis() as u64;
    let response = ApiResponse::new(response_data, request_id, processing_time);

    Ok(Json(response))
}

/// API documentation
#[derive(OpenApi)]
#[openapi(
    paths(
        parse_address,
        normalize_address,
        health_check
    ),
    components(
        schemas(
            ParseRequest,
            NormalizeRequest,
            ApiResponse<ParsedAddressResponse>,
            ApiResponse<NormalizedAddressResponse>,
            ApiResponse<HealthResponse>,
            ParsedAddressResponse,
            NormalizedAddressResponse,
            HealthResponse,
            AddressComponents,
            ResponseMeta,
            MemoryInfo
        )
    ),
    tags(
        (name = "Address Processing", description = "Address parsing and normalization endpoints"),
        (name = "Health", description = "Service health and monitoring endpoints")
    ),
    info(
        title = "LibPostal API",
        version = "1.0.0",
        description = "Free address parsing and normalization API powered by libpostal",
        contact(
            name = "API Support",
            url = "https://libpostal.pendejo.dev"
        )
    ),
    servers(
        (url = "https://libpostal.pendejo.dev", description = "Production server"),
        (url = "http://localhost:3000", description = "Development server")
    )
)]
pub struct ApiDoc;
