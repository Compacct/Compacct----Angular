import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoTempCrmLeadComponent } from './tuto-temp-crm-lead.component';

describe('TutoTempCrmLeadComponent', () => {
  let component: TutoTempCrmLeadComponent;
  let fixture: ComponentFixture<TutoTempCrmLeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoTempCrmLeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoTempCrmLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
