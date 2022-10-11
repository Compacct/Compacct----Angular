import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MiclRawMaterialComponent } from './micl-raw-material.component';

describe('MiclRawMaterialComponent', () => {
  let component: MiclRawMaterialComponent;
  let fixture: ComponentFixture<MiclRawMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MiclRawMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiclRawMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
