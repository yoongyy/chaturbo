#!/usr/bin/env node
import { Command } from "commander";
import { loginCommand } from "./commands/login";
import { whoamiCommand } from "./commands/whoami";
import { scanOpenClawCommand } from "./commands/scanOpenClaw";
import { connectCommand } from "./commands/connect";
import { pairAgentCommand } from "./commands/pairAgent";
import { syncOpenClawCommand } from "./commands/syncOpenClaw";
import { getCliConfigPath, loadCliConfig } from "./services/cliConfig";

const program = new Command();

program
  .name("chaturbo")
  .description("Chaturbo CLI - scan OpenClaw logs and publish sanitized workflow drafts")
  .version("0.1.0");

program
  .command("login")
  .description("Login with email and password")
  .action(async () => {
    await loginCommand();
  });

program
  .command("whoami")
  .description("Show current user")
  .action(async () => {
    await whoamiCommand();
  });

const scanCommand = program.command("scan").description("Scan logs and generate drafts");

scanCommand
  .command("openclaw")
  .description("Scan local OpenClaw history")
  .option("--path <path>", "Path to scan")
  .option("--local-only", "Scan locally without upload", false)
  .action(async (options) => {
    await scanOpenClawCommand(options);
  });

program
  .command("connect")
  .description("One-command OpenClaw connect flow: login/pair or owner-secret connect, scan, and upload")
  .option("--path <path>", "Path to scan")
  .option("--local-only", "Scan locally without upload", false)
  .option("-y, --yes", "Auto-upload detected drafts without confirmation", false)
  .option("--skip-pair", "Skip pairing unattended agent credentials", false)
  .option("--owner-id <ownerId>", "Owner UID from dashboard machine credentials")
  .option("--agent-secret <agentSecret>", "Agent secret from dashboard machine credentials")
  .option("--api-url <apiUrl>", "Override API URL for this machine")
  .action(async (options) => {
    await connectCommand(options);
  });

program
  .command("pair")
  .description("Create and store ownerUid + agentSecret for unattended OpenClaw sync")
  .option("--name <name>", "Credential name", "openclaw-agent")
  .action(async (options) => {
    await pairAgentCommand(options.name);
  });

program
  .command("sync")
  .description("Non-interactive scan + upload for cron jobs")
  .option("--path <path>", "Path to scan")
  .action(async (options) => {
    await syncOpenClawCommand(options);
  });

program
  .command("config")
  .description("Show resolved CLI configuration")
  .action(() => {
    const config = loadCliConfig();
    console.log(`Config file: ${getCliConfigPath()}`);
    console.log(
      JSON.stringify(
        {
          ...config,
          token: config.token ? "[REDACTED_TOKEN]" : undefined,
          agentSecret: config.agentSecret ? "[REDACTED_SECRET]" : undefined
        },
        null,
        2
      )
    );
  });

program.parseAsync(process.argv).catch((err) => {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(1);
});
