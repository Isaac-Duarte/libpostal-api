use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde_json::json;
use std::fmt;
use tracing::error;

/// Custom error type for the API
#[derive(Debug)]
pub enum ApiError {
    /// LibPostal related errors
    LibPostal(libpostal_rs::Error),
    /// Invalid input data
    InvalidInput(String),
    /// Rate limit exceeded
    RateLimitExceeded,
    /// Internal server error
    Internal(String),
    /// Service unavailable
    ServiceUnavailable(String),
}

impl fmt::Display for ApiError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            ApiError::LibPostal(err) => write!(f, "LibPostal error: {err}"),
            ApiError::InvalidInput(msg) => write!(f, "Invalid input: {msg}"),
            ApiError::RateLimitExceeded => write!(f, "Rate limit exceeded"),
            ApiError::Internal(msg) => write!(f, "Internal error: {msg}"),
            ApiError::ServiceUnavailable(msg) => write!(f, "Service unavailable: {msg}"),
        }
    }
}

impl std::error::Error for ApiError {}

impl From<libpostal_rs::Error> for ApiError {
    fn from(err: libpostal_rs::Error) -> Self {
        ApiError::LibPostal(err)
    }
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let (status, error_message, error_code) = match &self {
            ApiError::LibPostal(_) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Address processing failed",
                "LIBPOSTAL_ERROR",
            ),
            ApiError::InvalidInput(msg) => (StatusCode::BAD_REQUEST, msg.as_str(), "INVALID_INPUT"),
            ApiError::RateLimitExceeded => (
                StatusCode::TOO_MANY_REQUESTS,
                "Rate limit exceeded. Maximum 10 requests per second per IP",
                "RATE_LIMIT_EXCEEDED",
            ),
            ApiError::Internal(_) => (
                StatusCode::INTERNAL_SERVER_ERROR,
                "Internal server error",
                "INTERNAL_ERROR",
            ),
            ApiError::ServiceUnavailable(_) => (
                StatusCode::SERVICE_UNAVAILABLE,
                "Service temporarily unavailable",
                "SERVICE_UNAVAILABLE",
            ),
        };

        // Log the error for debugging
        error!(
            error = %self,
            status_code = %status,
            "API error occurred"
        );

        let body = Json(json!({
            "success": false,
            "error": {
                "code": error_code,
                "message": error_message,
                "timestamp": chrono::Utc::now().to_rfc3339()
            }
        }));

        (status, body).into_response()
    }
}

pub type ApiResult<T> = Result<T, ApiError>;
