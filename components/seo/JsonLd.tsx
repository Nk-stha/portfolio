interface JsonLdProps {
  data: Record<string, any>;
}

export function JsonLd({ data }: JsonLdProps) {
  let jsonString = "";
  try {
    jsonString = JSON.stringify(data);
  } catch (error) {
    console.error("Error stringifying JSON-LD data:", error);
    return null;
  }

  // Escape closing script tags to prevent XSS
  const escapedJsonString = jsonString.replace(/</g, '\\u003c');

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: escapedJsonString }}
    />
  );
}
