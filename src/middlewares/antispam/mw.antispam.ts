import { Client, Message } from "discord.js";
import { p } from "logscribe";
import { IFlags } from "../../tunneler";

const antispam = (client: Client, message: Message, flags: IFlags): void => {
  try {
    const { isDirectMessage } = flags;
    console.log(message.content, isDirectMessage);
  } catch (err) {
    p(err);
  }
};

export default antispam;
