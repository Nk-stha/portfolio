"use client";

import { ResourceForm } from "@/components/admin/ResourceForm";
import { useRouter } from "next/navigation";
import { authenticatedFetch } from "@/lib/client/auth-client";

export function ProfileForm({ initialData }: { initialData: any }) {
  const router = useRouter();

  const handleUpdate = async (data: any) => {
    // Transform flat form data back to nested structure if needed, 
    // but ResourceForm returns flat structure.
    // We need to map the flat fields back to the specific schema structure for the API.
    
    // Construct the payload matching IProfile interface
    const payload = {
        name: data.name,
        title: data.title,
        email: data.email,
        phone: data.phone,
        website: data.website || "",
        avatarUrl: data.avatarUrl || "",
        hero: {
            greeting: data.greeting,
            tagline: data.tagline,
            yearsExperience: data.yearsExperience,
            projectsShipped: data.projectsShipped
        },
        about: {
            headline: data.aboutHeadline,
            description: data.aboutDescription,
            // Assuming stats are not editable here for simplicity or add complex logic if needed
            stats: initialData.about?.stats || [] 
        },
        // Preserve existing arrays if not editing them yet
        navLinks: initialData.navLinks || [],
        socialLinks: initialData.socialLinks || [],
        footerNav: initialData.footerNav || [],
        seo: initialData.seo || {}
    };

    const res = await authenticatedFetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error("Failed to update profile");
    
    router.refresh();
  };

  // Flatten nested data for the form fields
  const flatInitialData = {
    ...initialData,
    greeting: initialData.hero?.greeting,
    tagline: initialData.hero?.tagline,
    yearsExperience: initialData.hero?.yearsExperience,
    projectsShipped: initialData.hero?.projectsShipped,
    aboutHeadline: initialData.about?.headline,
    aboutDescription: initialData.about?.description,
  };

  return (
    <ResourceForm
      resourceName="Profile Settings"
      backHref="/admin" // Go back to dashboard root or wherever
      initialData={flatInitialData}
      onSubmit={handleUpdate}
      fields={[
        // Contact Info
        { name: "name", label: "Full Name", type: "text", required: true },
        { name: "title", label: "Professional Title", type: "text", required: true },
        { name: "email", label: "Contact Email", type: "text", required: true },
        { name: "phone", label: "Phone Number", type: "text" },
        { name: "website", label: "Website URL", type: "text" },
        { name: "avatarUrl", label: "Avatar / Profile Image", type: "image" },
        
        // Hero Section
        { name: "greeting", label: "Hero Greeting", type: "text", required: true },
        { name: "tagline", label: "Hero Tagline", type: "text" },
        { name: "yearsExperience", label: "Years of Experience", type: "number" },
        { name: "projectsShipped", label: "Projects Shipped", type: "number" },

        // About Section
        { name: "aboutHeadline", label: "About Headline", type: "text" },
        { name: "aboutDescription", label: "About Description", type: "textarea" },
      ]}
    />
  );
}
