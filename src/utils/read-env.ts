import { Command } from "@tauri-apps/api/shell";

export async function readEnvVariable(variableName: string): Promise<string> {
  const commandResult = await new Command("printenv", variableName).execute();

  if (commandResult.code !== 0) {
    throw new Error(commandResult.stderr);
  }

  return commandResult.stdout;
}
