import CommandBuilder from "./commandBuilder.ts";

if (import.meta.main) {
  const cmdBuilder = new CommandBuilder();
  await cmdBuilder.buildCommand().parse(Deno.args);
}
