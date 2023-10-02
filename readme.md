# RLSS Cooperative

The RLSS Cooperative (NoToRa Coop) is a group of RL Sideswipe Discord server owners and moderators who work together to promote positivity in the game's community. By working together, helping each other out, and handling server punishments across several large servers, the coop makes sure that toxicity, racism, homophobia, and other undesirable traits do not receive a platform.

This bot is developed to make these cross-server punishments easier. It does this by handling bans and other punishments automatically across all servers when triggered in only one. Rather than needing to ban the user manually on all servers, this automates the process and greatly improves efficiency and ease of use, ensuring the objectives of NoToRa Coop are successful.

## Configuration

This bot uses both a `config.json` and `.env` to store configuration values. Public values are stored in JSON since they don't need to be hidden, but anything secure is not included in version control. In order to run the app as intended, `config.json` should be modified to fit the new implementation, as the default values are configured for the first-party use of this bot. The `.env` value will need to be created separately and can be done so off the following template:

```
DISCORD_BOT_TOKEN="YOUR_TOKEN_HERE"
```

## Contributing

Found a bug? Please [create an issue](https://github.com/rlss-gg/coop/issues), providing as much context as reasonable. If you wish to make the fix yourself, feel free to submit a PR.
