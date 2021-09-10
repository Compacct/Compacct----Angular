import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4cMasterBOMReciepeComponent } from './k4c-master-bom-reciepe.component';

describe('K4cMasterBOMReciepeComponent', () => {
  let component: K4cMasterBOMReciepeComponent;
  let fixture: ComponentFixture<K4cMasterBOMReciepeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4cMasterBOMReciepeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4cMasterBOMReciepeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
