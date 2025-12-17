import Link from "next/link";
import Image from "next/image";
import { connectToDatabase } from "@/lib/db/mongoose";
import { Project } from "@/lib/db/models";
import { Icon } from "@/components/ui/Icon";

export const dynamic = "force-dynamic";

async function getProjects() {
  await connectToDatabase();
  const projects = await Project.find({
    deletedAt: null,
  })
    .sort({ order: 1, createdAt: -1 })
    .lean();

  return JSON.parse(JSON.stringify(projects));
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-16">
       {/* Background Gradient */}
       <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/10 via-[#0a0a0a] to-[#0a0a0a] pointer-events-none" />
       
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-primary font-bold tracking-[0.2em] text-sm uppercase mb-3 block">
            Portfolio
          </span>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Featured <span className="text-primary">Projects</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            A showcase of my work across different domains and technologies.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-[#1a1a1a] rounded-full flex items-center justify-center mx-auto mb-4 text-gray-500">
                <Icon name="folder" size={32} />
            </div>
            <p className="text-gray-400">No projects available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project: any) => (
              <Link
                key={project._id}
                href={`/projects/${project._id}`}
                className="group bg-[#111] border border-[#1a1a1a] rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,87,34,0.1)] flex flex-col h-full"
              >
                <div className="aspect-video relative overflow-hidden bg-gray-900">
                   {project.image ? (
                      <Image
                        src={project.image}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                   ) : (
                       <div className="w-full h-full flex items-center justify-center text-gray-700">
                           <Icon name="image" size={48} />
                       </div>
                   )}
                   {project.isFeatured && (
                       <div className="absolute top-4 left-4 bg-primary px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg">
                           <Icon name="star" size={12} className="inline mr-1" /> Featured
                       </div>
                   )}
                   <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-white border border-white/10">
                       {project.category}
                   </div>
                </div>
                
                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3 flex-grow">
                    {project.description}
                  </p>

                  {project.techStack && project.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                          {project.techStack.slice(0, 3).map((tech: string, idx: number) => (
                              <span key={idx} className="bg-[#1a1a1a] text-primary text-xs px-2 py-1 rounded-full border border-primary/20">
                                  {tech}
                              </span>
                          ))}
                          {project.techStack.length > 3 && (
                              <span className="text-gray-500 text-xs px-2 py-1">
                                  +{project.techStack.length - 3} more
                              </span>
                          )}
                      </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-[#1a1a1a] mt-auto">
                    <span className="text-primary text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform">
                        View Details <Icon name="arrow_forward" size={16} className="ml-1" />
                    </span>
                    <div className="flex gap-2">
                        {project.liveUrl && (
                            <Icon name="link" size={16} className="text-gray-500" />
                        )}
                        {project.sourceUrl && (
                            <Icon name="code" size={16} className="text-gray-500" />
                        )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
