"use client";

import SessionSocketInitializer from "@/components/metaverse/UI/SessionSocketInitializer";
import SettingsManager from "@/components/metaverse/UI/SettingsManager";
import { Provider } from "jotai";

const WorldLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider>
      <SessionSocketInitializer>
        <SettingsManager/>
        {children}
      </SessionSocketInitializer>
    </Provider>
  );
};
export default WorldLayout;

