"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "~/contexts/ThemeContext";

export function DocumentationSection() {
  const { theme } = useTheme();
  const parseRequestExample = {
    address: "123 Main St, New York, NY 10001",
    language: "en",
    country: "US",
  };

  const parseResponseExample = {
    success: true,
    data: {
      original: "123 Main St, New York, NY 10001",
      components: {
        house_number: "123",
        road: "Main St",
        city: "New York",
        state: "NY",
        postcode: "10001",
      },
    },
    meta: {
      processing_time_ms: 15,
      request_id: "req-123",
      api_version: "1.0",
      timestamp: "2025-01-01T00:00:00Z",
    },
  };

  const normalizeRequestExample = {
    address: "123 Main St",
    level: "medium",
  };

  const normalizeResponseExample = {
    success: true,
    data: {
      original: "123 Main St",
      expansions: ["123 main street", "123 main st"],
      expansion_count: 2,
    },
    meta: {
      processing_time_ms: 8,
      request_id: "req-124",
      api_version: "1.0",
      timestamp: "2025-01-01T00:00:00Z",
    },
  };

  const parseCurlExample = `curl -X POST https://libpostal.pendejo.dev/api/v1/parse \\
  -H "Content-Type: application/json" \\
  -d '{
    "address": "123 Main St, New York, NY 10001",
    "language": "en",
    "country": "US"
  }'`;

  const normalizeCurlExample = `curl -X POST https://libpostal.pendejo.dev/api/v1/normalize \\
  -H "Content-Type: application/json" \\
  -d '{
    "address": "123 Main St",
    "level": "medium"
  }'`;

  return (
    <section id="docs" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            API Documentation
          </h2>
          <p className="text-lg text-muted-foreground">
            Simple REST API endpoints for address processing
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Parse Endpoint */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Card className="bg-card border-border hover:shadow-xl hover:shadow-primary/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">
                  POST /parse
                </CardTitle>
                <p className="text-muted-foreground">
                  Parse addresses into their component parts
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    Request
                  </h4>
                  <div className="bg-muted border border-border rounded-lg overflow-hidden">
                    <SyntaxHighlighter
                      language="json"
                      style={theme === "dark" ? vscDarkPlus : vs}
                      customStyle={{
                        margin: 0,
                        padding: "1rem",
                        background: "transparent",
                        fontSize: "0.875rem",
                      }}
                    >
                      {JSON.stringify(parseRequestExample, null, 2)}
                    </SyntaxHighlighter>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-foreground">
                    cURL Example:
                  </h4>
                  <div className="bg-muted border border-border rounded-lg overflow-hidden">
                    <SyntaxHighlighter
                      language="bash"
                      style={theme === "dark" ? vscDarkPlus : vs}
                      customStyle={{
                        margin: 0,
                        padding: "1rem",
                        background: "transparent",
                        fontSize: "0.875rem",
                      }}
                    >
                      {parseCurlExample}
                    </SyntaxHighlighter>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-foreground">
                    Response:
                  </h4>
                  <div className="bg-muted border border-border rounded-lg overflow-hidden">
                    <SyntaxHighlighter
                      language="json"
                      style={theme === "dark" ? vscDarkPlus : vs}
                      customStyle={{
                        margin: 0,
                        padding: "1rem",
                        background: "transparent",
                        fontSize: "0.875rem",
                      }}
                    >
                      {JSON.stringify(parseResponseExample, null, 2)}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Normalize Endpoint */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="bg-card border-border hover:shadow-xl hover:shadow-primary/20 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">
                  POST /api/v1/normalize
                </CardTitle>
                <p className="text-muted-foreground">
                  Normalize and expand address abbreviations
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2 text-foreground">
                    Request Body:
                  </h4>
                  <div className="bg-muted border border-border rounded-lg overflow-hidden">
                    <SyntaxHighlighter
                      language="json"
                      style={theme === "dark" ? vscDarkPlus : vs}
                      customStyle={{
                        margin: 0,
                        padding: "1rem",
                        background: "transparent",
                        fontSize: "0.875rem",
                      }}
                    >
                      {JSON.stringify(normalizeRequestExample, null, 2)}
                    </SyntaxHighlighter>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-foreground">
                    cURL Example:
                  </h4>
                  <div className="bg-muted border border-border rounded-lg overflow-hidden">
                    <SyntaxHighlighter
                      language="bash"
                      style={theme === "dark" ? vscDarkPlus : vs}
                      customStyle={{
                        margin: 0,
                        padding: "1rem",
                        background: "transparent",
                        fontSize: "0.875rem",
                      }}
                    >
                      {normalizeCurlExample}
                    </SyntaxHighlighter>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2 text-foreground">
                    Response:
                  </h4>
                  <div className="bg-muted border border-border rounded-lg overflow-hidden">
                    <SyntaxHighlighter
                      language="json"
                      style={theme === "dark" ? vscDarkPlus : vs}
                      customStyle={{
                        margin: 0,
                        padding: "1rem",
                        background: "transparent",
                        fontSize: "0.875rem",
                      }}
                    >
                      {JSON.stringify(normalizeResponseExample, null, 2)}
                    </SyntaxHighlighter>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
