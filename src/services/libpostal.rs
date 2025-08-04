use crate::error::{ApiError, ApiResult};
use libpostal_rs::{LibPostal, LibPostalConfig, NormalizationLevel};
use std::sync::Arc;
use tokio::sync::{OnceCell, Mutex};
use tracing::{error, info, warn};

/// LibPostal service wrapper for thread-safe access
#[derive(Clone)]
pub struct LibPostalService {
    postal: Arc<Mutex<LibPostal>>,
}

static LIBPOSTAL_INSTANCE: OnceCell<LibPostalService> = OnceCell::const_new();

impl LibPostalService {
    /// Initialize the LibPostal service
    pub async fn initialize() -> ApiResult<()> {
        info!("Initializing LibPostal service...");

        let config = LibPostalConfig::builder()
            .data_dir("./data")
            .auto_download_data(true)
            .verify_data_integrity(true)
            .build();

        match LibPostal::with_config(config).await {
            Ok(postal) => {
                let service = LibPostalService {
                    postal: Arc::new(Mutex::new(postal)),
                };

                LIBPOSTAL_INSTANCE.set(service).map_err(|_| {
                    ApiError::Internal("Failed to set LibPostal instance".to_string())
                })?;

                info!("LibPostal service initialized successfully");
                Ok(())
            }
            Err(e) => {
                error!("Failed to initialize LibPostal: {}", e);
                Err(ApiError::ServiceUnavailable(format!(
                    "Failed to initialize LibPostal: {e}"
                )))
            }
        }
    }

    /// Get the global LibPostal service instance
    pub fn global() -> ApiResult<&'static LibPostalService> {
        LIBPOSTAL_INSTANCE.get().ok_or_else(|| {
            ApiError::ServiceUnavailable("LibPostal service not initialized".to_string())
        })
    }

    /// Parse an address into components
    pub async fn parse_address(
        &self,
        address: &str,
        language: Option<&str>,
        country: Option<&str>,
    ) -> ApiResult<libpostal_rs::ParsedAddress> {
        let postal = self.postal.lock().await;
        match (language, country) {
            (Some(lang), Some(ctry)) => postal
                .parse_address_with_hints(address, Some(lang), Some(ctry))
                .map_err(ApiError::from),
            _ => postal.parse_address(address).map_err(ApiError::from),
        }
    }

    /// Normalize an address
    pub async fn normalize_address(
        &self,
        address: &str,
        level: Option<&str>,
        languages: Option<&[String]>,
    ) -> ApiResult<libpostal_rs::NormalizedAddress> {
        let postal = self.postal.lock().await;
        let mut normalizer = postal.normalizer();

        // Set normalization level if provided
        if let Some(level_str) = level {
            let level = match level_str {
                "light" => NormalizationLevel::Light,
                "medium" => NormalizationLevel::Medium,
                "aggressive" => NormalizationLevel::Aggressive,
                _ => {
                    warn!("Invalid normalization level '{}', using default", level_str);
                    NormalizationLevel::Medium
                }
            };
            normalizer = normalizer.with_level(level);
        }

        // Set languages if provided
        if let Some(langs) = languages {
            let language_types: Vec<libpostal_rs::Language> = langs
                .iter()
                .map(|s| libpostal_rs::Language::from_str(s))
                .collect();
            normalizer = normalizer.with_languages(&language_types);
        }

        normalizer.normalize(address).map_err(ApiError::from)
    }

    /// Check if the service is healthy
    pub async fn health_check(&self) -> ApiResult<()> {
        // Try a simple parse to verify LibPostal is working
        let postal = self.postal.lock().await;
        match postal.parse_address("test") {
            Ok(_) => Ok(()),
            Err(e) => {
                error!("LibPostal health check failed: {}", e);
                Err(ApiError::ServiceUnavailable(
                    "LibPostal health check failed".to_string(),
                ))
            }
        }
    }
}
