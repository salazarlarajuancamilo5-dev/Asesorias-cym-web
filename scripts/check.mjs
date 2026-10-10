import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const htmlPath = resolve(root, "index.html");
const html = await readFile(htmlPath, "utf8");

const errors = [];
if (html.includes("\0")) errors.push("index.html contiene bytes nulos");
if (!/^<!DOCTYPE html>/i.test(html.trimStart())) errors.push("falta <!DOCTYPE html>");
if (!/<html\b[^>]*lang="es"/i.test(html)) errors.push("falta lang=\"es\"");
if (!/<meta\b[^>]*name="viewport"/i.test(html)) errors.push("falta meta viewport");
if (!/<\/html>\s*$/i.test(html)) errors.push("index.html no termina correctamente");

const localReferences = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
  .map((match) => match[1])
  .filter((value) => !/^(?:https?:|mailto:|#|data:)/i.test(value));

for (const reference of new Set(localReferences)) {
  try {
    await access(resolve(root, reference));
  } catch {
    errors.push(`recurso local ausente: ${reference}`);
  }
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}

console.log(`Validación correcta: ${new Set(localReferences).size} recursos locales encontrados.`);
