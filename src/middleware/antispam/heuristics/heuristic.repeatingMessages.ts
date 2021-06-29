import { p } from "logscribe";
import { IDbUser } from "../mw.antispam";

/**
 * Returns true if the previous messages are repeating the
 * same content.
 */
export const repeatingMessages = (
  dbUser: IDbUser,
  percentage: number,
  warnings = 0
): boolean => {
  try {
    const content = dbUser.content;
    percentage = percentage > 1 ? 1 : percentage;
    percentage = percentage < 0 ? 0 : percentage;
    if (content.length <= 2) {
      // Not enough content to be precise.
      return false;
    } else if (content.every((v) => v === content[0])) {
      // Mass spamming.
      return true;
    }
    // Look for duplicate content.
    let duplicates = 0;
    content.forEach((text, i) => {
      if (content.some((v, r) => v === text && r > i)) {
        duplicates += 1;
      }
    });
    // We'll ease the heuristic after a warning just to give
    // the user a chance to make things right.
    const result = (duplicates - warnings) / content.length;
    return result > percentage;
  } catch (err) {
    p(err);
    return false;
  }
};
