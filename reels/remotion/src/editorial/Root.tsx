// Our own entry root: every composition of the kit, plus ReelEditorial. The kit's Root.tsx stays untouched, so
// kit.py update and a fresh kit.py new never conflict with this folder.
import React from "react";
import { Composition } from "remotion";
import { RemotionRoot } from "../Root";
import { KIT_FPS, reelKitDefaults } from "../ReelKit";
import { EditorialReel } from "./Editorial";

export const EditorialRoot: React.FC = () => (
  <>
    <RemotionRoot />
    <Composition
      id="ReelEditorial"
      component={EditorialReel}
      durationInFrames={90}
      fps={KIT_FPS}
      width={1080}
      height={1920}
      defaultProps={{ ...reelKitDefaults, editorial: {} }}
      calculateMetadata={({ props }) => ({
        durationInFrames: Math.max(1, Math.round(props.captions.duration * KIT_FPS) +
          (props.endCard ? Math.round((props.endCard.seconds ?? 2.6) * KIT_FPS) : 0)),
      })}
    />
  </>
);
