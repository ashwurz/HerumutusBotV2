/// <reference path= "./types/common/discord.d.ts"/>
import fs from 'node:fs';
import path from 'node:path';
import 'dotenv/config.js';
import { Client, Collection, GatewayIntentBits } from "discord.js"
import ready from "./listeners/ready";
import command from "./listeners/command"
import express from 'express';
import {Request, Response} from 'express'

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const commandModule = require(filePath);
  const moduleName = file.split('.')[0]
  client.commands.set(commandModule[moduleName]["data"]["name"], commandModule[moduleName]);
}

ready(client);
command(client);

client.login(process.env.TOKEN)

const port = process.env.PORT || 5000
const app = express();
app.get("/", (request: Request, response: Response) => {
  const ping = new Date();
  ping.setHours(ping.getHours() - 3);
  console.log(`Ping received at ${ping.getUTCHours()}:${ping.getUTCMinutes()}:${ping.getUTCSeconds()}`);
  response.sendStatus(200);
});
app.listen(port, () => console.log(`i'm listening on port ${port}`)); 