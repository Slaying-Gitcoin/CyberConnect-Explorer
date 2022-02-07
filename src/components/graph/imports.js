import dynamic from "next/dynamic";

// This is a dirty fix for ssr disabled dynamic imports, ts throws an error
export const SigmaContainer = dynamic(() => import("@visdauas/react-sigma-v2").then(mod => mod.SigmaContainer), { ssr: false });
export const SocialGraph = dynamic(() => import("./SocialGraph").then(mod => mod.SocialGraph), { ssr: false });
