import { TestBed } from '@angular/core/testing';

import {AddUserDialogComponent } from './add-user';

describe('AddUser', () => {
  let service: AddUserDialogComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddUserDialogComponent);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
