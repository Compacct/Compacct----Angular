import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoMasterSalesteamComponent } from './tuto-master-salesteam.component';

describe('TutoMasterSalesteamComponent', () => {
  let component: TutoMasterSalesteamComponent;
  let fixture: ComponentFixture<TutoMasterSalesteamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoMasterSalesteamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoMasterSalesteamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
