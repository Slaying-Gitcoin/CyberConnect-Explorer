import React, { useContext } from "react";
import "@visdauas/react-sigma-v2/lib/react-sigma-v2.css";
import useWindowDimensions from "./useWindowDimensions";
import { Settings } from "sigma/settings";
import { GraphContext } from "../../context/GraphContext";
import { SigmaContainer, SocialGraph } from "./imports";
import getNodeImageProgram from "./webgl/image.node";

export const Graph = () => {
  const { width, height } = useWindowDimensions();
  const { graphLoading, hideGraph } = useContext(GraphContext);

  let w = width;
  let h = height;

  const settings: Partial<Settings> = {
    nodeProgramClasses: {
      image: getNodeImageProgram()
    }
  };

  if (graphLoading || hideGraph) {
    w = 1;
    h = 1;
  }

  return (
    <React.StrictMode>
      {w && h &&
        <SigmaContainer style={{ width: w, height: h }}
          initialSettings={settings}>
          <SocialGraph />
        </SigmaContainer>
      }
    </React.StrictMode >
  );
}