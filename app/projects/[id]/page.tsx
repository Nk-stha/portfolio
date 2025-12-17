import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Project } from "@/lib/db/models";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getProject(id: string) {
  await connectToDatabase();
  const project = await Project.findOne({
    _id: id,
    deletedAt: null,
  }).lean();

  if (!project) return null;
  return JSON.parse(JSON.stringify(project));
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    notFound();
  }

  return (
    <article className="min-h-screen bg-[#0a0a0a] text-white pb-20">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px] w-full">
        {project.image ? (
           <Image
             src={project.image}
             alt={project.title}
             fill
             className="object-cover opacity-50"
             priority
           />
        ) : (
            <div className="absolute inset-0 bg-[#111]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 w-full p-4 sm:p-6 pb-12">
            <div className="max-w-4xl mx-auto">
                <Link 
                    href="/projects"
                    className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors text-sm group"
                >
                    <Icon name="arrow_back" size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Projects
                </Link>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-primary mb-4 font-medium uppercase tracking-wider">
                    <span className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                        {project.category}
                    </span>
                    {project.isFeatured && (
                        <span className="bg-primary px-3 py-1 rounded-full text-white">
                            <Icon name="star" size={12} className="inline mr-1" /> Featured
                        </span>
                    )}
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                    {project.title}
                </h1>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-4">
                    {project.liveUrl && (
                        <a 
                            href={project.liveUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                            <Icon name="link" size={18} className="mr-2" />
                            Live Demo
                        </a>
                    )}
                    {project.sourceUrl && (
                        <a 
                            href={project.sourceUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-medium transition-colors border border-white/10"
                        >
                            <Icon name="code" size={18} className="mr-2" />
                            Source Code
                        </a>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-12">
          {/* Tech Stack */}
          {project.techStack && project.techStack.length > 0 && (
              <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                      <Icon name="code" className="text-primary mr-2" size={24} />
                      Technologies Used
                  </h2>
                  <div className="flex flex-wrap gap-3">
                      {project.techStack.map((tech: string, idx: number) => (
                          <span 
                              key={idx} 
                              className="bg-[#111] border border-primary/20 text-white px-4 py-2 rounded-lg text-sm font-medium"
                          >
                              {tech}
                          </span>
                      ))}
                  </div>
              </div>
          )}

          {/* Description */}
          <div className="mb-12">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <Icon name="article" className="text-primary mr-2" size={24} />
                  About This Project
              </h2>
              <div className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:text-white prose-p:text-gray-300 prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-strong:text-white prose-code:text-primary prose-pre:bg-[#111] prose-pre:border prose-pre:border-[#222]">
                  <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                      {project.description}
                  </ReactMarkdown>
              </div>
          </div>

          {/* Additional Images */}
          {project.images && project.images.length > 0 && (
              <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6 flex items-center">
                      <Icon name="photo_library" className="text-primary mr-2" size={24} />
                      Gallery
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {project.images.map((img: string, idx: number) => (
                          <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-[#222]">
                              <Image 
                                  src={img} 
                                  alt={`${project.title} screenshot ${idx + 1}`}
                                  fill
                                  className="object-cover"
                              />
                          </div>
                      ))}
                  </div>
              </div>
          )}
          
          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-[#1a1a1a] flex justify-between items-center">
              <Link 
                 href="/projects"
                 className="text-gray-400 hover:text-white transition-colors text-sm font-medium"
              >
                  ← More Projects
              </Link>
              <a href="#" className="text-gray-400 hover:text-primary transition-colors">
                  <Icon name="arrow_upward" />
              </a>
          </div>
      </div>
    </article>
  );
}
