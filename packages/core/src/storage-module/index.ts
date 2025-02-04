import { StorageModuleSchema } from '@smart-storage/shared';
import { IStorageModule } from './types';
import { IStorageModuleHelper, StorageType } from '../storage-module-helper/types';
import { StorageModuleHelper } from '../storage-module-helper';
import { storageModulePool } from '../storage-module-pool';

export class StorageModule<T extends StorageModuleSchema> implements IStorageModule<T> {
  private helper: IStorageModuleHelper<T>;

  public constructor(key: string, storageType: StorageType, noUniqueVerify?: boolean) {
    this.helper = new StorageModuleHelper(key, storageType);
    if (!noUniqueVerify) {
      storageModulePool.addStorageModule(this);
    }
  }

  public getItem<K extends keyof T>(key: K): T[K] | undefined {
    const storageModule = this.helper.getModule();
    return Object.prototype.hasOwnProperty.call(storageModule, key) ? storageModule[key] : undefined;
  }

  public setItem<K extends keyof T>(key: K, value: T[K]): void {
    const storageModule = this.helper.getModule();
    storageModule[key] = value;
    this.helper.setModule(storageModule);
  }

  public removeItem<K extends keyof T>(key: K): void {
    const storageModule = this.helper.getModule();
    delete storageModule[key];
    if (!Object.keys(storageModule as object).length) {
      this.clear();
      return;
    }
    this.helper.setModule(storageModule);
  }

  public contains(key: string): boolean {
    const storageModule = this.helper.getModule();
    return Object.prototype.hasOwnProperty.call(storageModule, key);
  }

  public clear(): void {
    this.helper.clearModule();
    storageModulePool.removeStorageModule(this);
  }

  public size(): number {
    return Object.keys(this.helper.getModule() as object).length;
  }

  public getHelper(): IStorageModuleHelper<T> {
    return this.helper;
  }
}
