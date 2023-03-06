import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HarbProjectBillComponent } from './harb-project-bill.component';

describe('HarbProjectBillComponent', () => {
  let component: HarbProjectBillComponent;
  let fixture: ComponentFixture<HarbProjectBillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HarbProjectBillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HarbProjectBillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
