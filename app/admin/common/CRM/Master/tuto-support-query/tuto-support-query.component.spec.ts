import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoSupportQueryComponent } from './tuto-support-query.component';

describe('TutoSupportQueryComponent', () => {
  let component: TutoSupportQueryComponent;
  let fixture: ComponentFixture<TutoSupportQueryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoSupportQueryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoSupportQueryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
