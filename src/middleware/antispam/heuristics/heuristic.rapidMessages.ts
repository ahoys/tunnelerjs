import { p } from "logscribe";
import { IDbUser } from "../mw.antispam";

/**
 * Flags rapid messages heuristic if the user
 * has sent messages too often on average.
 * @param dbUser
 * @returns
 */
export const rapidMessages = (dbUser: IDbUser, limit: number): boolean => {
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
