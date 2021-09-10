import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PpBagProcessComponent } from './pp-bag-process.component';

describe('PpBagProcessComponent', () => {
  let component: PpBagProcessComponent;
  let fixture: ComponentFixture<PpBagProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PpBagProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PpBagProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
