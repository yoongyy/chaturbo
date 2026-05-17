import { scanOpenClawCommand } from "./scanOpenClaw";

interface SyncOptions {
  path?: string;
}

export async function syncOpenClawCommand(options: SyncOptions) {
  await scanOpenClawCommand({
    path: options.path,
    localOnly: false,
    autoUpload: true,
    nonInteractive: true
  });
}
