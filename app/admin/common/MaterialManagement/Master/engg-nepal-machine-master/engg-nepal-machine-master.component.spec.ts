import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnggNepalMachineMasterComponent } from './engg-nepal-machine-master.component';

describe('EnggNepalMachineMasterComponent', () => {
  let component: EnggNepalMachineMasterComponent;
  let fixture: ComponentFixture<EnggNepalMachineMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnggNepalMachineMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnggNepalMachineMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
