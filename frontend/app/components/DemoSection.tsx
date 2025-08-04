"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Loader2, Copy, CheckCircle } from "lucide-react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
  const [mode, setMode] = useState<"parse" | "normalize">("parse");
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("123 Main St, New York, NY 10001");
  const [language, setLanguage] = useState("");
  const [country, setCountry] = useState("");
  const [level, setLevel] = useState("medium");
  const [response, setResponse] = useState<ApiResponse>({
    success: true,
    data: { message: "Click 'Parse Address' to see the response" }
  });
  const [copied, setCopied] = useState(false);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

  const processRequest = async () => {
    if (!address.trim()) {
      setResponse({
        success: false,
        error: {
          message: "Please enter an address",
          timestamp: new Date().toISOString()
        }
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
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      setResponse(data);
    } catch (error) {
      setResponse({
        success: false,
        error: {
          message: error instanceof Error ? error.message : "An error occurred",
          timestamp: new Date().toISOString()
        }
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
      console.error('Failed to copy: ', err);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      processRequest();
    }
  };

  return (
    <section id="demo" className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Try It Live
          </h2>
          <p className="text-lg text-gray-400">
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
            <Card className="bg-gray-800 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white">Input</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* API Mode Toggle */}
                <Tabs value={mode} onValueChange={(value: string) => setMode(value as "parse" | "normalize")}>
                  <TabsList className="grid w-full grid-cols-2 bg-gray-700">
                    <TabsTrigger value="parse" className="data-[state=active]:bg-blue-600">
                      Parse Address
                    </TabsTrigger>
                    <TabsTrigger value="normalize" className="data-[state=active]:bg-blue-600">
                      Normalize Address
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="parse" className="space-y-4 mt-6">
                    <div>
                      <Label htmlFor="address" className="text-white">Address</Label>
                      <Textarea
                        id="address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="123 Main St, New York, NY 10001"
                        className="bg-gray-700 border-gray-600 text-white mt-2"
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="language" className="text-white">Language (Optional)</Label>
                        <Input
                          id="language"
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                          placeholder="en"
                          className="bg-gray-700 border-gray-600 text-white mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="country" className="text-white">Country (Optional)</Label>
                        <Input
                          id="country"
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          placeholder="US"
                          className="bg-gray-700 border-gray-600 text-white mt-2"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="normalize" className="space-y-4 mt-6">
                    <div>
                      <Label htmlFor="address-normalize" className="text-white">Address</Label>
                      <Textarea
                        id="address-normalize"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="123 Main St, New York, NY 10001"
                        className="bg-gray-700 border-gray-600 text-white mt-2"
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="level" className="text-white">Normalization Level</Label>
                      <Select value={level} onValueChange={setLevel}>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white mt-2">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="aggressive">Aggressive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                </Tabs>

                <Button
                  onClick={processRequest}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/50"
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
            <Card className="bg-gray-800 border-gray-600">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-white">Response</CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyResponse}
                    className="border-gray-600 text-white hover:bg-gray-700"
                  >
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
                <div className="bg-gray-950 border border-gray-600 rounded-lg overflow-hidden">
                  <SyntaxHighlighter
                    language="json"
                    style={vscDarkPlus}
                    customStyle={{
                      margin: 0,
                      padding: '1rem',
                      background: 'transparent',
                      fontSize: '0.875rem'
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
