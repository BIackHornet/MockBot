# Discord MockBot

This bot was created from https://github.com/discordjs/voice-examples/tree/main/recorder and suited to my needs.

I want to alter this bot to listen to a targeted user, and replay their voice back to them pitch shifted.

## To-Do List

~~1. Change record command to mock~~\
~~2. When record command is used, bot will join the channel. Remove Join command.~~\
3. Plays back the voice file\
~~4. Parameter can be set to mock indefinitely~~\
5. Recording is pitch shifted and sped up, then bot plays back recording\
6. Bot leaves channel after playback\
~~7. Make it so commands auto deploy~~


## Usage

```
# Install and Build
npm install
npm run build

# Create your bot token file
cp config.example.json config.json
nano config.json

# Start the bot
npm start
```
