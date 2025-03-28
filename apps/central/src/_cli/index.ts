import { subcommands } from "cmd-ts";

import { API_CLI } from "./api/index.js";
import { DB_CLI } from "./db/index.js";
import { FIRE_EVENT_CLI } from "./fire-event/index.js";
import { IMAGES_CLI } from "./images/index.js";
import { SEED_CLI } from "./seed/index.js";
import { UTILS_CLI } from "./utils/index.js";
import { WORKER_CLI } from "./worker/index.js";

const subs = [
  API_CLI,
  SEED_CLI,
  UTILS_CLI,
  DB_CLI,
  FIRE_EVENT_CLI,
  WORKER_CLI,
  IMAGES_CLI,
].sort((a, b) => a.name.localeCompare(b.name));

export const ROOT_CLI = subcommands({
  name: "app-cli",
  cmds: Object.fromEntries(subs.map((cmd) => [cmd.name, cmd])),
});
