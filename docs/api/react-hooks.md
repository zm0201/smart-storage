---
extractApiHeaders: [2]
---

# React Hooks API

## createLocalStorage()

Create a storage module by `localStorage`.

### Type

<CodeScroll>

```ts
function createLocalStorage<T>(options: CreateStorageOptions<T>): SmartStorage<T>;
```

</CodeScroll>

### Parameters

- `options: CreateStorageOptions<T>`

  <CodeScroll>

  ```ts
  type CreateStorageOptions<T> = {
    /* Storage module key (must be unique) */
    storageModuleKey: string;
    /* Initial value (non-nullable properties must be initialized, 
      and optional properties cannot be initialized) */
    initial: PickNonNullable<T>;
    /* Whether to enable module protection */
    protect?: boolean;
    /* Version number of the storage module */
    version?: number;
    /* Previous version number of the storage module */
    preVersion?: number;
  };
  ```

  </CodeScroll>

### Return Value

The function returns an object ([`SmartStorage`](type-definition/react-hooks.html#smartstorage)) that includes some required variables for [`useStorage`](#usestorage) and [`useStorageHelper`](#usestoragehelper).

### Example

<CodeScroll>

```ts
type UserInfo = {
  token?: string;
  hasSigned: boolean;
};

export const storage = createLocalStorage<UserInfo>({
  storageModuleKey: 'user_info',
  initial: { hasSigned: false },
});
```

</CodeScroll>

## createSessionStorage()

Create a storage module by `sessionStorage`.

### Type

<CodeScroll>

```ts
function createSessionStorage<T>(options: CreateStorageOptions<T>): SmartStorage<T>;
```

</CodeScroll>

### Parameters

Same as [`createLocalStorage() > Parameters`](#parameters)

### Return Value

Same as [`createLocalStorage() > Return Value`](#return-value)

### Example

<CodeScroll>

```ts
type UserInfo = {
  token?: string;
  hasSigned: boolean;
};

export const storage = createSessionStorage<UserInfo>({
  storageModuleKey: 'user_info',
  initial: { hasSigned: false },
});
```

</CodeScroll>

## useStorage()

Get `states`, `setters`, `resetters` and `checkers` from storage module.

### Type

<CodeScroll>

```ts
function useStorage<T>(storage: SmartStorage<T>): StorageStates<T>;
```

</CodeScroll>

### Parameters

- `storage: SmartStorage<T>`

  An object returned by [`createLocalStorage`](#createlocalstorage) or [`createSessionStorage`](#createsessionstorage).

### Return Value

The function returns a `Record` object, whose key type is [`StateKey<T>`](type-definition/react-hooks.html#statekey), value type is [`StorageState<T, K extends keyof T>`](type-definition/react-hooks.html#storagestate):

<CodeScroll>

```ts
type StorageStates<T> = {
  [SK in StateKey<T>]: RestoreSuffixedKey<SK, 'state'> extends keyof T
    ? StorageState<T, RestoreSuffixedKey<SK, 'state'>>
    : never;
};
```

</CodeScroll>

::: tip
[`RestoreSuffixedKey<SK, 'state'>`](type-definition/shared.html#restoresuffixedkey) here is used to restore the `StateKey<T>`, for example, the "tokenState" will be restored to "token".
:::

<hr>

[`StateKey<T>`](type-definition/react-hooks.html#statekey) is a string (such as "tokenState"):

<CodeScroll>

```ts
type StateKey<T> = SuffixedKeys<T, 'state'>;
```

</CodeScroll>

::: tip
[`SuffixedKeys<T, 'state'>`](type-definition/shared.html#suffixedkeys) here is used to add suffix, for example, the "token" will become to "tokenState".
:::

<hr>

And the `StorageState<T, K extends keyof T>` is an object containing:

- `xxx: T[K]`
- [`setXxx: Setter<T[K]>`](type-definition/react-hooks.html#setter), type of `setXxx` is [`SetterKey<K>`](type-definition/react-hooks.html#setterkey)
- [`resetXxx: Resetter`](type-definition/shared.html#resetter), type of `resetXxx` is [`ResetterKey<K>`](type-definition/shared.html#resetterkey)
- [`containsXxx: Checker`](type-definition/shared.html#checker), type of `containsXxx` is [`CheckerKey<K>`](type-definition/shared.html#checkerkey)

<CodeScroll>

```ts
type StorageState<T, K extends keyof T> = {
  [Key in K]: T[K];
} & {
  [Key in SetterKey<K>]: Setter<T[K]>;
} & {
  [Key in ResetterKey<K>]: Resetter;
} & {
  [Key in CheckerKey<K>]: Checker;
};
```

</CodeScroll>

### Example

<CodeScroll>

```ts
import { storage } from './storage';
const {
  tokenState: { token, setToken, resetToken, containsToken },
} = useStorage(storage);
```

</CodeScroll>

## useStorageHelper()

Get instance of storage module helper.

### Type

<CodeScroll>

```ts
function useStorageHelper<T>(storage: SmartStorage<T>): StorageHelper;
```

</CodeScroll>

### Return Value

<CodeScroll>

```ts
type StorageHelper = {
  contains: (key: string) => boolean;
  size: () => number;
  initialize: () => void;
};
```

</CodeScroll>

### Example

<CodeScroll>

```ts
import { storage } from './storage';
const storageHelper = useStorageHelper(storage);
```

</CodeScroll>
