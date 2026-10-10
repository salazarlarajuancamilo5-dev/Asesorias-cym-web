import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const output = resolve(root, "dist");
const html = await readFile(resolve(root, "index.html"), "utf8");
const localAssets = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
  .map((match) => match[1])
  .filter((value) => !/^(?:https?:|mailto:|#|data:)/i.test(value));

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await writeFile(resolve(output, "index.html"), html, "utf8");

for (const asset of new Set(localAssets)) {
  await cp(resolve(root, asset), resolve(output, basename(asset)));
}

for (const config of ["_headers", "_redirects"]) {
  try {
    await cp(resolve(root, config), resolve(output, config));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}

console.log(`Build listo en dist (${new Set(localAssets).size} recursos).`);
