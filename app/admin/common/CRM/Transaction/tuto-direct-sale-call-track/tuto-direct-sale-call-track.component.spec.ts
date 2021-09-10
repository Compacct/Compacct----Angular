import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoDirectSaleCallTrackComponent } from './tuto-direct-sale-call-track.component';

describe('TutoDirectSaleCallTrackComponent', () => {
  let component: TutoDirectSaleCallTrackComponent;
  let fixture: ComponentFixture<TutoDirectSaleCallTrackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoDirectSaleCallTrackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoDirectSaleCallTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
