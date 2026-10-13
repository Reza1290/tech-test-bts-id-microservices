import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const root = process.cwd();
const failures = [];
const slash = (value) => value.split(path.sep).join('/');

function sourceFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isDirectory()) return ['dist', 'node_modules', '.next'].includes(entry.name) ? [] : sourceFiles(target);
    return /\.(?:ts|tsx)$/.test(entry.name) && !entry.name.endsWith('.d.ts') ? [target] : [];
  });
}

function fail(file, message, position) {
  const relative = slash(path.relative(root, file));
  const source = fs.readFileSync(file, 'utf8');
  const line = position === undefined ? 1 : source.slice(0, position).split(/\r?\n/).length;
  failures.push(`${relative}:${line} ${message}`);
}

const appFiles = sourceFiles(path.join(root, 'apps'));
for (const file of appFiles) {
  const relative = slash(path.relative(root, file));
  const text = fs.readFileSync(file, 'utf8');
  const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, file.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);

  function inspect(node) {
    if (node.kind === ts.SyntaxKind.AnyKeyword) fail(file, 'explicit any is prohibited', node.getStart(source));
    ts.forEachChild(node, inspect);
  }
  inspect(source);

  const imports = source.statements
    .filter(ts.isImportDeclaration)
    .map((statement) => statement.moduleSpecifier.text);

  if (/\/src\/(?:domain|core|application)\//.test(relative)) {
    for (const specifier of imports) {
      if (specifier === 'express' || specifier.startsWith('drizzle-orm') || /(?:^|\/)infra(?:\/|$)/.test(specifier) || /(?:^|\/)main(?:\/|$)/.test(specifier)) {
        fail(file, `business layer imports forbidden dependency "${specifier}"`);
      }
    }
  }

  if (/\/src\/infra\/http\/controllers\//.test(relative)) {
    for (const specifier of imports) {
      if (specifier === 'express' || specifier.startsWith('drizzle-orm') || /interfaces\/I.*Repository/.test(specifier)) {
        fail(file, `controller imports forbidden adapter/port "${specifier}"`);
      }
    }
    if (/\bres\s*\.\s*(?:status|json|send)\s*\(/.test(text)) fail(file, 'controller writes an Express response directly');
    if (/\breq\s*\.\s*(?:body|params|query)\s+as\b/.test(text)) fail(file, 'controller asserts unvalidated request data');
  }

  if (/\/src\/server\.ts$/.test(relative)) {
    for (const specifier of imports) {
      if (specifier === 'drizzle-orm' || /infra\/db\/schema/.test(specifier)) fail(file, `server contains persistence workflow import "${specifier}"`);
    }
  }

  if (/\/backend\/services\/.*\/src\//.test(relative)
      && !/\/src\/main\/config\/env\.ts$/.test(relative)
      && text.includes('process.env')) {
    fail(file, 'environment is read outside the validated startup config');
  }
}

for (const serviceDir of fs.readdirSync(path.join(root, 'apps/backend/services'), { withFileTypes: true }).filter((entry) => entry.isDirectory())) {
  const duplicate = path.join(root, 'apps/backend/services', serviceDir.name, 'src/common/response.ts');
  if (fs.existsSync(duplicate)) fail(duplicate, 'service duplicates the canonical @bts/http response helper');
}

if (failures.length > 0) {
  console.error(`Technical architecture check failed (${failures.length}):\n${failures.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(`Technical architecture check passed (${appFiles.length} TypeScript files inspected).`);
}
