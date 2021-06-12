import { p } from "logscribe";
import { IDbUser } from "../mw.antispam";

const limit: number =
  typeof process.env.MW_ANTISPAM_RAPID_MESSAGES === "string"
    ? Number(process.env.MW_ANTISPAM_RAPID_MESSAGES)
    : 1024;

/**
 * Flags rapid messages heuristic if the user
 * has sent messages too often on average.
 * @param dbUser
 * @returns
 */
export const rapidMessages = (dbUser: IDbUser): boolean => {
  try {
    const timestamps = dbUser.timestamps.sort();
    if (timestamps.length > 1) {
      const diffs = [];
      for (let i = 0; i < timestamps.length - 1; i++) {
        diffs[i] = timestamps[i + 1] - timestamps[i];
      }
      const total = diffs.reduce((a, b) => a + b, 0);
      const avg = total / diffs.length;
      return avg < limit;
    }
    return false;
  } catch (err) {
    p(err);
    return false;
  }
};
