import { print } from "logscribe";
import { ISettings } from "./loadSettings";
import { ICommand } from "./loadCommands";
import superagent from "superagent";

type TSettingsBody = ICommand["slashCommands"][];

/**
 * Creates or updates all the available slash-commands.
 * https://discord.com/developers/docs/interactions/slash-commands
 */
export const postSlashCommands = (
  applicationId: string,
  token: string,
  settings: TSettingsBody
): Promise<void> =>
  new Promise((resolve, reject) => {
    const ids = settings.map((s) => s?.guild_id);
    ids.forEach((guildId, index) => {
      if (guildId && settings[index]) {
        superagent
          .post(
            `https://discord.com/api/v8/applications/${applicationId}/guilds/${guildId}/commands`
          )
          .type("application/json")
          .set("Authorization", `Bot ${token}`)
          .send(settings[index])
          .then(() => {
            resolve();
          })
          .catch((err) => {
            print(err.message);
            reject();
          });
      }
    });
  });

export const getGlobalSlashBody = (
  applicationId: string,
  settings: ISettings,
  commands: ICommand[]
): TSettingsBody => {
  const body: TSettingsBody = [];
  const defaults = settings.defaults ?? {};
  commands.forEach((cmd) => {
    const { name, slashCommands } = cmd;
    if (slashCommands && defaults["cmd." + name] === "true") {
      body.push({ ...slashCommands, application_id: applicationId });
    }
  });
  return body;
};

export const getGuildSlashBodies = (
  applicationId: string,
  settings: ISettings,
  commands: ICommand[]
): TSettingsBody => {
  const body: TSettingsBody = [];
  const keys = Object.keys(settings).filter((key) => key !== "defaults");
  keys.forEach((key) => {
    commands.forEach((cmd) => {
      const { name, slashCommands } = cmd;
      if (slashCommands && settings[key]["cmd." + name] === "true") {
        body.push({
          ...slashCommands,
          application_id: applicationId,
          guild_id: key,
        });
      }
    });
  });
  return body;
};
