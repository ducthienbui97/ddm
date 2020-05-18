import JsonParser from "./jsonParser.ts";
import { DEFAULT_IMPORT_MAP, DENO_IMPORT_MAP } from "./constants.ts";
import ImportMapBuilder from "./importMapBuilder.ts";

export default class ScriptRunner {
  private readonly DEFAULT_PARAMS = [
    "--unstable",
    `--importmap=${DEFAULT_IMPORT_MAP}`,
  ];

  private readonly IS_WINDOWS = this.deno.build.os == "windows";
  private readonly OS_SHELL_ENV_NAME = this.IS_WINDOWS ? "ComSpec" : "SHELL";
  private readonly OS_DEFAULT_SHELL = this.IS_WINDOWS ? "cmd.exe" : "sh";

  public constructor(
    private parser = new JsonParser(),
    private importMapBuilder = new ImportMapBuilder(parser),
    private deno: any = Deno,
  ) {
  }

  public async runScript(scriptName: string, ...args: string[]) {
    const json = this.parser.readPackageJson();
    if (
      json?.scripts?.[scriptName] || DENO_IMPORT_MAP.includes(scriptName) ||
      scriptName === "install"
    ) {
      if (!scriptName.startsWith("pre")) {
        await this.runScript("pre" + scriptName);
      }
      if (json?.scripts?.[scriptName]) {
        const cmd = (json.scripts[scriptName] as string).split(" ");
        if (cmd[0] === "deno" && DENO_IMPORT_MAP.includes(cmd[1])) {
          await this.runDenoCmdWithImportMap(cmd[1], ...cmd.splice(2), ...args);
        } else {
          await this.denoRun({
            cmd: [...cmd, ...args],
          });
        }
      } else if (scriptName === "install") {
        await this.addDependency(...args);
      } else {
        await this.runDenoCmdWithImportMap(scriptName, ...args);
      }

      if (!scriptName.startsWith("post")) {
        await this.runScript("post" + scriptName);
      }
    }
  }

  private async addDependency(...args: string[]) {
    const json = this.parser.readPackageJson();
    args.forEach((arg) => {
      const [pkg, version] = arg.split("@");
      json.dependencies[pkg] = version || "*";
    });

    this.parser.writePackageJson();
    this.importMapBuilder.writeImportMap();
  }

  private async runDenoCmdWithImportMap(cmd: string, ...args: string[]) {
    await this.denoRun({
      cmd: ["deno", cmd, ...this.DEFAULT_PARAMS, ...args],
    });
  }

  private async denoRun(option: Deno.RunOptions) {
    const cmd = option.cmd.join(" ");
    if (this.IS_WINDOWS) {
      option.cmd = [this.getShell(), "/d", "/s", "/c", cmd];
    } else {
      option.cmd = [this.getShell(), "-c", cmd];
    }
    const process = this.deno.run(option);
    const status = await process.status();
    process.close();
    if (status.code !== 0) {
      throw new Error(`Command returned error code ${status.code}`);
    }
  }

  private getShell(): string {
    try {
      const configuredShell = this.deno.env.get(this.OS_SHELL_ENV_NAME);
      if (configuredShell && this.deno.statSync(configuredShell).isFile) {
        return configuredShell;
      }
    } catch (ignored) {
    }
    return this.OS_DEFAULT_SHELL;
  }
}
