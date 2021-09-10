import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MachineUsesComponent } from './machine-uses.component';

describe('MachineUsesComponent', () => {
  let component: MachineUsesComponent;
  let fixture: ComponentFixture<MachineUsesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MachineUsesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MachineUsesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
