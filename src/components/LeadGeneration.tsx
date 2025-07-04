"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send, CheckCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function LeadGeneration() {
  const [form, setForm] = useState({
    industry: "SAAS",
    location: "India",
    number_of_leads: 10,
    company_size: "Any Size",
    revenue_range: "Any Revenue",
    job_titles: "CEO",
    business_type: "B2B",
  });

  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [leads, setLeads] = useState<any[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setError(null);
    setResult(null);
    setLoading(true);
    setLeads([]);

    try {
      const response = await fetch("https://n8n.gama-app.com/webhook/leadgen-chat-1", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
  throw new Error("Network or webhook failure");
}

if (!data.success) {
  if (data.message?.includes("No verified leads")) {
    setResult(data.message);
    return; // Don't throw, just show the info
  }

  throw new Error("Error from workflow: " + (data.error || "Unknown error"));
}

      setResult("✅ Lead generation successful");
      setLeads(data.leads || []);
    } catch (err: any) {
      console.error(err);
      setError("❌ Failed to generate leads.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Send className="w-5 h-5" />
            AI Lead Generation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* INDUSTRY */}
          <div className="space-y-1">
            <Label htmlFor="industry">Industry</Label>
            <Input id="industry" name="industry" placeholder="e.g. SaaS, Healthcare" value={form.industry} onChange={handleChange} required />
          </div>

          {/* LOCATION */}
          <div className="space-y-1">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" placeholder="e.g. USA, India" value={form.location} onChange={handleChange} required />
          </div>

          {/* NUMBER OF LEADS */}
          <div className="space-y-1">
            <Label htmlFor="number_of_leads">Number of Leads</Label>
            <Input id="number_of_leads" name="number_of_leads" type="number" value={form.number_of_leads} onChange={handleChange} />
          </div>

          {/* COMPANY SIZE */}
          <div className="space-y-1">
            <Label>Company Size</Label>
            <Select value={form.company_size} onValueChange={(value) => handleSelectChange("company_size", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select company size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Startup (1-10 employees)">Startup (1-10 employees)</SelectItem>
                <SelectItem value="Small (11-50 employees)">Small (11-50 employees)</SelectItem>
                <SelectItem value="Medium (51-200 employees)">Medium (51-200 employees)</SelectItem>
                <SelectItem value="Large (201-1000 employees)">Large (201-1000 employees)</SelectItem>
                <SelectItem value="Enterprise (1000+ employees)">Enterprise (1000+ employees)</SelectItem>
                <SelectItem value="Any Size">Any Size</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* REVENUE RANGE */}
          <div className="space-y-1">
            <Label>Revenue Range</Label>
            <Select value={form.revenue_range} onValueChange={(value) => handleSelectChange("revenue_range", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select revenue range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Under $1M">Under $1M</SelectItem>
                <SelectItem value="$1M - $10M">$1M - $10M</SelectItem>
                <SelectItem value="$10M - $50M">$10M - $50M</SelectItem>
                <SelectItem value="$50M - $100M">$50M - $100M</SelectItem>
                <SelectItem value="$100M+">$100M+</SelectItem>
                <SelectItem value="Any Revenue">Any Revenue</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* JOB TITLES */}
          <div className="space-y-1">
            <Label htmlFor="job_titles">Target Job Titles</Label>
            <Textarea id="job_titles" name="job_titles" placeholder="e.g. CEO, CTO, Marketing Director" value={form.job_titles} onChange={handleChange} />
          </div>

          {/* BUSINESS TYPE */}
          <div className="space-y-1">
            <Label>Business Type</Label>
            <Select value={form.business_type} onValueChange={(value) => handleSelectChange("business_type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="B2B">B2B</SelectItem>
                <SelectItem value="B2C">B2C</SelectItem>
                <SelectItem value="Both">Both</SelectItem>
                <SelectItem value="Any">Any</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* SUBMIT BUTTON */}
          <Button
            onClick={handleSubmit}
            disabled={loading || !form.industry || !form.location}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
                Generating...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Generate Leads
              </>
            )}
          </Button>

          {/* SUCCESS / ERROR */}
          {result && (
            <p className="text-green-600 flex items-center gap-2 text-sm">
              <CheckCircle className="w-4 h-4" /> {result}
            </p>
          )}
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </CardContent>
      </Card>

      {/* LEAD OUTPUT */}
      {leads.length > 0 && (
        <div className="bg-white p-4 border rounded shadow mt-4 space-y-3">
          <h3 className="text-lg font-semibold">Generated Leads</h3>
          {leads.map((lead, i) => (
            <div key={i} className="border p-3 rounded">
              <strong>{lead.company_name}</strong><br />
              Contact: {lead.contact_person || "N/A"} ({lead.job_title || "N/A"})<br />
              Email: {lead.email}<br />
              Phone: {lead.phone}<br />
              LinkedIn: {lead.linkedin_company}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
