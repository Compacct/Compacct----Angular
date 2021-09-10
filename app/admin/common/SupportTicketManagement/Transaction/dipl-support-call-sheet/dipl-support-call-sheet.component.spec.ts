import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DIPLSupportCallSheetComponent } from './dipl-support-call-sheet.component';

describe('DIPLSupportCallSheetComponent', () => {
  let component: DIPLSupportCallSheetComponent;
  let fixture: ComponentFixture<DIPLSupportCallSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DIPLSupportCallSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DIPLSupportCallSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
