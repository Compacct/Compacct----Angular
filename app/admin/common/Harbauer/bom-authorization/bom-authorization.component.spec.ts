import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BOMAuthorizationComponent } from './bom-authorization.component';

describe('BOMAuthorizationComponent', () => {
  let component: BOMAuthorizationComponent;
  let fixture: ComponentFixture<BOMAuthorizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BOMAuthorizationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BOMAuthorizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
