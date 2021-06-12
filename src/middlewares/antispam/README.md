## About

Antispam middleware is created to stop spam-attacks. The middleware uses various heuristics to detect spamming and if spamming is detected, acts accordingly by either warning the user or outright banning the user.

---

## Configuration

Done via .env file.
For example: `ANTISPAM_BAN_DAYS=3`

### Environment (.env) parameters:

- `ANTISPAM_MAX_WARNINGS`
  - How many warnings before punishment.
  - Default 2
- `ANTISPAM_BAN_DAYS`
  - How many days does the ban last.
  - Default 1
- `ANTISPAM_RAPID_MESSAGES`
  - How fast must the users send messages to be considered spamming (on average).
  - Default 1024

---

## Author

- Ari Höysniemi, 2021/06/12
