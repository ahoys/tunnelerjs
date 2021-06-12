import fs from "fs";
import { TMw } from "./tunneler";
import { p } from "logscribe";

/**
 * Returns a singular function.
 */
const loadMw = async (path: string): Promise<TMw | undefined> => {
  if (fs.existsSync(path)) {
    const mw = await import(path);
    if (typeof mw.default === "function") {
      return mw.default;
    }
  }
  return undefined;
};

/**
 * Returns all available middleware-functions inside the middlewares folder.
 * All middlewares need to follow a certain naming syntax (mw.example.ts)
 * and need to be inside a folder that corresponds the name (example).
 *
 * So, for example: middlewares/example/mw.example.ts
 */
export const loadMiddlewares = async (): Promise<TMw[]> =>
  new Promise((resolve, reject) => {
    try {
      const folders: Promise<TMw | undefined>[] = [];
      fs.readdirSync(__dirname + "/middlewares").forEach((folder) => {
        const fPath = __dirname + "/middlewares/" + folder;
        if (fs.lstatSync(fPath).isDirectory()) {
          folders.push(loadMw(fPath + "/mw." + folder + ".js"));
        }
      });
      Promise.all(folders).then((mws) => {
        const onMessages: TMw[] = [];
        mws.forEach((mw) => {
          if (mw && process.env[`mw.${mw.name}`] === "true") {
            onMessages.push(mw);
          }
        });
        resolve(onMessages);
      });
    } catch (err) {
      p(err);
      reject();
    }
  });
