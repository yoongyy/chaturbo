import axios from "axios";
import { loadCliConfig } from "../services/cliConfig";

export async function creditBalanceCommand() {
  const config = loadCliConfig();
  if (!config.token) {
    console.error("Please login first: chaturbo login");
    process.exit(1);
  }

  const res = await axios.get(`${config.apiUrl}/credits/balance`, {
    headers: { Authorization: `Bearer ${config.token}` }
  });

  console.log(`Owner: ${res.data.ownerUid}`);
  console.log(`Credits: ${res.data.credits}`);
}

export async function creditTopupCommand(credits: string) {
  const amount = Number(credits);
  if (!Number.isFinite(amount) || amount <= 0) {
    console.error("Please provide a valid positive credit amount.");
    process.exit(1);
  }

  const config = loadCliConfig();
  if (!config.token) {
    console.error("Please login first: chaturbo login");
    process.exit(1);
  }

  const res = await axios.post(
    `${config.apiUrl}/credits/topup`,
    { credits: amount, note: "manual_cli_topup" },
    { headers: { Authorization: `Bearer ${config.token}` } }
  );

  console.log(`Top-up success: +${res.data.addedCredits} credits`);
  console.log(`New balance: ${res.data.credits}`);
}
