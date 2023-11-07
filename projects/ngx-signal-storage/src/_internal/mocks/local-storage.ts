export class LocalStorageStub implements Storage {
  private store = new Map<string, string>();

  length = this.store.size;

  clear(): void {
    this.store.clear();
    this.length = this.store.size;
  }

  getItem(key: string): string | null {
    return this.store.get(key) ?? null;
  }

  key(index: number): string | null {
    return Array.from(this.store.keys())[index] ?? null;
  }

  removeItem(key: string): void {
    this.store.delete(key);
    this.length = this.store.size;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
    this.length = this.store.size;
  }
}
