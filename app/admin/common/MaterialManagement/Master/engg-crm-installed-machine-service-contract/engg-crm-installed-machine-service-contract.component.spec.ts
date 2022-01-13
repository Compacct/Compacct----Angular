import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnggCrmInstalledMachineServiceContractComponent } from './engg-crm-installed-machine-service-contract.component';

describe('EnggCrmInstalledMachineServiceContractComponent', () => {
  let component: EnggCrmInstalledMachineServiceContractComponent;
  let fixture: ComponentFixture<EnggCrmInstalledMachineServiceContractComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnggCrmInstalledMachineServiceContractComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnggCrmInstalledMachineServiceContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
