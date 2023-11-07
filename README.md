# NgxSignalStorage

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.7.

## Development server

To build the library and test it in a sandbox application project, run in different terminals:

```bash
  pnpm watch:lib
  pnpm start:sandbox
```

## Build

To build the project, run:

```bash
  pnpm build:lib
```

The build artifacts will be stored in the `dist/` directory.

## Running unit tests

To run unit tests using `Jest`, use the command:

```bash
 pnpm test:lib
```

## Publish the library

To publish the library to npm, run:

```bash
  pnpm run build:lib
  cd ./dist/ngx-signal-storage
  pnpm publish
```

## Usage Example

### Provide to AppConfig

```typescript
  bootstrapApplication(AppComponent, {
    providers: [
      ...other providers,
      provideNgxSignalStorage(),
    ],
  });
```

#### With prefix

If needed, you can use a prefix to prevent conflicts between keys in the storage. Example:

```typescript
  bootstrapApplication(AppComponent, {
    providers: [
      ...other providers,
      provideNgxSignalStorage('<your-storage-key-prefix>'),
    ],
  });
```

With a `prefix` provided, all `LocalStorage` keys set through `NgxSignalStorage` will automatically have the `prefix` added.

### NgxSignalStorageService APIs

#### Inject Service

```typescript
  type StorageState = { todos: string[] };

  storage = inject(NgxSignalStorageService<StorageState>);
```

Use the `inject()` function provided by `Angular` to get the service instance. The `NgxSignalStorageService` accepts a `generic` type, which can be used as a type reference for the service APIs.

(Note: The service APIs themselves do NOT take a `generic` type.)

#### Getting value from LocalStorage (once)

```typescript
  todos = this.storage.get('todos');
```

the `get()` method returns a `readonly signal` of the value retrieve from LocalStorage using the key argument. If a type is provided to `NgxSignalStorageService`, the value will be typed as the type provided (eg. `string[]` in the example) or `null`.

#### Watching value from LocalStorage (reactively)

```typescript
  todos = this.storage.watch('todos');
```

Similar to `get()`, `watch()` also returns a `readonly signal` of the value retrieved from `LocalStorage` using the `key` argument. If a type is provided to `NgxSignalStorageService`, the value will be typed as the provided type (e.g., `string[]` in the example) or `null`. The difference is that the `signal` returned from `watch()` will react to value changes using the `set()`, `remove()`, and `clear()` method from `NgxSignalStorageService`.

#### Setting value to LocalStorage

```typescript
  const todos = ['Laundry', 'Groceries'];

  this.storage.set('todos', todos);
```

Similar to the `setItem()` method from `LocalStorage`, `set()` takes in the `key` and `value` to set the value in `LocalStorage`. However, the difference is that the `set()` method from `NgxSignalStorageService` will **trigger a change**, and the `readonly signals` returned by `watch()` and `has()` will reactively get updated whenever `set()` is called.

### Removing value from LocalStorage

```typescript
  this.storage.remove('todos');
```

Similar to the `removeItem()` method from `LocalStorage`, `remove()` will use the `key` argument to remove the value associated with the key from `LocalStorage`. The difference is that this will trigger the `readonly signals` created using `watch()` and `has()` to react to this removal, which should result in those signals emitting `null` since the value will no longer exist in the `LocalStorage`.

### Clearing all values from LocalStorage

```typescript
  this.storage.clear();
```

Similar to the `clear()` method from `LocalStorage`, `clear()` will clear the **entire** `LocalStorage`. But similar to other methods from `NgxSignalStorageService`, it will **trigger changes reactively**, resulting in all `readonly signals` emit `null`.

#### Checking if a key exists in LocalStorage (reactively)

```typescript
  hasTodos = this.storage.has('todos');
```

Similar to `watch()`, the `has()` method takes a `key` and returns a `readonly signal`, which will **react to any changes** in the `LocalStorage` through `NgxSignalStorageService`. The difference from `watch()` is that `has()` returns a signal of type `boolean`. If a `key` is set and exists in `LocalStorage` through `NgxSignalStorageService`, the signal will emit `true`; otherwise, it will emit `false`.

#### Watching any change from the service

```typescript
  change = this.storage.change;

  this.change();
```

The `change` signal is `readonly`; it updates whenever `any change` goes through `NgxSignalStorageService`. It emits different `actions` going through `NgxSignalStorageService`. Refer to below for the types of the actions emitted:

```typescript
  type GetStorageAction<Key> = { type: 'get'; key: Key };
  type SetStorageAction<Key, Value> = {
    type: 'set';
    key: Key;
    payload: Value;
  };
  type RemoveStorageAction<Key> = { type: 'remove'; key: Key };
  type InitStorageAction = { type: 'init' };
  type ClearStorageAction = { type: 'clear' };
```

#### Validation

```typescript
  todos = this.storage.get('todos', (value) => Array.isArray(value));
```

When working with `NgxSignalStorageService`, you have the option to include a `validator` as a `callback` function when using the `get()` and `watch()` methods. This validator function should return `true` if the value is valid, and `false` if it's not. If the `validator` returns false, the `get()` and `watch()` methods will raise an `Error`. This helps ensure that the value retrieved is of the correct type.

(Note: This library is written using Angular 16, but theoretically, it should work with higher versions of Angular without any issues. Please file an issue on the repo if you encounter any problems while using it.)
