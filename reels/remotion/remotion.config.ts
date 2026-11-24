// Options: https://remotion.dev/docs/config (each one is also a CLI flag).
import fs from "node:fs";
import path from "node:path";
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);

// Claude Code cloud containers ship a headless Chrome under /opt/pw-browsers and block the host Remotion would
// download its own from. Use the pre-installed one when it is there; on any other machine this does nothing and
// Remotion manages its browser as usual.
const base = "/opt/pw-browsers";
const dir = fs.existsSync(base)
  ? fs.readdirSync(base).filter((d) => d.startsWith("chromium_headless_shell-")).sort().pop()
  : undefined;
const exe = dir ? path.join(base, dir, "chrome-headless-shell-linux64", "chrome-headless-shell") : undefined;
if (exe && fs.existsSync(exe)) Config.setBrowserExecutable(exe);
