import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderEstimateComponent } from './tender-estimate.component';

describe('TenderEstimateComponent', () => {
  let component: TenderEstimateComponent;
  let fixture: ComponentFixture<TenderEstimateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenderEstimateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenderEstimateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
