import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderHarbauerActualViewComponent } from './tender-harbauer-actual-view.component';

describe('TenderHarbauerActualViewComponent', () => {
  let component: TenderHarbauerActualViewComponent;
  let fixture: ComponentFixture<TenderHarbauerActualViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenderHarbauerActualViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenderHarbauerActualViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
