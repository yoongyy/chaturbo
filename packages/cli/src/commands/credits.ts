import axios from "axios";
import prompts from "prompts";
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

  const createRes = await axios.post(
    `${config.apiUrl}/credits/checkout-session`,
    { credits: amount },
    { headers: { Authorization: `Bearer ${config.token}` } }
  );

  const checkoutUrl = createRes.data.url as string;
  const sessionId = createRes.data.sessionId as string;
  console.log("Open this URL to complete payment:");
  console.log(checkoutUrl);

  const answer = await prompts({
    type: "confirm",
    name: "paid",
    message: "Payment completed in browser?",
    initial: true
  });

  if (!answer.paid) {
    console.log("Top-up not confirmed yet.");
    return;
  }

  const confirmRes = await axios.post(
    `${config.apiUrl}/credits/checkout-confirm`,
    { sessionId },
    { headers: { Authorization: `Bearer ${config.token}` } }
  );

  if (confirmRes.data.alreadyProcessed) {
    console.log("Top-up already processed.");
  } else {
    console.log(`Top-up success: +${confirmRes.data.addedCredits} credits`);
  }
  console.log(`New balance: ${confirmRes.data.credits}`);
}
