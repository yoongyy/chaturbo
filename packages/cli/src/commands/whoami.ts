import axios from "axios";
import { loadCliConfig } from "../services/cliConfig";

export async function whoamiCommand() {
  const config = loadCliConfig();
  if (!config.token) {
    console.error("Not logged in. Run: chaturbo login");
    process.exit(1);
  }

  try {
    const result = await axios.get(`${config.apiUrl}/auth/me`, {
      headers: {
        Authorization: `Bearer ${config.token}`
      }
    });

    console.log(`User: ${result.data.user.email}`);
    console.log(`Name: ${result.data.user.name || "-"}`);
    console.log(`Credits: ${result.data.user.credits}`);
  } catch {
    console.error("Failed to fetch current user. Try logging in again.");
    process.exit(1);
  }
}
