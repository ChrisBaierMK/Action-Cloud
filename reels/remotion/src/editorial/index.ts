// Entry point for renders in our caption style:
//   npx remotion render src/editorial/index.ts ReelEditorial out/<name>.mp4 --props=<absolute path>/edit/<id>/editorial-props.json
import { registerRoot } from "remotion";
import { EditorialRoot } from "./Root";

registerRoot(EditorialRoot);
