import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OilProductionComponent } from './oil-production.component';

describe('OilProductionComponent', () => {
  let component: OilProductionComponent;
  let fixture: ComponentFixture<OilProductionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OilProductionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OilProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
