import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { POAuthorizationComponent } from './po-authorization.component';

describe('POAuthorizationComponent', () => {
  let component: POAuthorizationComponent;
  let fixture: ComponentFixture<POAuthorizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ POAuthorizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(POAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
