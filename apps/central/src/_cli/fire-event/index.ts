import { subcommands } from "cmd-ts";

import { dailyTriggerCommand } from "./daily-trigger.js";
import { hourlyTriggerCommand } from "./hourly-trigger.js";
import { unitCreatedCommand } from "./unit-created.js";
import { unitDeletedCommand } from "./unit-deleted.js";
import { unitUpdatedCommand } from "./unit-updated.js";
import { userAssignedToUnitCommand } from "./user-assigned-to-unit.js";
import { userCreatedCommand } from "./user-created.js";
import { userEmailAddedCommand } from "./user-email-added.js";
import { userEmailRemovedCommand } from "./user-email-removed.js";
import { userEmailSetPrimaryCommand } from "./user-email-set-primary.js";
import { userUnassignedFromUnitCommand } from "./user-unassigned-from-unit.js";
import { userUpdatedCommand } from "./user-updated.js";

const subs = [
  dailyTriggerCommand,
  hourlyTriggerCommand,
  unitCreatedCommand,
  unitDeletedCommand,
  unitUpdatedCommand,
  userAssignedToUnitCommand,
  userUnassignedFromUnitCommand,
  userCreatedCommand,
  userUpdatedCommand,
  userEmailAddedCommand,
  userEmailSetPrimaryCommand,
  userEmailRemovedCommand,
].sort((a, b) => a.name.localeCompare(b.name));

export const FIRE_EVENT_CLI = subcommands({
  name: "fire-event",
  cmds: Object.fromEntries(subs.map((cmd) => [cmd.name, cmd])),
});
