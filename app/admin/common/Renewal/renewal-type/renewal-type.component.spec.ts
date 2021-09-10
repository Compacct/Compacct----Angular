import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RenewalTypeComponent } from './renewal-type.component';

describe('RenewalTypeComponent', () => {
  let component: RenewalTypeComponent;
  let fixture: ComponentFixture<RenewalTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenewalTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenewalTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
