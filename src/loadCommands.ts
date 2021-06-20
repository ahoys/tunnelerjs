import fs from "fs";
import { TCmd } from "./tunneler";
import { p } from "logscribe";

/**
 * Returns a singular function.
 */
const loadCmd = async (
  name: string,
  path: string
): Promise<{ name: string; command: TCmd } | undefined> => {
  if (fs.existsSync(path)) {
    const cmd = await import(path);
    if (typeof cmd.default === "function") {
      return {
        name,
        command: cmd.default,
      };
    }
  }
  return undefined;
};

/**
 * Returns all available command-functions inside the commands folder.
 * All commands need to follow a certain naming syntax (cmd.example.ts)
 * and need to be inside a folder that corresponds the name (example).
 *
 * So, for example: commands/example/cmd.example.ts
 */
export const loadCommands = async (): Promise<
  { name: string; execute: TCmd }[]
> =>
  new Promise((resolve, reject) => {
    try {
      const folders: Promise<{ name: string; command: TCmd } | undefined>[] =
        [];
      fs.readdirSync(__dirname + "/commands").forEach((folder) => {
        const fPath = __dirname + "/commands/" + folder;
        if (fs.lstatSync(fPath).isDirectory()) {
          folders.push(loadCmd(folder, fPath + "/cmd." + folder + ".js"));
        }
      });
      Promise.all(folders).then((cmds) => {
        const commands: { name: string; execute: TCmd }[] = [];
        cmds.forEach((cmd) => {
          if (cmd) {
            commands.push({
              name: cmd.name,
              execute: cmd.command,
            });
          }
        });
        resolve(commands);
      });
    } catch (err) {
      p(err);
      reject();
    }
  });
