use serde::Serialize;
use utoipa::ToSchema;

/// Response for successful API operations
#[derive(Debug, Serialize, ToSchema)]
pub struct ApiResponse<T> {
    /// Whether the operation was successful
    pub success: bool,
    /// The response data
    pub data: T,
    /// Request metadata
    pub meta: ResponseMeta,
}

/// Response metadata
#[derive(Debug, Serialize, ToSchema)]
pub struct ResponseMeta {
    /// Request processing time in milliseconds
    pub processing_time_ms: u64,
    /// Request ID for tracking
    pub request_id: String,
    /// API version
    pub api_version: String,
    /// Timestamp of the response
    pub timestamp: String,
}

/// Parsed address components
#[derive(Debug, Serialize, ToSchema)]
pub struct ParsedAddressResponse {
    /// Original input address
    #[schema(example = "123 Main St, New York, NY 10001")]
    pub original: String,
    /// Parsed address components
    pub components: AddressComponents,
}

/// Individual address components
#[derive(Debug, Serialize, ToSchema)]
pub struct AddressComponents {
    /// House number (e.g., "123", "123A")
    #[schema(example = "123")]
    pub house_number: Option<String>,
    /// Road/street name (e.g., "Main St", "Broadway")
    #[schema(example = "Main St")]
    pub road: Option<String>,
    /// Unit/apartment number (e.g., "Apt 2B", "Unit 5")
    pub unit: Option<String>,
    /// Floor/level (e.g., "2nd Floor", "Floor 3")
    pub level: Option<String>,
    /// Staircase
    pub staircase: Option<String>,
    /// Entrance
    pub entrance: Option<String>,
    /// Post office box
    pub po_box: Option<String>,
    /// Postcode (e.g., "10001", "SW1A 1AA")
    #[schema(example = "10001")]
    pub postcode: Option<String>,
    /// Suburb/neighborhood
    pub suburb: Option<String>,
    /// City/locality (e.g., "New York", "London")
    #[schema(example = "New York")]
    pub city: Option<String>,
    /// City district
    pub city_district: Option<String>,
    /// Island
    pub island: Option<String>,
    /// State/province (e.g., "NY", "California", "Ontario")
    #[schema(example = "NY")]
    pub state: Option<String>,
    /// State district
    pub state_district: Option<String>,
    /// Country region
    pub country_region: Option<String>,
    /// Country (e.g., "USA", "United States")
    #[schema(example = "US")]
    pub country: Option<String>,
    /// World region
    pub world_region: Option<String>,
    /// Category (e.g., building type)
    pub category: Option<String>,
    /// Near location reference
    pub near: Option<String>,
    /// Toponym (place name)
    pub toponym: Option<String>,
    /// All other unclassified components
    pub other: Vec<String>,
}

/// Normalized address response
#[derive(Debug, Serialize, ToSchema)]
pub struct NormalizedAddressResponse {
    /// Original input address
    #[schema(example = "123 Main St")]
    pub original: String,
    /// All possible normalized expansions
    pub expansions: Vec<String>,
    /// Number of expansions found
    pub expansion_count: usize,
}

/// Health check response
#[derive(Debug, Serialize, ToSchema)]
pub struct HealthResponse {
    /// Service status
    #[schema(example = "healthy")]
    pub status: String,
    /// LibPostal status
    #[schema(example = "ready")]
    pub libpostal_status: String,
}

/// Memory usage information
#[derive(Debug, Serialize, ToSchema)]
pub struct MemoryInfo {
    /// Used memory in bytes
    pub used_bytes: u64,
    /// Available memory in bytes  
    pub available_bytes: u64,
}

impl<T> ApiResponse<T> {
    pub fn new(data: T, request_id: String, processing_time_ms: u64) -> Self {
        Self {
            success: true,
            data,
            meta: ResponseMeta {
                processing_time_ms,
                request_id,
                api_version: "1.0".to_string(),
                timestamp: chrono::Utc::now().to_rfc3339(),
            },
        }
    }
}

impl From<libpostal_rs::ParsedAddress> for AddressComponents {
    fn from(parsed: libpostal_rs::ParsedAddress) -> Self {
        Self {
            house_number: parsed.house_number,
            road: parsed.road,
            unit: parsed.unit,
            level: parsed.level,
            staircase: parsed.staircase,
            entrance: parsed.entrance,
            po_box: parsed.po_box,
            postcode: parsed.postcode,
            suburb: parsed.suburb,
            city: parsed.city,
            city_district: parsed.city_district,
            island: parsed.island,
            state: parsed.state,
            state_district: parsed.state_district,
            country_region: parsed.country_region,
            country: parsed.country,
            world_region: parsed.world_region,
            category: parsed.category,
            near: parsed.near,
            toponym: parsed.toponym,
            other: parsed.other,
        }
    }
}
