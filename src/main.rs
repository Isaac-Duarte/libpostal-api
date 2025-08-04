use anyhow::Context;
use axum::{middleware::from_fn, Extension, Router};
use clap::Parser;
use std::net::SocketAddr;
use tower::ServiceBuilder;
use tower_http::{services::ServeDir, trace::TraceLayer};
use tracing::{error, info};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use utoipa::OpenApi;

mod api;
mod error;
mod middleware;
mod models;
mod services;

use services::LibPostalService;

#[derive(Parser)]
#[command(name = "libpostal-api")]
#[command(about = "LibPostal API server")]
struct Args {
    /// Initialize LibPostal only (don't start the server)
    #[arg(
        long,
        help = "Initialize LibPostal and exit without starting the server"
    )]
    init_only: bool,
}

#[tokio::main]
async fn main() -> Result<(), anyhow::Error> {
    // Parse command line arguments
    let args = Args::parse();

    // Initialize tracing
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| "info".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    info!("Starting LibPostal API server...");

    // Initialize LibPostal service
    if let Err(e) = LibPostalService::initialize().await {
        error!("Failed to initialize LibPostal service: {}", e);
        return Err(anyhow::anyhow!(
            "Failed to initialize LibPostal service: {}",
            e
        ));
    }

    // If init_only flag is set, exit after initialization
    if args.init_only {
        info!("LibPostal initialized successfully. Exiting as requested.");
        return Ok(());
    }

    // Build the application
    let app = Router::new()
        // API routes
        .nest("/api/v1", api::create_api_routes())
        // Documentation routes - merge SwaggerUi directly
        .merge(
            utoipa_swagger_ui::SwaggerUi::new("/docs")
                .url("/api-docs/openapi.json", api::handlers::ApiDoc::openapi()),
        )
        // Static file serving for the landing page
        .fallback_service(ServeDir::new("static"))
        .layer(
            ServiceBuilder::new()
                .layer(TraceLayer::new_for_http())
                .layer(middleware::create_cors_layer())
                .layer(from_fn(middleware::request_id_middleware)),
        );

    // Start the server
    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
    info!("LibPostal API server listening on {}", addr);
    info!("API documentation available at: http://localhost:3000/docs");
    info!("Landing page available at: http://localhost:3000");

    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(
        listener,
        app.into_make_service_with_connect_info::<SocketAddr>(),
    )
    .await
    .context("Unable to serve application")?;

    Ok(())
}
