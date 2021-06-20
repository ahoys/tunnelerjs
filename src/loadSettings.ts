import fs from "fs";
import { p } from "logscribe";

const defaults = typeof process.env === "object" ? process.env : {};

export interface IGuildSettings {
  [key: string]: string | undefined;
}

export interface ISettings {
  [key: string]: IGuildSettings;
  defaults: IGuildSettings;
}

/**
 * Returns default settings for the bots and also
 * guild specific settings if found.
 *
 * Guild-specific settings must be defined in a <guid_id>.setting file,
 * that's located in the dist root folder.
 */
export const loadSettings = (): ISettings => {
  try {
    const base: ISettings = { defaults: {} };
    Object.keys(defaults).forEach((key) => {
      if (key.startsWith("cmd.") || key.startsWith("mw.")) {
        base.defaults[key] = process.env[key];
      }
    });
    fs.readdirSync(__dirname).forEach((item) => {
      const itemPath = __dirname + "/" + item;
      if (fs.lstatSync(itemPath).isFile()) {
        const splitName = item.split(".");
        if (
          item.endsWith(".settings") &&
          splitName.length === 2 &&
          splitName[0] !== ""
        ) {
          // A settings file detected.
          const data = fs.readFileSync(itemPath, "utf-8").toString();
          const lines = data.split(/\n|\r/).filter((l) => l !== "");
          const guild: IGuildSettings = { ...base.defaults };
          lines.forEach((l) => {
            const lineSplit = l.split("=");
            if (
              lineSplit.length === 2 &&
              (lineSplit[0].startsWith("cmd.") ||
                lineSplit[0].startsWith("mw.")) &&
              lineSplit[1] !== ""
            ) {
              // A valid settings line read.
              guild[lineSplit[0]] = lineSplit[1];
            }
          });
          base[splitName[0]] = guild;
        }
      }
    });
    return base;
  } catch (err) {
    p(err);
    return {
      defaults,
    };
  }
};
