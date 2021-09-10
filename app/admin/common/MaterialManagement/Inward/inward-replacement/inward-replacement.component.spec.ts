import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InwardReplacementComponent } from './inward-replacement.component';

describe('InwardReplacementComponent', () => {
  let component: InwardReplacementComponent;
  let fixture: ComponentFixture<InwardReplacementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InwardReplacementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InwardReplacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
