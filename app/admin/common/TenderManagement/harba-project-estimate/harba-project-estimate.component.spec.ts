import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HarbaProjectEstimateComponent } from './harba-project-estimate.component';

describe('HarbaProjectEstimateComponent', () => {
  let component: HarbaProjectEstimateComponent;
  let fixture: ComponentFixture<HarbaProjectEstimateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HarbaProjectEstimateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HarbaProjectEstimateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
