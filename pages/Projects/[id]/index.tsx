"use client"
import TableofContents from "@/components/TableofContents";
import { TOCContext, useTOCContextValues } from "@/utils/TOCContext";
import TrackedSection from "@/components/TrackedSection";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { WordpressPost } from "@/types/WordpressTypes";
import { motion } from "framer-motion";
import { Images } from "lucide-react";

const getTrackedTitle = (sectionId: number, Trackedtitle: string) => {
  return `${sectionId + 1}: ${Trackedtitle}`;
};

export default function ProjectID() {

  const { values } = useTOCContextValues();
  const router = useRouter();
  const { id } = router.query;

  const [projectData, setProjectData] = useState<WordpressPost | null>(null);
  const [sections, setSections] = useState<JSX.Element[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjectData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/product-id/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch project data: ${response.statusText}`);
        }
        const projectData = await response.json();
        setProjectData(projectData);

      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProjectData();
    }
  }, [id]);

  useEffect(() => {
    if (projectData) {
      const parser = new DOMParser();
      const doc = parser.parseFromString(projectData.content?.rendered || "", 'text/html');
      const h2Elements = doc.querySelectorAll('h2');

      const newSections: JSX.Element[] = [];
      h2Elements.forEach((h2, index) => {
        const trackedTitle = getTrackedTitle(index, h2.textContent || '');
        const sectionContent = h2.nextElementSibling?.outerHTML || '';

        newSections.push(
          <TrackedSection key={index} sectionId={index} tocTitle={trackedTitle} isFirst={index === 0} isLast={index === h2Elements.length - 1}>
            {isLoading ? <div className="w-40 h-10 bg-zinc-400 animate-pulse rounded-lg" /> : <h2>{h2.textContent}</h2>}
            {isLoading ? <div className="w-full my-3 h-40 bg-zinc-400 animate-pulse rounded-lg" /> : <div dangerouslySetInnerHTML={{ __html: sectionContent }} />}
          </TrackedSection>
        );
      });

      setSections(newSections);
    }
  }, [projectData]);

  return (
    <main className="min-h-screen h-auto p-1 xl:p-7">
      <TOCContext.Provider value={values}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="">
          <p className="mb-0 h-2 fixed top-52 tracking-widest text-xl"><Images />Gallery</p>
          <TableofContents />
        </motion.div>
        <article className=" mx-auto max-w-[80ch] w-[80vw] lg:w-[50vw] font-mono my-72 xl:mt-52">
          <div className="mt-40 flex justify-center">
            {isLoading ? <h1 className="text-center h-8 w-52 rounded-md animate-pulse bg-zinc-400"></h1> : <h1>{projectData?.title?.rendered}</h1>}
          </div>

          <div className="py-2">
            {isLoading ? <span className="h-5 w-32 rounded-md animate-pulse bg-zinc-400 flex items-center justify-center mx-auto"></span> : <span className="text-xs text-neutral-600 flex items-center justify-center">Made by: {projectData?.author} -
              {projectData?.date_gmt && new Date(projectData.date_gmt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '.')}</span>}

          </div>
          {sections}
          <section className="">
            <div className="h-[375px] relative">
              {isLoading ? <div className="w-full h-[375px] bg-zinc-300 animate-pulse rounded-md" /> : projectData?.imageUrl && <Image src={projectData.imageUrl} alt="project photo" fill className="object-contain" />}
            </div>
            <p className="my-5 text-neutral-600 text-center">Photo by: First n Lastname</p>
          </section>
        </article>
      </TOCContext.Provider>
    </main>
  );
}