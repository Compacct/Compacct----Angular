import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompacctCivildailyJobComponent } from './compacct.civildaily-job.component';

describe('CompacctCivildailyJobComponent', () => {
  let component: CompacctCivildailyJobComponent;
  let fixture: ComponentFixture<CompacctCivildailyJobComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompacctCivildailyJobComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompacctCivildailyJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
