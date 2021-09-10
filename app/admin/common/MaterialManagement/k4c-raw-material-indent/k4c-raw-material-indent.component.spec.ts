import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { K4cRawMaterialIndentComponent } from './k4c-raw-material-indent.component';

describe('K4cRawMaterialIndentComponent', () => {
  let component: K4cRawMaterialIndentComponent;
  let fixture: ComponentFixture<K4cRawMaterialIndentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ K4cRawMaterialIndentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(K4cRawMaterialIndentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
