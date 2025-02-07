import { readFileSync } from 'fs';
import { join } from 'path';

export async function GET() {
  const packageJsonPath = join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

  const version = packageJson.version;

  return new Response(JSON.stringify({ version }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
