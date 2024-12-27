import { create } from "zustand";
import defaultJson from "@/lib/defaultJson.json";

interface JsonActions {
  setContent: (content: string) => void;
}

const initialStates = {
  content: JSON.stringify(defaultJson, null, 2)
};

type initialStates = typeof initialStates;

export const useJson = create<initialStates & JsonActions>(set => {
  return {
    ...initialStates,
    setContent: content => set({ content })
  };
});
