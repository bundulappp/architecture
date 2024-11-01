import { readFile, writeFile } from 'node:fs/promises';
import { PathLike, existsSync, writeFileSync } from 'node:fs';
export class JsonFileStore<T> {
  constructor(private readonly path: PathLike) {
    if (!existsSync(this.path)) {
      writeFileSync(this.path, '[]', 'utf-8');
    }
  }

  async read() {
    const content = await readFile(this.path, 'utf-8');
    const data = JSON.parse(content) as T[];
    return data;
  }
  async write(data: T[]) {
    const content = JSON.stringify(data, null, 2);
    await writeFile(this.path, content, 'utf-8');
  }
}
