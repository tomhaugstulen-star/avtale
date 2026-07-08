import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const errors = [];

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
}

function requireCondition(condition, message) {
  if (!condition) errors.push(message);
}

const pkg = readJson('package.json');
const lock = readJson('package-lock.json');
const app = readJson('app.json').expo;
const eas = readJson('eas.json');
const lockRoot = lock.packages?.[''];

requireCondition(pkg.version === app.version, 'package.json og app.json må ha samme versjon.');
requireCondition(lockRoot?.version === pkg.version, 'package-lock.json må oppdateres etter versjonsendringen.');
requireCondition(
  lockRoot?.dependencies?.['expo-secure-store'] === pkg.dependencies?.['expo-secure-store'],
  'package-lock.json mangler riktig expo-secure-store-avhengighet. Kjør npx expo install expo-secure-store.',
);
requireCondition(app.ios?.bundleIdentifier === 'no.haugstulen.avtale', 'Uventet iOS bundleIdentifier.');
requireCondition(/^\d+$/.test(app.ios?.buildNumber ?? ''), 'ios.buildNumber må være et heltall som tekst.');
requireCondition(app.plugins?.includes('expo-secure-store'), 'expo-secure-store mangler i app.json plugins.');
requireCondition(Boolean(eas.build?.production), 'Production-profil mangler i eas.json.');
requireCondition(eas.build?.production?.distribution === 'store', 'Production-profilen må bruke distribution: store.');
requireCondition(eas.build?.production?.autoIncrement === true, 'Production-profilen må ha autoIncrement aktivert.');
requireCondition(fs.existsSync(path.join(root, app.icon ?? '')), 'Appikonet finnes ikke.');
requireCondition(fs.existsSync(path.join(root, 'docs/PRIVACY_POLICY.md')), 'Personvernerklæringen mangler.');
requireCondition(fs.existsSync(path.join(root, 'docs/RELEASE.md')), 'Utgivelsessjekklisten mangler.');

const forbiddenNames = [
  'KALENDER-PARING.txt',
  '.env',
  '.env.local',
  '.env.production',
];
const forbiddenExtensions = ['.p12', '.mobileprovision', '.cer', '.pem', '.key'];
const ignoredDirectories = new Set(['.git', 'node_modules', '.expo']);

function scan(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      scan(fullPath);
      continue;
    }

    const relativePath = path.relative(root, fullPath);
    const extension = path.extname(entry.name).toLocaleLowerCase('en-US');
    if (forbiddenNames.includes(entry.name) || forbiddenExtensions.includes(extension)) {
      errors.push(`Sensitiv fil må fjernes før bygg: ${relativePath}`);
    }
  }
}

scan(root);

if (errors.length > 0) {
  console.error('\nProduksjonskontrollen fant feil:\n');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log('Produksjonskontrollen besto. Appen er klar for EAS production build.');
