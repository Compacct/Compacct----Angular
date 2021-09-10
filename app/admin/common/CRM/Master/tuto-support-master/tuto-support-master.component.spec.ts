import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoSupportMasterComponent } from './tuto-support-master.component';

describe('TutoSupportMasterComponent', () => {
  let component: TutoSupportMasterComponent;
  let fixture: ComponentFixture<TutoSupportMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoSupportMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoSupportMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
