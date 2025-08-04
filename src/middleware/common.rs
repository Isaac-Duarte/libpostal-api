use axum::{extract::Request, middleware::Next, response::Response};
use tower_http::cors::{Any, CorsLayer};
use uuid::Uuid;

/// Add request ID to headers
pub async fn request_id_middleware(mut req: Request, next: Next) -> Response {
    let request_id = Uuid::new_v4().to_string();

    // Store request ID in extensions for handlers to access
    req.extensions_mut().insert(request_id.clone());

    let mut response = next.run(req).await;

    // Add request ID to response headers
    response
        .headers_mut()
        .insert("x-request-id", request_id.parse().unwrap());

    response
}

/// Create CORS layer for libpostal.pendejo.dev
pub fn create_cors_layer() -> CorsLayer {
    CorsLayer::new()
        .allow_origin([
            "https://libpostal.pendejo.dev".parse().unwrap(),
            "http://localhost:3000".parse().unwrap(), // For development
        ])
        .allow_methods(Any)
        .allow_headers(Any)
        .expose_headers([axum::http::HeaderName::from_static("x-request-id")])
}
