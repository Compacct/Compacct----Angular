import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TenderHarbauerViewComponent } from './tender-harbauer-view.component';

describe('TenderHarbauerViewComponent', () => {
  let component: TenderHarbauerViewComponent;
  let fixture: ComponentFixture<TenderHarbauerViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TenderHarbauerViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TenderHarbauerViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
