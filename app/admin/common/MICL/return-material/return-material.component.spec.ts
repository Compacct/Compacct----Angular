import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnMaterialComponent } from './return-material.component';

describe('ReturnMaterialComponent', () => {
  let component: ReturnMaterialComponent;
  let fixture: ComponentFixture<ReturnMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
