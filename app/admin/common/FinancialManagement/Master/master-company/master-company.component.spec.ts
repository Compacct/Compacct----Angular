import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterCompanyComponent } from './master-company.component';

describe('MasterCompanyComponent', () => {
  let component: MasterCompanyComponent;
  let fixture: ComponentFixture<MasterCompanyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterCompanyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
