## About

Antispam middleware is created to stop spam-attacks. The middleware uses various heuristics to detect spamming and if spamming is detected, acts accordingly by either warning the user or outright banning the user.

---

## Configuration

Done via .env file.
For example: `mw.antispam.ban_days=3`

### Environment (.env) parameters:

- `mw.antispam.warnings`
  - How many warnings before punishment.
  - Default 2
- `mw.antispam.ban_days`
  - How many days does the ban last.
  - Default 1
- `mw.antispam.rapid_messages_avg`
  - How fast must the users send messages to be considered spamming (on average).
  - Default 1024
- `mw.antispam.repeating_messages_percentage`
  - How much of the content written by the user needs to be equal to be considered as spam.
  - Give in percentages, as in 0 = 0%, 0.5 = 50%, 1 = 100%.
  - Default 0.5

---

## Author

- Ari Höysniemi, 2021/06/12
