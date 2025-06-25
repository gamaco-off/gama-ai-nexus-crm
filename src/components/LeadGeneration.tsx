
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send, CheckCircle } from "lucide-react";
import { Label } from "@/components/ui/label";

export function LeadGeneration() {
  const [industry, setIndustry] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
  if (!industry || !location) return;
  setLoading(true);
  setResult(null);
  setError(null);

  try {
    const response = await fetch("https://n8n.gama-app.com/webhook/c31cf907-9ea4-43e2-bab0-953e87530975", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ industry, location }),
    });

    const text = await response.text(); // first try to read text response

    // Try parsing JSON only if response is not empty
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      throw new Error(`Server Error: ${response.status} - ${text}`);
    }

    setResult(data?.message || "✅ Lead submitted and processed successfully.");
  } catch (err) {
    console.error('Error sending data to workflow:', err);
    setError("❌ Failed to send data to the workflow. Check console for details.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Send className="w-5 h-5" />
            Lead Generation Form
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              placeholder="e.g. Website Development"
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g. Delhi"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading || !industry || !location}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Submit to Workflow
              </>
            )}
          </Button>

          {result && (
            <p className="text-green-600 flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4" /> {result}
            </p>
          )}
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}
