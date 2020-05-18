import JsonParser from "../src/jsonParser.ts";
import ImportMapBuilder from "../src/importMapBuilder.ts";
import ScriptRunner from "../src/scriptRunner.ts";
import { DEFAULT_IMPORT_MAP, DENO_IMPORT_MAP } from "../src/constants.ts";
import { stub, Stub } from "mock/stub.ts";
import { spy, Spy } from "mock/stub.ts";
import {
  assertEquals,
  assertArrayContains,
  assertStrContains,
} from "testing/asserts.ts";

const jsonParser = new JsonParser();
const importMapBuilder = new ImportMapBuilder(jsonParser);
let scriptRunner: ScriptRunner;
let mockDeno = {
  run: (option: any) => ({}),
  env: {
    get: spy(),
  },
  statSync: spy(),
  build: {
    os: "darwin",
  },
};
let jsonReader: Stub<JsonParser>;
let jsonWriter: Stub<JsonParser>;
let importMapWriter: Stub<ImportMapBuilder>;
let denoRun: Stub<any>;

const before = () => {
  scriptRunner = new ScriptRunner(jsonParser, importMapBuilder, mockDeno);
  jsonReader = stub(jsonParser, "readPackageJson");
  jsonWriter = stub(jsonParser, "writePackageJson");
  denoRun = stub(mockDeno, "run");
  importMapWriter = stub(importMapBuilder, "writeImportMap");
};

const after = () => {
  jsonReader.restore();
  jsonWriter.restore();
  importMapWriter.restore();
  denoRun.restore();
};

Deno.test("library is updated with install", async (): Promise<void> => {
  before();
  let packageJson: { [index: string]: { [index: string]: string } } = {
    "dependencies": {
      "testing": "v10",
    },
  };
  jsonReader.returns = Array(10).fill(packageJson);
  await scriptRunner.runScript("install", "testing@v1", "ddm@v2");
  assertEquals("v1", packageJson.dependencies["testing"]);
  after();
});

Deno.test("libary is added with install", async (): Promise<void> => {
  before();
  let packageJson: { [index: string]: { [index: string]: string } } = {
    "dependencies": {
      "testing": "v10",
    },
  };
  jsonReader.returns = Array(10).fill(packageJson);
  await scriptRunner.runScript("install", "testing@v1", "ddm@v2");
  assertEquals("v2", packageJson.dependencies["ddm"]);
  after();
});

Deno.test("preinstall command run", async (): Promise<void> => {
  before();
  denoRun.returns = [
    ({
      status: () => new Promise<any>((resolve) => resolve({ code: 0 })),
      close: () => {},
    }),
  ];
  let packageJson: { [index: string]: { [index: string]: string } } = {
    "dependencies": {
      "testing": "v10",
    },
    "scripts": {
      "preinstall": "ls",
    },
  };
  jsonReader.returns = Array(10).fill(packageJson);
  await scriptRunner.runScript("install", "testing@v1", "ddm@v2");
  assertArrayContains(denoRun.calls?.[0].args[0]["cmd"], ["ls"]);
  after();
});

Deno.test("postinstall command run", async (): Promise<void> => {
  before();
  denoRun.returns = [
    ({
      status: () => new Promise<any>((resolve) => resolve({ code: 0 })),
      close: () => {},
    }),
  ];
  let packageJson: { [index: string]: { [index: string]: string } } = {
    "dependencies": {
      "testing": "v10",
    },
    "scripts": {
      "postinstall": "ls",
    },
  };
  jsonReader.returns = Array(10).fill(packageJson);
  await scriptRunner.runScript("install", "testing@v1", "ddm@v2");
  assertArrayContains(denoRun.calls?.[0].args[0]["cmd"], ["ls"]);
  after();
});

DENO_IMPORT_MAP.forEach((command) => {
  Deno.test(`override deno command ${command} to have --importMap`, async (): Promise<
    void
  > => {
    before();
    denoRun.returns = [
      ({
        status: () => new Promise<any>((resolve) => resolve({ code: 0 })),
        close: () => {},
      }),
    ];
    let packageJson: { [index: string]: { [index: string]: string } } = {
      "dependencies": {
        "testing": "v10",
      },
    };
    jsonReader.returns = Array(10).fill(packageJson);
    await scriptRunner.runScript(command);
    assertStrContains(
      denoRun.calls?.[0].args[0]["cmd"].slice(-1)[0],
      `--importmap=${DEFAULT_IMPORT_MAP}`,
    );
    after();
  });

  Deno.test(`override deno command ${command} in script to have --importMap`, async (): Promise<
    void
  > => {
    before();
    denoRun.returns = [
      ({
        status: () => new Promise<any>((resolve) => resolve({ code: 0 })),
        close: () => {},
      }),
    ];
    let packageJson: { [index: string]: { [index: string]: string } } = {
      "dependencies": {
        "testing": "v10",
      },
      "scripts": {
        "build": `deno ${command}`,
      },
    };
    jsonReader.returns = Array(10).fill(packageJson);
    await scriptRunner.runScript("build");
    assertStrContains(
      denoRun.calls?.[0].args[0]["cmd"].slice(-1)[0],
      `--importmap=${DEFAULT_IMPORT_MAP}`,
    );
    after();
  });
});
