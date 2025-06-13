// import React from 'react';

// export function LeadGeneration() {
//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Lead Generation</h1>
//       <p>This is the Lead Generation component. Integrate with n8n here.</p>
//     </div>
//   );
// } 


"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send, CheckCircle } from "lucide-react";
import { Label } from "@/components/ui/label";

export function LeadGeneration() {
  const [bussinus, setbussinus] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!bussinus || !location) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch("https://n8n.srv792766.hstgr.cloud/webhook/b4e3710b-f974-43c6-8fac-9edc0a1f72e7", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bussinus,
          location,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('N8n webhook error:', response.status, response.statusText, errorText);
        throw new Error(`Failed to trigger automation: ${response.status} ${response.statusText} - ${errorText}`);
      }
      const data = await response.json();
      setResult("✅ Lead submitted and processed successfully.");
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
            <Label htmlFor="bussinus">Company Name</Label>
            <Input
              id="bussinus"
              placeholder="e.g. G2C Grill 2 Chill"
              value={bussinus}
              onChange={(e) => setbussinus(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="e.g. Kanpur, Uttar Pradesh"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading || !bussinus || !location}
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
