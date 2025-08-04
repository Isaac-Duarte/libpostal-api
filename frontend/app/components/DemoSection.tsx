"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Loader2, Copy, CheckCircle } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  vscDarkPlus,
  vs,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "~/contexts/ThemeContext";

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: {
    message: string;
    timestamp: string;
  };
  meta?: {
    processing_time_ms: number;
    request_id: string;
    api_version: string;
    timestamp: string;
  };
}

export function DemoSection() {
  const { theme } = useTheme();
  const [mode, setMode] = useState<"parse" | "normalize">("parse");
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("123 Main St, New York, NY 10001");
  const [language, setLanguage] = useState("");
  const [country, setCountry] = useState("");
  const [level, setLevel] = useState("medium");
  const [response, setResponse] = useState<ApiResponse>({
    success: true,
    data: { message: "Click 'Parse Address' to see the response" },
  });
  const [copied, setCopied] = useState(false);
  const [curlCopied, setCurlCopied] = useState(false);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  const processRequest = async () => {
    if (!address.trim()) {
      setResponse({
        success: false,
        error: {
          message: "Please enter an address",
          timestamp: new Date().toISOString(),
        },
      });
      return;
    }

    setLoading(true);

    try {
      let requestBody: any = { address };
      let endpoint = "";

      if (mode === "parse") {
        if (language) requestBody.language = language;
        if (country) requestBody.country = country;
        endpoint = `${baseUrl}/api/v1/parse`;
      } else {
        requestBody.level = level;
        endpoint = `${baseUrl}/api/v1/normalize`;
      }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error?.message ||
            `HTTP ${response.status}: ${response.statusText}`
        );
      }

      setResponse(data);
    } catch (error) {
      setResponse({
        success: false,
        error: {
          message: error instanceof Error ? error.message : "An error occurred",
          timestamp: new Date().toISOString(),
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const copyResponse = async () => {
    const responseText = JSON.stringify(response, null, 2);

    try {
      await navigator.clipboard.writeText(responseText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const copyCurlCommand = async () => {
    if (!address.trim()) {
      return;
    }

    let requestBody: any = { address };
    let endpoint = "";

    if (mode === "parse") {
      if (language) requestBody.language = language;
      if (country) requestBody.country = country;
      endpoint = `${baseUrl}/api/v1/parse`;
    } else {
      requestBody.level = level;
      endpoint = `${baseUrl}/api/v1/normalize`;
    }

    const curlCommand = `curl -X POST ${endpoint} \\
  -H "Content-Type: application/json" \\
  -d '${JSON.stringify(requestBody, null, 2)}'`;

    try {
      await navigator.clipboard.writeText(curlCommand);
      setCurlCopied(true);
      setTimeout(() => setCurlCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      processRequest();
    }
  };

  return (
    <section id="demo" className="py-20 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Try It Live
          </h2>
          <p className="text-lg text-muted-foreground">
            Test our address parsing and normalization endpoints in real-time
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-card-foreground">Input</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* API Mode Toggle */}
                <Tabs
                  value={mode}
                  onValueChange={(value: string) =>
                    setMode(value as "parse" | "normalize")
                  }
                >
                  <TabsList className="grid w-full grid-cols-2 bg-muted">
                    <TabsTrigger
                      value="parse"
                      className="data-[state=active]:bg-primary hover:cursor-pointer data-[state=active]:text-primary-foreground text-foreground"
                    >
                      Parse
                    </TabsTrigger>
                    <TabsTrigger
                      value="normalize"
                      className="data-[state=active]:bg-primary  hover:cursor-pointer data-[state=active]:text-primary-foreground text-foreground"
                    >
                      Normalize
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="parse" className="space-y-4 mt-6">
                    <div>
                      <Label htmlFor="address" className="text-foreground">
                        Address
                      </Label>
                      <Textarea
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="123 Main St, New York, NY 10001"
                        className="bg-input border-border text-foreground mt-2"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="language" className="text-foreground">
                          Language (Optional)
                        </Label>
                        <Input
                          id="language"
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          placeholder="en"
                          className="bg-input border-border text-foreground mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="country" className="text-foreground">
                          Country (Optional)
                        </Label>
                        <Input
                          id="country"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          placeholder="US"
                          className="bg-input border-border text-foreground mt-2"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="normalize" className="space-y-4 mt-6">
                    <div>
                      <Label
                        htmlFor="address-normalize"
                        className="text-foreground"
                      >
                        Address
                      </Label>
                      <Textarea
                        id="address-normalize"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="123 Main St, New York, NY 10001"
                        className="bg-input border-border text-foreground mt-2"
                        rows={3}
                      />
                    </div>

                    <div>
                      <Label htmlFor="level" className="text-foreground">
                        Normalization Level
                      </Label>
                      <Select value={level} onValueChange={setLevel}>
                        <SelectTrigger className="bg-input border-border text-foreground mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border">
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="aggressive">Aggressive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="flex gap-2">
                  <Button
                    onClick={processRequest}
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      `${mode === "parse" ? "Parse" : "Normalize"} Address`
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={copyCurlCommand}
                    disabled={!address.trim()}
                    className="flex-shrink-0"
                  >
                    {curlCopied ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy cURL
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Output Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Card className="bg-card border-border">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-card-foreground">
                    Response
                  </CardTitle>
                  <Button variant="outline" size="sm" onClick={copyResponse}>
                    {copied ? (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
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
                    {JSON.stringify(response, null, 2)}
                  </SyntaxHighlighter>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
