import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterRoyaleMaterialTypeComponent } from './master-royale-material-type.component';

describe('MasterRoyaleMaterialTypeComponent', () => {
  let component: MasterRoyaleMaterialTypeComponent;
  let fixture: ComponentFixture<MasterRoyaleMaterialTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MasterRoyaleMaterialTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterRoyaleMaterialTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
