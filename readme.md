![RLSS Keyart](https://3k4812ts.media.zestyio.com/RLS_KeyArt_Primary_Horiz_RGB_4K.jpg)

# Rainmaker

Rainmaker is a bot made to handle cross-server moderation for RL Sideswipe servers. It does this by propagating bans and other punishments automatically across all servers when triggered by one. Rainmaker is available for any server, however only approved servers can trigger propagated punishments.

## Configuration

This bot uses both a `config.json` and `.env` to store configuration values. Public values are stored in JSON since they don't need to be hidden, but anything secure is not included in version control. In order to run the app as intended, `config.json` should be modified to fit the new implementation, as the default values are configured for the first-party use of this bot. The `.env` file will need to be created separately and can be done so off the following template:

```sh
DISCORD_BOT_TOKEN="YOUR_TOKEN_HERE"
```

## Contributing

Found a bug? Please [create an issue](https://github.com/rlss-gg/coop/issues), providing as much context as reasonable. If you wish to make the fix yourself, feel free to submit a PR.
