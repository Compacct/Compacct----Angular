import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EarMouldComponent } from './ear-mould.component';

describe('EarMouldComponent', () => {
  let component: EarMouldComponent;
  let fixture: ComponentFixture<EarMouldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EarMouldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EarMouldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
