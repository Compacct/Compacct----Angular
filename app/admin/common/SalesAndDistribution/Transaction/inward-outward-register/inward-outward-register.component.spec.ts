import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InwardOutwardRegisterComponent } from './inward-outward-register.component';

describe('InwardOutwardRegisterComponent', () => {
  let component: InwardOutwardRegisterComponent;
  let fixture: ComponentFixture<InwardOutwardRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InwardOutwardRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InwardOutwardRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
