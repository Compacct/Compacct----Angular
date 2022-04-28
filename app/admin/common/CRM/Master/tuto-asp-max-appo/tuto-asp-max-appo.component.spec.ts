import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoAspMaxAppoComponent } from './tuto-asp-max-appo.component';

describe('TutoAspMaxAppoComponent', () => {
  let component: TutoAspMaxAppoComponent;
  let fixture: ComponentFixture<TutoAspMaxAppoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoAspMaxAppoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoAspMaxAppoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
