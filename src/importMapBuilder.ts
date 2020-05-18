import JsonParser from "./jsonParser.ts";
import { DENO_STD, DEFAULT_IMPORT_MAP } from "./constants.ts";

export default class ImportMapBuilder {
  public constructor(
    private parser: JsonParser = new JsonParser(),
  ) {}

  public writeImportMap() {
    this.parser.writeJson(DEFAULT_IMPORT_MAP, this.buildImportMap());
  }

  private buildImportMap(): { [index: string]: any } {
    return { "imports": this.buildImportMapContent() };
  }

  private buildImportMapContent(): { [index: string]: string } {
    const json = this.parser.readPackageJson();

    return Object.keys(json?.dependencies || {})
      .map((key) => ({
        "key": key,
        "value": json.dependencies[key] as string,
      }))
      .map((kvObject) => this.processKV(kvObject))
      .reduce(this.reduceImportMapArray, {});
  }

  private reduceImportMapArray(
    v1: { [index: string]: string },
    v2: { [index: string]: string },
  ): { [index: string]: string } {
    return { ...v1, ...v2 };
  }

  private processKV(
    keyValueObject: { key: any; value: any },
  ): { [index: string]: string } {
    const { key, value } = keyValueObject;

    if ((value as string).includes("://")) {
      return { [`${key}/`]: value };
    }
    if (DENO_STD.findIndex((k) => k == key) > 0) {
      return { [`${key}/`]: this.denoStd(key, value) };
    }
    return { [`${key}/`]: this.denoX(key, value) };
  }

  private denoStd(key: string, version: string): string {
    return `https://deno.land/std${
      version && version !== "*" ? `@${version}` : ""
    }/${key}/`;
  }

  private denoX(key: string, version: string): string {
    return `https://deno.land/x/${key}${
      version && version !== "*" ? `@${version}` : ""
    }/`;
  }
}
