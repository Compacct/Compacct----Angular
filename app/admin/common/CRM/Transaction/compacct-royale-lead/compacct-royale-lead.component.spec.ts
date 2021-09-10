import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompacctRoyaleLeadComponent } from './compacct-royale-lead.component';

describe('CompacctRoyaleLeadComponent', () => {
  let component: CompacctRoyaleLeadComponent;
  let fixture: ComponentFixture<CompacctRoyaleLeadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompacctRoyaleLeadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompacctRoyaleLeadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
