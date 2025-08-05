import type { Route } from "./+types/home";
import { LibPostalApp } from "../components/LibPostalApp";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "LibPostal API - Free Address Parsing & Normalization API | No Auth Required" },
    {
      name: "description",
      content:
        "Free, high-performance REST API for parsing and normalizing addresses worldwide. Built on libpostal with 99.9% accuracy. Parse addresses into components, normalize variations. No API keys, no rate limits. Perfect for developers, e-commerce, and logistics applications.",
    },
    {
      name: "keywords",
      content: "address parsing API, address normalization, libpostal API, free address validation, international address parser, postal address components, REST API no auth, address standardization, global address processing"
    },
    { property: "og:title", content: "LibPostal API - Free Address Parsing & Normalization API" },
    { property: "og:description", content: "Free, high-performance REST API for parsing and normalizing addresses worldwide. Built on libpostal with 99.9% accuracy. No API keys required." },
    { name: "twitter:title", content: "LibPostal API - Free Address Parsing & Normalization" },
    { name: "twitter:description", content: "Free, high-performance REST API for parsing and normalizing addresses worldwide. Built on libpostal with 99.9% accuracy. No API keys required." },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "Organization",
            "@id": "https://libpostal.pendejo.dev/#organization",
            "name": "LibPostal API",
            "url": "https://libpostal.pendejo.dev",
            "logo": {
              "@type": "ImageObject",
              "url": "https://libpostal.pendejo.dev/favicon.png"
            },
            "founder": {
              "@type": "Person",
              "name": "Isaac Duarte",
              "url": "https://github.com/Isaac-Duarte"
            }
          },
          {
            "@type": "SoftwareApplication",
            "@id": "https://libpostal.pendejo.dev/#software",
            "name": "LibPostal API",
            "description": "Free, high-performance REST API for parsing and normalizing addresses worldwide. Built on libpostal with 99.9% accuracy.",
            "url": "https://libpostal.pendejo.dev",
            "applicationCategory": "DeveloperApplication",
            "operatingSystem": ["Linux", "Windows", "macOS"],
            "programmingLanguage": ["Rust", "JavaScript", "Python", "cURL"],
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock"
            },
            "featureList": [
              "Address parsing into components",
              "Address normalization and expansion", 
              "International address support",
              "No API key required",
              "High accuracy with libpostal",
              "Rate limiting protection",
              "OpenAPI documentation"
            ],
            "screenshot": "https://libpostal.pendejo.dev/og-image.jpg"
          },
          {
            "@type": "WebSite",
            "@id": "https://libpostal.pendejo.dev/#website",
            "url": "https://libpostal.pendejo.dev",
            "name": "LibPostal API",
            "description": "Free address parsing and normalization API",
            "publisher": {
              "@id": "https://libpostal.pendejo.dev/#organization"
            },
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://libpostal.pendejo.dev/api/v1/parse?address={search_term_string}"
              },
              "query-input": "required name=search_term_string"
            }
          },
          {
            "@type": "APIReference",
            "name": "LibPostal API Documentation",
            "description": "REST API endpoints for address parsing and normalization",
            "url": "https://libpostal.pendejo.dev/docs",
            "programmingLanguage": ["HTTP", "cURL", "JavaScript", "Python"],
            "targetProduct": {
              "@id": "https://libpostal.pendejo.dev/#software"
            }
          }
        ]
      }
    }
  ];
}

export default function Home() {
  return <LibPostalApp />;
}
