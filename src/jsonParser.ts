import { readJsonSync } from "fs/read_json.ts";
import { writeJsonSync } from "fs/write_json.ts";
import * as path_utils from "path/mod.ts";

export default class JsonParser {
  private json: { [index: string]: any } | undefined;

  public readPackageJson() {
    if (!this.json) {
      this.json = readJsonSync("package.json") as { [index: string]: any };
    }
    return this.json;
  }

  public writePackageJson() {
    this.writeJson("package.json", this.readPackageJson());
  }

  public writeJson(path: string, json: any) {
    Deno.mkdirSync(path_utils.dirname(path), { recursive: true });
    writeJsonSync(path, json, { spaces: 4 });
  }
}
