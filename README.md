# LibPostal API

A high-performance REST API for address parsing and normalization powered by [libpostal](https://github.com/openvenues/libpostal) and built with Rust and Axum.

## Features

- **Fast Address Parsing**: Parse addresses into structured components (house number, street, city, state, etc.)
- **Address Normalization**: Expand addresses into multiple normalized variations
- **Multi-language Support**: Supports international addresses in multiple languages
- **Rate Limiting**: Built-in rate limiting (10 requests/second per IP)
- **OpenAPI Documentation**: Auto-generated Swagger UI documentation
- **Health Monitoring**: Health check endpoints for monitoring
- **Docker Support**: Ready-to-deploy Docker containers
- **CORS Enabled**: Cross-origin resource sharing support
- **Request Tracing**: Comprehensive logging and request tracking

## API Endpoints

### Address Processing

- `POST /api/v1/parse` - Parse an address into components
- `POST /api/v1/normalize` - Normalize and expand address variations

### Health & Monitoring

- `GET /api/v1/health` - Service health check

### Documentation

- `GET /docs` - Interactive Swagger UI documentation
- `GET /api-docs/openapi.json` - OpenAPI specification

## Installation and Setup

### Prerequisites

- **Rust 1.75+**
- **Docker** (optional, for containerized deployment)
- **LibPostal data files** (automatically downloaded on first run)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd libpostal-test
   ```

2. **Build the project**
   ```bash
   cargo build --release
   ```

3. **Initialize LibPostal data** (optional, done automatically on first run)
   ```bash
   cargo run -- --init-only
   ```

4. **Run the server**
   ```bash
   cargo run
   ```

The API will be available at:
- **Server**: http://localhost:3000
- **Documentation**: http://localhost:3000/docs
- **Health**: http://localhost:3000/api/v1/health

## Configuration

### Environment Variables

- `RUST_LOG`: Log level (default: `info`)
- `LIBPOSTAL_DATA_DIR`: Directory for LibPostal data files (default: `./data`)

### Command Line Options

- `--init-only`: Initialize LibPostal data and exit without starting the server

### Rate Limiting

- **Default**: 10 requests per second per IP address
- Configurable in `src/middleware/rate_limit.rs`

## Performance Benchmarks

The LibPostal API delivers exceptional performance with excellent throughput and low latency.

### Benchmark Summary

| Metric | Value |
|--------|-------|
| Total Requests | 99,109 |
| Success Rate | 100.0% |
| Test Duration | 6.62 seconds |
| Requests/Second | 14,971.33 |
| Concurrent Users | 50 |

### Response Time Statistics

| Percentile | Response Time |
|------------|---------------|
| Mean | 6.98 ms |
| Median | 6.67 ms |
| Min | 1.87 ms |
| Max | 44.94 ms |
| 50th percentile | 6.67 ms |
| 90th percentile | 9.20 ms |
| 95th percentile | 9.90 ms |
| 99th percentile | 18.22 ms |
| Standard Deviation | 2.64 ms |

### Performance Assessment

- **Reliability**: Excellent - 100% success rate under sustained load
- **Throughput**: High - Nearly 15,000 requests per second
- **Latency**: Excellent - Sub-7ms average response time with consistent performance
- **Scalability**: Demonstrates ability to handle high-concurrency workloads effectively

The benchmark results show the API can reliably handle production-scale traffic with consistent low-latency responses.
