import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterCompanyUpdateComponent } from './master-company-update.component';

describe('MasterCompanyUpdateComponent', () => {
  let component: MasterCompanyUpdateComponent;
  let fixture: ComponentFixture<MasterCompanyUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterCompanyUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterCompanyUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
