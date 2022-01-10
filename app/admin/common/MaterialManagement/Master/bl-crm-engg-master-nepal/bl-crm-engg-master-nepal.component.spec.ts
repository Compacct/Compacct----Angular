import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlCrmEnggMasterNepalComponent } from './bl-crm-engg-master-nepal.component';

describe('BlCrmEnggMasterNepalComponent', () => {
  let component: BlCrmEnggMasterNepalComponent;
  let fixture: ComponentFixture<BlCrmEnggMasterNepalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlCrmEnggMasterNepalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlCrmEnggMasterNepalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
