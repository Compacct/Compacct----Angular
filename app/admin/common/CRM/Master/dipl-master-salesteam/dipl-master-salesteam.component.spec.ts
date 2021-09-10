import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiplMasterSalesteamComponent } from './dipl-master-salesteam.component';

describe('DiplMasterSalesteamComponent', () => {
  let component: DiplMasterSalesteamComponent;
  let fixture: ComponentFixture<DiplMasterSalesteamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiplMasterSalesteamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiplMasterSalesteamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
