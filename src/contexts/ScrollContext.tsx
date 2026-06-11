import React, { createContext, useContext, useState } from "react";

interface ScrollContextType {
  scrolledDown: boolean;
  setScrolledDown: (v: boolean) => void;
}

const ScrollContext = createContext<ScrollContextType>({
  scrolledDown: false,
  setScrolledDown: () => {},
});

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const [scrolledDown, setScrolledDown] = useState(false);
  return (
    <ScrollContext.Provider value={{ scrolledDown, setScrolledDown }}>
      {children}
    </ScrollContext.Provider>
  );
}

export const useScroll = () => useContext(ScrollContext);
