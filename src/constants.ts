const DENO_STD: string[] = [
  "archive",
  "async",
  "bytes",
  "datetime",
  "encoding",
  "examples",
  "flags",
  "fmt",
  "fs",
  "hash",
  "http",
  "io",
  "log",
  "mime",
  "node",
  "path",
  "permissions",
  "signal",
  "testing",
  "textproto",
  "uuid",
  "ws",
];
const DEFAULT_IMPORT_MAP = ".deno/import_map.json";
const DENO_IMPORT_MAP = ["run", "cache", "test", "bundle"];
const VERSION = "0.0.1";

export { DENO_STD };
export { DENO_IMPORT_MAP };
export { DEFAULT_IMPORT_MAP };
export { VERSION };
