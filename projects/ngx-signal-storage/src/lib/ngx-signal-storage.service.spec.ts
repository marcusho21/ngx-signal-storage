import { TestBed } from '@angular/core/testing';

import { isSignal } from '@angular/core';
import { LocalStorageStub } from '../_internal/mocks/local-storage';
import { STORAGE } from '../_internal/storage.token';
import {
  NgxSignalStorageService,
  provideNgxSignalStorage,
} from './ngx-signal-storage.service';

// required for testing
type TestStorageState = { test: string };

// stubs and mocks
const prefix = 'test_';
const mockValue = ['test'];

// this is just a simple validator for testing. It's not a comprehensive validator that should be used in production.
const mockValidator = (value: any): value is TestStorageState['test'] => {
  const valueSet = new Set(value);
  const mockValueSet = new Set(mockValue);
  return valueSet.size === mockValueSet.size;
};

describe('NgxSignalStorageService', () => {
  let service: NgxSignalStorageService<TestStorageState>;
  let localStorageStub: Storage;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: STORAGE, useClass: LocalStorageStub },
        provideNgxSignalStorage(prefix),
      ],
    });

    service = TestBed.inject(NgxSignalStorageService<TestStorageState>);
    localStorageStub = TestBed.inject(STORAGE);
    localStorageStub.setItem(`${prefix}test`, JSON.stringify(['test']));
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Service public APIs exist', () => {
    it('should have a prefix', () => {
      expect(service.prefix).toBe(prefix);
    });

    it('should have a change signal', () => {
      expect(service.change).toBeTruthy();
    });

    it('should have a get method', () => {
      expect(service.get).toBeTruthy();
    });

    it('should have a watch method', () => {
      expect(service.watch).toBeTruthy();
    });

    it('should have a set method', () => {
      expect(service.set).toBeTruthy();
    });

    it('should have a remove method', () => {
      expect(service.remove).toBeTruthy();
    });

    it('should have a clear method', () => {
      expect(service.clear).toBeTruthy();
    });

    it('should have a has method', () => {
      expect(service.has).toBeTruthy();
    });
  });

  describe('get', () => {
    it('should return a signal', () => {
      const testSignal = service.get('test');
      expect(isSignal(testSignal)).toBeTruthy();
    });

    it('should return a signal with the correct value', () => {
      const testSignal = service.get('test');
      expect(testSignal()).toEqual(mockValue);
    });

    it('should validate the value when a validator is provided', () => {
      const testSignal = service.get('test', mockValidator);
      expect(testSignal()).toEqual(mockValue);
    });

    it('should validate the value when a validator is provided', () => {
      mockValue.push('test2'); // the length difference should raise an error based on the mockValidator
      expect(service.get('test', mockValidator)).toThrowError();

      // reset mockValue
      mockValue.pop();
    });

    it('should not throw an error when value is null', () => {
      localStorageStub.removeItem(`${prefix}test`);
      expect(service.get('test')).not.toThrowError();
    });
  });
});
