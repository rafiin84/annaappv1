import React, { createContext, useContext, useState } from "react";
import { UserLocation } from "@/types";

interface LocationContextType {
  location: UserLocation;
  setLocation: (location: UserLocation) => void;
}

const defaultLocation: UserLocation = {
  state: "Tamil Nadu",
  district: "Coimbatore",
  constituency: "Coimbatore North",
};

const LocationContext = createContext<LocationContextType>({
  location: defaultLocation,
  setLocation: () => {},
});

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<UserLocation>(defaultLocation);

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}
