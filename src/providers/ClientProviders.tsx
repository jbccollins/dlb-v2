"use client";

import store from "@/store";
import { Provider } from "jotai";
import { DevTools /*, useAtomsDevtools */ } from "jotai-devtools";
import { ReactNode } from "react";

import "jotai-devtools/styles.css";

export default function ClientProviders({ children }: { children: ReactNode }) {
  //useAtomsDevtools("Testing 123", { store });
  return (
    <Provider store={store}>
      <DevTools store={store} />
      {children}
    </Provider>
  );
}
