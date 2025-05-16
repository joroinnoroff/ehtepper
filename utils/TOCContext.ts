import { Dispatch, SetStateAction, useState } from "react";
import { createContext } from "react";

export type Section = {
  id: number;
  title: string;
}

type TOCContextType = {
  sections: Section[];
  registerSection: (section: Section) => void;
  activeSection: number;
  setActiveSection: Dispatch<SetStateAction<number>>;
};

export const TOCContext = createContext<TOCContextType>({
  sections: [],
  registerSection: () => { },
  activeSection: 0,
  setActiveSection: () => { },
});

export const useTOCContextValues = () => {
  const [activeSection, setActiveSection] = useState(-1);
  const [sections, setSections] = useState<Section[]>([]);

  const registerSection = (section: Section) => {
    setSections((val) => val.concat([section]));
  };


  const proccessSections = (sections: Section[]) => {
    const ids = sections.map(({ id }) => id)
    const uniqueSections = sections.filter(({ id }, index) => !ids.includes(id, index + 1)
    ).sort((a, b) => a.id - b.id);

    return uniqueSections;
  }

  return {
    values: {
      sections: proccessSections(sections),
      registerSection,
      activeSection,
      setActiveSection
    }
  }
}