use serde::Deserialize;
use utoipa::ToSchema;

/// Request to parse an address
#[derive(Debug, Deserialize, ToSchema)]
pub struct ParseRequest {
    /// The address string to parse
    #[schema(example = "123 Main St, New York, NY 10001")]
    pub address: String,

    /// Optional language hint (ISO 639-1 code)
    #[schema(example = "en")]
    pub language: Option<String>,

    /// Optional country hint (ISO 3166-1 alpha-2 code)
    #[schema(example = "US")]
    pub country: Option<String>,
}

/// Request to normalize an address
#[derive(Debug, Deserialize, ToSchema)]
pub struct NormalizeRequest {
    /// The address string to normalize
    #[schema(example = "123 Main St")]
    pub address: String,

    /// Normalization level: "light", "medium", or "aggressive"
    #[schema(example = "medium")]
    pub level: Option<String>,

    /// Optional language hints
    pub languages: Option<Vec<String>>,
}

impl ParseRequest {
    pub fn validate(&self) -> Result<(), String> {
        if self.address.trim().is_empty() {
            return Err("Address cannot be empty".to_string());
        }

        if self.address.len() > 1000 {
            return Err("Address is too long (maximum 1000 characters)".to_string());
        }

        // Validate language code if provided
        if let Some(ref lang) = self.language {
            if lang.len() != 2 {
                return Err("Language code must be 2 characters (ISO 639-1)".to_string());
            }
        }

        // Validate country code if provided
        if let Some(ref country) = self.country {
            if country.len() != 2 {
                return Err("Country code must be 2 characters (ISO 3166-1 alpha-2)".to_string());
            }
        }

        Ok(())
    }
}

impl NormalizeRequest {
    pub fn validate(&self) -> Result<(), String> {
        if self.address.trim().is_empty() {
            return Err("Address cannot be empty".to_string());
        }

        if self.address.len() > 1000 {
            return Err("Address is too long (maximum 1000 characters)".to_string());
        }

        // Validate normalization level if provided
        if let Some(ref level) = self.level {
            match level.as_str() {
                "light" | "medium" | "aggressive" => {}
                _ => return Err("Level must be 'light', 'medium', or 'aggressive'".to_string()),
            }
        }

        // Validate language codes if provided
        if let Some(ref languages) = self.languages {
            for lang in languages {
                if lang.len() != 2 {
                    return Err("Language codes must be 2 characters (ISO 639-1)".to_string());
                }
            }
        }

        Ok(())
    }
}
