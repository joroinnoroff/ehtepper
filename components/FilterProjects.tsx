import React, { useEffect, useState } from "react";
import { DatePicker } from "@nextui-org/react";
import { today, getLocalTimeZone } from "@internationalized/date";
import { useLocale, useDateFormatter } from "@react-aria/i18n";
import { WordpressPost } from "@/types/WordpressTypes";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ListFilter, MoreHorizontal, SlidersHorizontal, X } from "lucide-react";

interface FilterProjectsProps {
  posts: WordpressPost[];
  setFilteredPosts: (posts: WordpressPost[]) => void;
}

const FilterProjects: React.FC<FilterProjectsProps> = ({ posts, setFilteredPosts }) => {
  let defaultDate = today(getLocalTimeZone());
  const [value, setValue] = useState(defaultDate);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");

  const SearchPosts = (search: string) => {
    setSearch(search); // Update the search state
    const filtered = posts.filter(post => post.title.rendered.toLowerCase().includes(search.toLowerCase()));
    setFilteredPosts(filtered);
    if (search.length === 0) {
      return <p>No results found</p>;
    }
    console.log(search); // Log the input value
  };

  let { locale } = useLocale();
  let formatter = useDateFormatter({ dateStyle: "full" });

  // Extract unique categories
  const uniqueCategories = Array.from(
    // @ts-ignore
    new Set(posts.flatMap(post => post.categories.map(category => category.name)))
  );

  const onCategoryClick = (category: string) => {
    if (selectedCategory === category) {
      // If the same category is clicked again, clear the selection and show all posts
      setSelectedCategory("");
      setFilteredPosts(posts); // Reset to all posts
    } else {
      setSelectedCategory(category);


      const filtered = posts.filter(post =>
        // @ts-ignore
        post.categories.some(cat => cat.name === category)

      );



      console.log(selectedCategory)

      setFilteredPosts(filtered);
    }
  };





  const [showMore, setShowMore] = useState(false);

  const toggleVisibility = () => setIsOpen(!isOpen);
  const toggleShowMore = () => setShowMore(!showMore);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const containerVariants = {
    hidden: { width: "0", opacity: 0 },
    visible: { width: isMobile ? "100%" : '100vw', opacity: 1, transition: { duration: 0.4, ease: "easeInOut" } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  const visibleCategories = showMore ? uniqueCategories : uniqueCategories.slice(0, 4);




  return (
    <div className="flex flex-col gap-4 w-full max-w-sm ">


      <h2 className="m">Filtering options</h2>
      <motion.div className="flex flex-col gap-4 items-start xl:w-screen h-24">

        <motion.div
          className={`flex flex-row  h-auto gap-4 items-center max-w-3xl  flex-wrap  
            }`}
          initial="hidden"
          animate={isOpen ? "hidden" : "visible"}
          variants={containerVariants}
        >
          {visibleCategories
            .filter(category => category !== "Projects")
            .map((category, idx) => (
              <motion.button
                variants={itemVariants}
                initial="hidden"
                animate={isOpen ? "hidden" : "visible"}
                key={idx}
                className={`px-4 py-2 text-sm ${selectedCategory === category
                  ? "bg-purple-400 text-black"
                  : "bg-black text-purple-400"
                  }`}
                onClick={() => onCategoryClick(category)}
              >
                {category}
              </motion.button>
            ))}
          {!showMore && uniqueCategories.length > 4 && (
            <button
              onClick={toggleShowMore}
              className="px-4 py-2 text-sm bg-purple-400 text-white"
            >
              <ChevronRight />
            </button>
          )}
          {showMore && (
            <button
              onClick={toggleShowMore}
              className="px-4 py-2 text-sm bg-black text-purple-400"
            >
              <ChevronLeft />
            </button>
          )}
        </motion.div>
        <div>
          <input
            type="text"
            placeholder="Search here..."
            className="bg-zinc-300 p-2 rounded-lg active:border-none focus:outline-none"
            value={search}
            onChange={(e) => SearchPosts(e.target.value)}
          />

        </div>
      </motion.div>


    </div>
  );
};

export default FilterProjects;
