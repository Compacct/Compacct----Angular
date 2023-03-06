import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { POAuthorizationHarbauerComponent } from './po-authorization-harbauer.component';

describe('POAuthorizationHarbauerComponent', () => {
  let component: POAuthorizationHarbauerComponent;
  let fixture: ComponentFixture<POAuthorizationHarbauerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ POAuthorizationHarbauerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(POAuthorizationHarbauerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
