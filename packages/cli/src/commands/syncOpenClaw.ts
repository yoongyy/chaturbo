import { scanOpenClawCommand } from "./scanOpenClaw";

interface SyncOptions {
  path?: string;
  localAgentCmd?: string;
  autoPublish?: boolean;
  publishThreshold?: number;
  maxAutoPublish?: number;
}

export async function syncOpenClawCommand(options: SyncOptions) {
  await scanOpenClawCommand({
    path: options.path,
    localOnly: false,
    autoUpload: true,
    nonInteractive: true,
    localAgentCmd: options.localAgentCmd,
    autoPublish: options.autoPublish,
    publishThreshold: options.publishThreshold,
    maxAutoPublish: options.maxAutoPublish
  });
}
