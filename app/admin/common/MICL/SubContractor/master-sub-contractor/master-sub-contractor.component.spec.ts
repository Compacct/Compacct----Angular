import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterSubContractorComponent } from './master-sub-contractor.component';

describe('MasterSubContractorComponent', () => {
  let component: MasterSubContractorComponent;
  let fixture: ComponentFixture<MasterSubContractorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterSubContractorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterSubContractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
