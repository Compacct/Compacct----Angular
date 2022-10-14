import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MICLMasterConsumbleComponent } from './micl-master-consumble.component';

describe('MICLMasterConsumbleComponent', () => {
  let component: MICLMasterConsumbleComponent;
  let fixture: ComponentFixture<MICLMasterConsumbleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MICLMasterConsumbleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MICLMasterConsumbleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
