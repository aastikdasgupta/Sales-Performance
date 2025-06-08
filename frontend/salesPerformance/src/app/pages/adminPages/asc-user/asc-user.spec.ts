import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AscUser } from './asc-user';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AscUser', () => {
  let component: AscUser;
  let fixture: ComponentFixture<AscUser>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AscUser, HttpClientTestingModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA], // Ignore unknown elements like Material components
    }).compileComponents();

    fixture = TestBed.createComponent(AscUser);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    // Set sessionStorage mock before component init
    spyOn(sessionStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'sp_role') return 'admin';
      return null;
    });

    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify(); // Ensure no outstanding HTTP requests
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load users by role on init', () => {
    const mockUsers = [{ id: 1, name: 'John Doe', phone: '1234567890' }];
    const req = httpMock.expectOne('/user/profile/list-by-role?role=admin');
    expect(req.request.method).toBe('GET');
    req.flush({ users: mockUsers });

    expect(component.users.length).toBe(1);
    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].name).toBe('John Doe');
  });

  it('should handle empty role in sessionStorage', () => {
    // Recreate component with no role in session
    (sessionStorage.getItem as jasmine.Spy).and.returnValue(null);
    component.ngOnInit();
    expect(component.error).toContain('No role found');
  });

  it('should filter users by name or email', () => {
    component.users = [
      { name: 'Alice', email: 'alice@example.com' },
      { name: 'Bob', email: 'bob@example.com' },
    ];

    component.searchText = 'bob';
    component.applyFilter();
    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].name).toBe('Bob');
  });
});
