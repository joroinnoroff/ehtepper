import React from 'react';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot } from '@mui/lab';
import { Typography } from '@mui/material';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { WordpressPost } from '@/types/WordpressTypes';
interface CustomTimelineProps {
  posts: WordpressPost[];


}
const CustomTimeline: React.FC<CustomTimelineProps> = ({ posts }) => {
  const events = [
    { year: 2015, title: 'Projects' },
    { year: 2016, title: 'Projects' },
    { year: 2018, title: 'Projects' },
    { year: 2017, title: 'Projects' },
    { year: 2019, title: 'Projects' },
    { year: 2020, title: 'Projects' },
    { year: 2021, title: 'Projects' },
    { year: 2022, title: 'Projects' },
    { year: 2023, title: 'Projects' },
    { year: 2024, title: 'Projects' },
  ];



  posts.concat(posts as any as WordpressPost[]);

  posts.forEach((post) => {
    const year = new Date(post.date).getFullYear();
    if (!events.some((event) => event.year === year)) {
      events.push({ year, title: 'Projects' });
    }
  })







  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        visible: { opacity: 1, transition: { staggerChildren: 0.3 } },
        hidden: { opacity: 0 },
      }}
    >
      <motion.h1
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          visible: { opacity: 1 },
          hidden: { opacity: 0 },
        }}
        className="px-10 text-6xl md:text-8xl tracking-widest "
      >
        All <span className='text-[#c117c7]'>projects</span>
      </motion.h1>

      <Timeline position="alternate">
        <div className="grid gap-20 grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 my-5 justify-center place-items-center ">
          {events.map((event, index) => (
            <motion.div
              key={index}
              variants={{
                visible: { opacity: 1, x: 0 },
                hidden: { opacity: 0, x: -20 },
              }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: index === 0 ? 0 : 0.2 }}
            >
              <Link href={`/Projects?=${event.year}`} className=''>
                <TimelineItem>
                  <TimelineSeparator>
                    <TimelineDot color={index % 2 === 0 ? 'primary' : 'secondary'} />
                    {index < events.length - 1 && <TimelineConnector />}
                  </TimelineSeparator>
                  <TimelineContent>
                    <motion.div


                      transition={{ duration: 0.3 }}
                      className={`cursor-pointer transition-all rounded-full px-5 relative z-30  
                        hover:bg-[#c117c7] hover:text-white will-change-transform`}
                    >
                      <Typography variant="h5" component="span">
                        {event.year}
                      </Typography>

                    </motion.div>

                    <Typography variant="h6" component="span" className="text-xs">
                      {event.title}
                    </Typography>



                  </TimelineContent>
                </TimelineItem>
              </Link>
            </motion.div>
          ))}
        </div>
      </Timeline>
    </motion.div>
  );
};

export default CustomTimeline;
