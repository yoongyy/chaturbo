import axios from "axios";
import prompts from "prompts";
import { loadCliConfig, saveToken } from "../services/cliConfig";

export async function loginCommand() {
  const config = loadCliConfig();

  const response = await prompts([
    {
      type: "text",
      name: "email",
      message: "Email"
    },
    {
      type: "password",
      name: "password",
      message: "Password"
    }
  ]);

  if (!response.email || !response.password) {
    console.error("Login cancelled");
    process.exit(1);
  }

  try {
    const result = await axios.post(`${config.apiUrl}/auth/login`, {
      email: response.email,
      password: response.password
    });

    saveToken(result.data.token);
    console.log(`Logged in as ${result.data.user.email}`);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(error.response?.data?.error || "Login failed");
      process.exit(1);
    }
    throw error;
  }
}
