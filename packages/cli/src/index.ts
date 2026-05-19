#!/usr/bin/env node
import { Command } from "commander";
import { loginCommand } from "./commands/login";
import { whoamiCommand } from "./commands/whoami";
import { scanOpenClawCommand } from "./commands/scanOpenClaw";
import { connectCommand } from "./commands/connect";
import { pairAgentCommand } from "./commands/pairAgent";
import { syncOpenClawCommand } from "./commands/syncOpenClaw";
import { marketplaceSearchCommand } from "./commands/marketplaceSearch";
import { marketplaceBuyCommand } from "./commands/marketplaceBuy";
import { marketplaceLibraryCommand } from "./commands/marketplaceLibrary";
import { creditBalanceCommand, creditTopupCommand } from "./commands/credits";
import { getCliConfigPath, loadCliConfig } from "./services/cliConfig";

const program = new Command();

program
  .name("chaturbo")
  .description("Chaturbo CLI - scan local AI agent logs, sanitize, and publish workflow assets")
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

const scanCommand = program.command("scan").description("Scan local AI agent logs and generate drafts");

scanCommand
  .command("agent")
  .description("Scan local AI agent history (OpenClaw/Hermes/Claude Code/Gemini CLI paths)")
  .option("--path <path>", "Path to scan")
  .option("--local-only", "Scan locally without upload", false)
  .option("--local-agent-cmd <command>", "Run local AI command to refine draft readability before upload")
  .action(async (options) => {
    await scanOpenClawCommand({
      path: options.path,
      localOnly: options.localOnly,
      localAgentCmd: options.localAgentCmd
    });
  });

scanCommand
  .command("openclaw")
  .description("Scan local OpenClaw history (legacy alias)")
  .option("--path <path>", "Path to scan")
  .option("--local-only", "Scan locally without upload", false)
  .option("--local-agent-cmd <command>", "Run local AI command to refine draft readability before upload")
  .action(async (options) => {
    await scanOpenClawCommand({
      path: options.path,
      localOnly: options.localOnly,
      localAgentCmd: options.localAgentCmd
    });
  });

program
  .command("connect")
  .description("One-command agent connect flow: login/pair or owner-secret connect, local analyze, scan, and upload")
  .option("--path <path>", "Path to scan")
  .option("--local-only", "Scan locally without upload", false)
  .option("-y, --yes", "Auto-upload detected drafts without confirmation", false)
  .option("--skip-pair", "Skip pairing unattended agent credentials", false)
  .option("--owner-id <ownerId>", "Owner UID from dashboard machine credentials")
  .option("--agent-secret <agentSecret>", "Agent secret from dashboard machine credentials")
  .option("--api-url <apiUrl>", "Override API URL for this machine")
  .option("--local-agent-cmd <command>", "Run local AI command to refine draft readability before upload")
  .action(async (options) => {
    await connectCommand(options);
  });

program
  .command("pair")
  .description("Create and store ownerUid + agentSecret for unattended agent sync")
  .option("--name <name>", "Credential name", "local-agent")
  .action(async (options) => {
    await pairAgentCommand(options.name);
  });

program
  .command("sync")
  .description("Non-interactive scan + upload for cron jobs")
  .option("--path <path>", "Path to scan")
  .option("--local-agent-cmd <command>", "Run local AI command to refine draft readability before upload")
  .action(async (options) => {
    await syncOpenClawCommand(options);
  });

const marketplaceCommand = program.command("marketplace").description("Search/buy workflows for local agent execution");

marketplaceCommand
  .command("search")
  .option("--query <query>", "Free-text query")
  .option("--category <category>", "Category filter")
  .option("--min-price <credits>", "Minimum credits")
  .option("--max-price <credits>", "Maximum credits")
  .option("--page <page>", "Page number", "1")
  .option("--limit <limit>", "Page size", "10")
  .action(async (options) => {
    await marketplaceSearchCommand(options);
  });

marketplaceCommand
  .command("buy")
  .requiredOption("--id <workflowId>", "Workflow id")
  .action(async (options) => {
    await marketplaceBuyCommand(options.id);
  });

marketplaceCommand
  .command("library")
  .description("List purchased workflows available for local agent reuse")
  .action(async () => {
    await marketplaceLibraryCommand();
  });

const creditsCommand = program.command("credits").description("Owner point/credit operations");

creditsCommand
  .command("balance")
  .action(async () => {
    await creditBalanceCommand();
  });

creditsCommand
  .command("topup")
  .requiredOption("--amount <credits>", "Credits to add")
  .action(async (options) => {
    await creditTopupCommand(options.amount);
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
