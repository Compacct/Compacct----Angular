import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterUOMCommonComponent } from './master-uom-common.component';

describe('MasterUOMCommonComponent', () => {
  let component: MasterUOMCommonComponent;
  let fixture: ComponentFixture<MasterUOMCommonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterUOMCommonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterUOMCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
