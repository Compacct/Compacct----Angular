import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnggCrmInstalledMachineComponent } from './engg-crm-installed-machine.component';

describe('EnggCrmInstalledMachineComponent', () => {
  let component: EnggCrmInstalledMachineComponent;
  let fixture: ComponentFixture<EnggCrmInstalledMachineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnggCrmInstalledMachineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnggCrmInstalledMachineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
