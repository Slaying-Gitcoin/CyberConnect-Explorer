import React, { useContext } from "react";
import "@visdauas/react-sigma-v2/lib/react-sigma-v2.css";
import dynamic from "next/dynamic";
import useWindowDimensions from "./useWindowDimensions";
import { Settings } from "sigma/settings";
const SigmaContainer = dynamic(import("@visdauas/react-sigma-v2").then(mod => mod.SigmaContainer), { ssr: false });
const CustomGraph = dynamic(import("./CustomGraph").then(mod => mod.CustomGraph), { ssr: false });
import getNodeImageProgram from "sigma/rendering/webgl/programs/node.image";
import { Web3Context } from "../../context/Web3Context";

export const SocialGraph = () => {
  const { width, height } = useWindowDimensions();
  const { graphLoading } = useContext(Web3Context);

  let w = width;
  let h = height;

  const settings: Partial<Settings> = {
    nodeProgramClasses: {
      image: getNodeImageProgram()
    }
  };
  if(graphLoading) {
    w = 1;
    h = 1;
  }

  return (
    <React.StrictMode>
      {w && h &&
        <SigmaContainer style={{ width: w, height: h }}
          initialSettings={settings}>
          <CustomGraph />
        </SigmaContainer>
      }
    </React.StrictMode >
  );
}