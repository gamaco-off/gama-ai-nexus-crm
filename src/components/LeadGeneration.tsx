"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Send, CheckCircle, Settings, AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function LeadGeneration() {
  const { user } = useAuth();
  const { toast } = useToast();
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
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);
  const [tempWebhookUrl, setTempWebhookUrl] = useState<string>('');

  // Fetch user's webhook URL on component mount
  useEffect(() => {
    const fetchWebhookUrl = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('leadgen_webhook_url')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching webhook URL:', error);
        return;
      }
      
      if (data?.leadgen_webhook_url) {
        setWebhookUrl(data.leadgen_webhook_url);
      }
    };
    
    fetchWebhookUrl();
  }, [user]);

  const saveWebhookUrl = async () => {
    if (!user || !tempWebhookUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid webhook URL",
        variant: "destructive"
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(tempWebhookUrl);
    } catch {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive"
      });
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({ leadgen_webhook_url: tempWebhookUrl.trim() })
      .eq('id', user.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to save webhook URL",
        variant: "destructive"
      });
      return;
    }

    setWebhookUrl(tempWebhookUrl.trim());
    setShowSettings(false);
    toast({
      title: "Success",
      description: "Webhook URL saved successfully!",
    });
  };

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

    // Check if webhook URL is configured
    if (!webhookUrl) {
      setError("❌ Please configure your n8n webhook URL first.");
      setLoading(false);
      toast({
        title: "Configuration Required",
        description: "Please configure your n8n webhook URL first.",
        variant: "destructive"
      });
      setShowSettings(true);
      return;
    }

    try {
      console.log('Sending request to n8n webhook with data:', form);
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      // First get the response as text to see what we're actually receiving
      const responseText = await response.text();
      console.log('Raw response text:', responseText);
      
      let data;
      try {
        data = JSON.parse(responseText);
        console.log('Parsed response data:', data);
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        // If it's not JSON, treat the text response as a success message
        setResult(`✅ ${responseText}`);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      // Handle different response formats
      if (typeof data === 'string') {
        setResult(`✅ ${data}`);
      } else if (data.success === false) {
        if (data.message?.includes("No verified leads")) {
          setResult(data.message);
          return;
        }
        throw new Error("Error from workflow: " + (data.error || data.message || "Unknown error"));
      } else if (Array.isArray(data) && data.length > 0 && data[0].output) {
        // Handle n8n workflow response format: [{ "output": "JSON string" }]
        try {
          const outputText = data[0].output;
          console.log('N8N output text:', outputText);
          
          // Extract JSON from the output text (it's wrapped in ```json ... ```)
          const jsonMatch = outputText.match(/```json\s*([\s\S]*?)\s*```/);
          if (jsonMatch) {
            const jsonString = jsonMatch[1];
            console.log('Extracted JSON string:', jsonString);
            const parsedLeads = JSON.parse(jsonString);
            console.log('Parsed leads:', parsedLeads);
            
            if (Array.isArray(parsedLeads) && parsedLeads.length > 0) {
              setResult("✅ Lead generation successful");
              setLeads(parsedLeads);
            } else {
              setResult("✅ Lead generation completed, but no leads found");
            }
          } else {
            // If no JSON block found, just show the output text
            setResult(`✅ ${outputText}`);
          }
        } catch (parseError) {
          console.error('Error parsing n8n output:', parseError);
          setResult(`✅ Lead generation completed: ${data[0].output}`);
        }
      } else if (data.leads && Array.isArray(data.leads)) {
        setResult("✅ Lead generation successful");
        setLeads(data.leads);
      } else if (Array.isArray(data)) {
        // If the response is directly an array of leads
        setResult("✅ Lead generation successful");
        setLeads(data);
      } else {
        // For any other successful response
        setResult("✅ Lead generation completed");
        if (data.message) {
          setResult(`✅ ${data.message}`);
        }
      }

    } catch (err: any) {
      console.error('Lead generation error:', err);
      setError(`❌ Failed to generate leads: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header with Settings */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Lead Generation</h1>
          <p className="text-gray-600">Generate leads using your custom n8n workflow</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setTempWebhookUrl(webhookUrl);
            setShowSettings(!showSettings);
          }}
          className="flex items-center space-x-2"
        >
          <Settings className="w-4 h-4" />
          <span>Configure Webhook</span>
        </Button>
      </div>

      {/* Webhook Configuration Panel */}
      {showSettings && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              n8n Webhook Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Lead Generation Webhook URL
                </Label>
                <Input
                  value={tempWebhookUrl}
                  onChange={(e) => setTempWebhookUrl(e.target.value)}
                  placeholder="https://your-n8n-instance.com/webhook/your-webhook-id"
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter your n8n webhook URL for the Lead Generation workflow
                </p>
              </div>
              <div className="flex space-x-2">
                <Button onClick={saveWebhookUrl} className="bg-blue-600 hover:bg-blue-700">
                  Save Configuration
                </Button>
                <Button variant="outline" onClick={() => setShowSettings(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
            disabled={loading || !form.industry || !form.location || !webhookUrl}
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
