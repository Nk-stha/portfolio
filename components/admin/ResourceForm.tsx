"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

interface Field {
  name: string;
  label: string;
  type: "text" | "textarea" | "number" | "checkbox" | "select" | "date" | "image" | "markdown";
  options?: { label: string; value: string }[]; // For select
  required?: boolean;
  disabled?: boolean;
}

interface ResourceFormProps {
  initialData?: any;
  resourceName: string;
  fields: Field[];
  onSubmit: (data: any) => Promise<void>;
  backHref: string;
}

// Simple internal Markdown Editor component
function MarkdownEditor({ 
  value, 
  onChange, 
  required 
}: { 
  value: string; 
  onChange: (val: string) => void;
  required?: boolean;
}) {
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [isUploading, setIsUploading] = useState(false);

  const insertFormat = (prefix: string, suffix: string = "") => {
    const textarea = document.getElementById("markdown-textarea") as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const before = text.substring(0, start);
    const selection = text.substring(start, end);
    const after = text.substring(end);

    const newText = before + prefix + selection + suffix + after;
    onChange(newText);
    
    // Restore focus and selection
    setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }

      const data = await res.json();
      insertFormat(`![${file.name}](${data.url})`);
    } catch (error) {
      console.error(error);
      alert("Failed to upload image. Check console/network.");
    } finally {
      setIsUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  return (
    <div className="rounded-lg border border-[#1a1a1a] bg-[#111] overflow-hidden">
      <div className="flex border-b border-[#1a1a1a] bg-[#0f0f0f]">
        <button
          type="button"
          onClick={() => setTab("write")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            tab === "write" 
              ? "bg-[#222] text-white border-b-2 border-primary" 
              : "text-gray-400 hover:text-white"
          }`}
        >
          Write
        </button>
        <button
          type="button"
          onClick={() => setTab("preview")}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            tab === "preview" 
              ? "bg-[#222] text-white border-b-2 border-primary" 
              : "text-gray-400 hover:text-white"
          }`}
        >
          Preview
        </button>
        
        {/* Toolbar - Only visible in Write mode */}
        {tab === "write" && (
            <div className="flex items-center space-x-1 border-l border-[#1a1a1a] ml-2 pl-2 py-1">
                <button type="button" onClick={() => insertFormat("# ")} className="p-1.5 text-gray-400 hover:text-white hover:bg-[#222] rounded" title="Heading 1">
                    <span className="font-bold text-xs">H1</span>
                </button>
                <button type="button" onClick={() => insertFormat("## ")} className="p-1.5 text-gray-400 hover:text-white hover:bg-[#222] rounded" title="Heading 2">
                    <span className="font-bold text-xs">H2</span>
                </button>
                <div className="w-px h-4 bg-[#1a1a1a] mx-1" />
                <button type="button" onClick={() => insertFormat("**", "**")} className="p-1.5 text-gray-400 hover:text-white hover:bg-[#222] rounded" title="Bold">
                    <span className="font-bold text-xs">B</span>
                </button>
                <button type="button" onClick={() => insertFormat("*", "*")} className="p-1.5 text-gray-400 hover:text-white hover:bg-[#222] rounded" title="Italic">
                    <span className="italic text-xs font-serif">I</span>
                </button>
                <button type="button" onClick={() => insertFormat("`", "`")} className="p-1.5 text-gray-400 hover:text-white hover:bg-[#222] rounded font-mono" title="Inline Code">
                    <span className="text-xs">&lt;/&gt;</span>
                </button>
                <div className="w-px h-4 bg-[#1a1a1a] mx-1" />
                 <button type="button" onClick={() => insertFormat("- ")} className="p-1.5 text-gray-400 hover:text-white hover:bg-[#222] rounded" title="List">
                    <span className="text-xs">List</span>
                </button>
                <button type="button" onClick={() => insertFormat("> ")} className="p-1.5 text-gray-400 hover:text-white hover:bg-[#222] rounded" title="Quote">
                    <span className="text-xs">"</span>
                </button>
                <button type="button" onClick={() => insertFormat("```javascript\n", "\n```")} className="p-1.5 text-gray-400 hover:text-white hover:bg-[#222] rounded font-mono" title="Code Block">
                    <span className="text-xs font-bold">{ }</span>
                </button>
                <div className="w-px h-4 bg-[#1a1a1a] mx-1" />
                <button type="button" onClick={() => insertFormat("![Alt Text](", ")")} className="p-1.5 text-gray-400 hover:text-white hover:bg-[#222] rounded" title="Image (URL)">
                   <span className="text-xs">URL</span>
                </button>
                <label className="p-1.5 text-gray-400 hover:text-white hover:bg-[#222] rounded cursor-pointer" title="Upload Image">
                    {isUploading ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                    ) : ( 
                        <span className="text-xs font-bold text-primary">UP</span>
                     )}
                    <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload} 
                        disabled={isUploading}
                    />
                </label>
            </div>
        )}
      </div>
      
      {tab === "write" ? (
        <textarea
          id="markdown-textarea"
          required={required}
          rows={15}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full resize-y bg-[#111] p-4 text-sm font-mono text-white placeholder-gray-500 focus:outline-none"
          placeholder="Type markdown here..."
        />
      ) : (
        <div className="prose prose-invert max-w-none p-4 min-h-[300px] overflow-y-auto">
          {value ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>{value}</ReactMarkdown>
          ) : (
             <p className="text-gray-500 italic">Nothing to preview</p>
          )}
        </div>
      )}
    </div>
  );
}

export function ResourceForm({
  initialData,
  resourceName,
  fields,
  onSubmit,
  backHref,
}: ResourceFormProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState(initialData || {});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
      router.refresh();
      router.push(backHref);
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href={backHref}
            className="p-2 rounded-lg border border-[#1a1a1a] bg-[#0a0a0a] text-gray-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            {initialData ? `Edit ${resourceName}` : `Create ${resourceName}`}
          </h2>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Changes
        </button>
      </div>

      <div className="rounded-xl border border-[#1a1a1a] bg-[#0a0a0a] p-8">
        <div className="grid grid-cols-1 gap-6">
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                {field.label} {field.required && <span className="text-red-500">*</span>}
              </label>

              {field.type === "text" && (
                <input
                  type="text"
                  required={field.required}
                  disabled={field.disabled}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="w-full rounded-lg border border-[#1a1a1a] bg-[#111] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                />
              )}

              {field.type === "textarea" && (
                <textarea
                  required={field.required}
                  disabled={field.disabled}
                  rows={5}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="w-full rounded-lg border border-[#1a1a1a] bg-[#111] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                />
              )}
              
              {field.type === "markdown" && (
                <MarkdownEditor 
                  value={formData[field.name] || ""}
                  onChange={(val) => handleChange(field.name, val)}
                  required={field.required}
                />
              )}

              {field.type === "number" && (
                <input
                  type="number"
                  required={field.required}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleChange(field.name, Number(e.target.value))}
                  className="w-full rounded-lg border border-[#1a1a1a] bg-[#111] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                />
              )}

              {field.type === "date" && (
                <input
                  type="date"
                  required={field.required}
                  value={formData[field.name] ? new Date(formData[field.name]).toISOString().split('T')[0] : ""}
                  onChange={(e) => handleChange(field.name, e.target.value ? new Date(e.target.value).toISOString() : null)}
                  className="w-full rounded-lg border border-[#1a1a1a] bg-[#111] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary [color-scheme:dark]"
                />
              )}


              {field.type === "select" && (
                <select
                  required={field.required}
                  disabled={field.disabled}
                  value={formData[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  className="w-full rounded-lg border border-[#1a1a1a] bg-[#111] px-4 py-2.5 text-sm text-white focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Select an option</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}

              {field.type === "checkbox" && (
                <div className="flex items-center space-x-3 pt-2">
                  <input
                    type="checkbox"
                    checked={formData[field.name] || false}
                    onChange={(e) => handleChange(field.name, e.target.checked)}
                    className="h-5 w-5 rounded border-gray-600 bg-[#111] text-primary focus:ring-primary focus:ring-offset-[#0a0a0a]"
                  />
                  <span className="text-sm text-gray-400">{field.label}</span>
                </div>
              )}
              
               {/* 
                 For Image: Simple text input for URL for now (as per "simple plan").
                 Ideally functionality would use a file uploader. 
               */}
              {field.type === "image" && (
                <div className="space-y-3">
                   <div className="flex gap-4">
                     <input
                        type="text"
                        required={field.required}
                        placeholder="Image URL (e.g. /projects/image.png) or Upload →"
                        value={formData[field.name] || ""}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                        className="flex-1 rounded-lg border border-[#1a1a1a] bg-[#111] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                      />
                      <label className="flex items-center justify-center px-4 rounded-lg bg-[#222] border border-[#333] cursor-pointer hover:bg-[#333] transition-colors">
                            {loading ? (
                                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                            ) : ( 
                                <span className="text-sm font-bold text-primary">Upload</span>
                            )}
                            <input 
                                type="file" 
                                accept="image/*" 
                                className="hidden" 
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;

                                    setLoading(true); // Re-using form loading state is acceptable here or create local state
                                    const formData = new FormData();
                                    formData.append("file", file);

                                    try {
                                        const res = await fetch("/api/upload", {
                                            method: "POST",
                                            body: formData,
                                        });

                                        if (!res.ok) {
                                            const err = await res.json();
                                            throw new Error(err.error || "Upload failed");
                                        }

                                        const data = await res.json();
                                        handleChange(field.name, data.url);
                                    } catch (error) {
                                        console.error(error);
                                        alert("Failed to upload image.");
                                    } finally {
                                        setLoading(false);
                                        e.target.value = "";
                                    }
                                }} 
                                disabled={loading}
                            />
                        </label>
                   </div>
                   {formData[field.name] && (
                     <div className="relative h-40 w-full max-w-xs rounded-lg border border-[#1a1a1a] bg-[#111] overflow-hidden group">
                       <img 
                          src={formData[field.name]} 
                          alt="Preview" 
                          className="h-full w-full object-cover"
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                     </div>
                   )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
