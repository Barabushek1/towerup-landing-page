
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const DEEPL_API_KEY = Deno.env.get("DEEPL_API_KEY");
const DEEPL_API_URL = "https://api-free.deepl.com/v2/translate";

// Set up CORS headers for browser requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface TranslationRequest {
  text: string;
  targetLang: string;
  sourceLang?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const { text, targetLang, sourceLang } = await req.json() as TranslationRequest;
    
    console.log(`Received translation request: Text="${text}", Target=${targetLang}`);
    
    if (!text || !targetLang) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!DEEPL_API_KEY) {
      console.error("DEEPL_API_KEY is not set");
      return new Response(
        JSON.stringify({ error: "DeepL API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Prepare request to DeepL API
    const formData = new FormData();
    formData.append("text", text);
    formData.append("target_lang", mapLanguageCode(targetLang));
    
    // Only add source language if provided
    if (sourceLang) {
      formData.append("source_lang", mapLanguageCode(sourceLang));
    }

    console.log(`Calling DeepL API for translation to ${mapLanguageCode(targetLang)}`);
    
    // Make request to DeepL API
    const response = await fetch(DEEPL_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `DeepL-Auth-Key ${DEEPL_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("DeepL API error:", errorText);
      return new Response(
        JSON.stringify({ error: `DeepL API error: ${response.status}` }),
        { status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    console.log("Translation successful:", data);
    
    return new Response(
      JSON.stringify({ 
        translatedText: data.translations[0].text,
        detectedLanguage: data.translations[0].detected_source_language
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in translate function:", error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Map our app's language codes to DeepL's expected format
function mapLanguageCode(code: string): string {
  const mapping: Record<string, string> = {
    'en': 'EN-US', // American English
    'ru': 'RU',    // Russian
    'uz': 'EN-US'  // Uzbek - DeepL doesn't support Uzbek, fallback to English
                   // In a real app, you might want to use a different service for Uzbek
  };
  
  return mapping[code] || code.toUpperCase();
}
