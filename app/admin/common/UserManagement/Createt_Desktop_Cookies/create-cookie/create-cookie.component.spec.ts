import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCookieComponent } from './create-cookie.component';

describe('CreateCookieComponent', () => {
  let component: CreateCookieComponent;
  let fixture: ComponentFixture<CreateCookieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCookieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCookieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
