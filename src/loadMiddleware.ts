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
 * Returns all available middleware-functions inside the middleware folder.
 * All middleware need to follow a certain naming syntax (mw.example.ts)
 * and need to be inside a folder that corresponds the name (example).
 *
 * So, for example: middleware/example/mw.example.ts
 */
export const loadMiddleware = async (): Promise<
  { name: string; execute: TMw }[]
> =>
  new Promise((resolve, reject) => {
    try {
      const folders: Promise<TMw | undefined>[] = [];
      fs.readdirSync(__dirname + "/middleware").forEach((folder) => {
        const fPath = __dirname + "/middleware/" + folder;
        if (fs.lstatSync(fPath).isDirectory()) {
          folders.push(loadMw(fPath + "/mw." + folder + ".js"));
        }
      });
      Promise.all(folders).then((mws) => {
        const onMessages: { name: string; execute: TMw }[] = [];
        mws.forEach((mw) => {
          if (mw) {
            onMessages.push({
              name: mw.name,
              execute: mw,
            });
          }
        });
        resolve(onMessages);
      });
    } catch (err) {
      p(err);
      reject();
    }
  });
