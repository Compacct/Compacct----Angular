import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MICLRawMaterialQAComponent } from './micl-raw-material-qa.component';

describe('MICLRawMaterialQAComponent', () => {
  let component: MICLRawMaterialQAComponent;
  let fixture: ComponentFixture<MICLRawMaterialQAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MICLRawMaterialQAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MICLRawMaterialQAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
