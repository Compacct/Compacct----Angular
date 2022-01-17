import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderViewDetailsCompComponent } from './tender-view-details-comp.component';

describe('TenderViewDetailsCompComponent', () => {
  let component: TenderViewDetailsCompComponent;
  let fixture: ComponentFixture<TenderViewDetailsCompComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenderViewDetailsCompComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenderViewDetailsCompComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
