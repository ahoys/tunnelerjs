import fs from "fs";
import { TCmd } from "./tunneler";
import { p } from "logscribe";

/**
 * Returns a singular function.
 */
const loadCmd = async (path: string): Promise<TCmd | undefined> => {
  if (fs.existsSync(path)) {
    const cmd = await import(path);
    if (typeof cmd.default === "function") {
      return cmd.default;
    }
  }
  return undefined;
};

/**
 * Returns all available command functions inside the commands folder.
 * All commands need to follow a certain naming syntax (cmd.example.ts)
 * and need to be inside a folder that corresponds the name (example).
 *
 * So, for example: commands/example/cmd.example.ts
 */
export const loadCommands = async (): Promise<TCmd[]> =>
  new Promise((resolve, reject) => {
    try {
      const folders: Promise<TCmd | undefined>[] = [];
      fs.readdirSync(__dirname + "/commands").forEach((folder) => {
        const fPath = __dirname + "/commands/" + folder;
        if (fs.lstatSync(fPath).isDirectory()) {
          folders.push(loadCmd(fPath + "/cmd." + folder + ".js"));
        }
      });
      Promise.all(folders).then((cmds) => {
        const onMessages: TCmd[] = [];
        cmds.forEach((cmd) => {
          if (cmd) {
            onMessages.push(cmd);
          }
        });
        resolve(onMessages);
      });
    } catch (err) {
      p(err);
      reject();
    }
  });
