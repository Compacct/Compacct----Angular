import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptReturnMaterialComponent } from './accept-return-material.component';

describe('AcceptReturnMaterialComponent', () => {
  let component: AcceptReturnMaterialComponent;
  let fixture: ComponentFixture<AcceptReturnMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcceptReturnMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptReturnMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
