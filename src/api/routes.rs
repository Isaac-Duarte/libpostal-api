use axum::{
    routing::{get, post},
    Router,
};

use crate::api::handlers;

/// Create API routes
pub fn create_api_routes() -> Router {
    Router::new()
        .route("/parse", post(handlers::parse_address))
        .route("/normalize", post(handlers::normalize_address))
        .route("/health", get(handlers::health_check))
}
