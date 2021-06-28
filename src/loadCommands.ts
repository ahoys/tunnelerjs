import fs from "fs";
import { TCmd } from "./tunneler";
import { p } from "logscribe";

type TSlashCommand = { [key: string]: string | number };

export interface ICommand {
  name: string;
  execute: TCmd;
  slashCommands?: TSlashCommand;
}

/**
 * Returns a singular function.
 */
const loadCmd = async (
  name: string,
  path: string
): Promise<ICommand | undefined> => {
  if (fs.existsSync(path)) {
    const cmd = await import(path);
    if (typeof cmd.default === "function") {
      return {
        name,
        execute: cmd.default,
        slashCommands: cmd.slashCommands,
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
export const loadCommands = async (): Promise<ICommand[]> =>
  new Promise((resolve, reject) => {
    try {
      const folders: Promise<ICommand | undefined>[] = [];
      fs.readdirSync(__dirname + "/commands").forEach((folder) => {
        const fPath = __dirname + "/commands/" + folder;
        if (fs.lstatSync(fPath).isDirectory()) {
          folders.push(loadCmd(folder, fPath + "/cmd." + folder + ".js"));
        }
      });
      Promise.all(folders).then((cmds) => {
        const commands: ICommand[] = [];
        cmds.forEach((cmd) => {
          if (cmd) {
            commands.push({
              name: cmd.name,
              execute: cmd.execute,
              slashCommands: cmd.slashCommands,
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
