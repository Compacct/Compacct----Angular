import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BSHPLAudiologistAppoComponent } from './bshpl-audiologist-appo.component';

describe('BSHPLAudiologistAppoComponent', () => {
  let component: BSHPLAudiologistAppoComponent;
  let fixture: ComponentFixture<BSHPLAudiologistAppoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BSHPLAudiologistAppoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BSHPLAudiologistAppoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
