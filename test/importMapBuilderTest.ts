import JsonParser from "../src/jsonParser.ts";
import ImportMapBuilder from "../src/importMapBuilder.ts";
import { DEFAULT_IMPORT_MAP } from "../src/constants.ts";
import { stub, Stub } from "mock/stub.ts";
import { assertEquals } from "testing/asserts.ts";

const jsonParser = new JsonParser();
const importMapBuilder = new ImportMapBuilder(jsonParser);
let jsonReader: Stub<JsonParser>;
let jsonWriter: Stub<JsonParser>;
const before = () => {
  jsonReader = stub(jsonParser, "readPackageJson");
  jsonWriter = stub(jsonParser, "writeJson");
};

const after = () => {
  jsonReader.restore();
  jsonWriter.restore();
};

Deno.test("set std url for std libraries", () => {
  before();

  jsonReader.returns = [{
    "dependencies": {
      "testing": "v10",
    },
  }];
  importMapBuilder.writeImportMap();
  assertEquals(jsonWriter.calls?.[0]?.args[1], {
    "imports": {
      "testing/": "https://deno.land/std@v10/testing/",
    },
  });
  after();
});

Deno.test("set x url for 3rd party libraries", () => {
  before();
  jsonReader.returns = [{
    "dependencies": {
      "ddm": "v1",
    },
  }];
  importMapBuilder.writeImportMap();
  assertEquals(jsonWriter.calls?.[0]?.args[1], {
    "imports": {
      "ddm/": "https://deno.land/x/ddm@v1/",
    },
  });
  after();
});

Deno.test("set direct url to a library", () => {
  before();
  jsonReader.returns = [{
    "dependencies": {
      "ddm": "https://github.com/ducthienbui97/ddm/src/",
    },
  }];
  importMapBuilder.writeImportMap();
  assertEquals(jsonWriter.calls?.[0]?.args[1], {
    "imports": {
      "ddm/": "https://github.com/ducthienbui97/ddm/src/",
    },
  });
  after();
});
