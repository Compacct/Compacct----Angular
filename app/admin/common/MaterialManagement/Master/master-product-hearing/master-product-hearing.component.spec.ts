import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterProductHearingComponent } from './master-product-hearing.component';

describe('MasterProductHearingComponent', () => {
  let component: MasterProductHearingComponent;
  let fixture: ComponentFixture<MasterProductHearingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterProductHearingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterProductHearingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
