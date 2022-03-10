import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAbsentComponent } from './user-absent.component';

describe('UserAbsentComponent', () => {
  let component: UserAbsentComponent;
  let fixture: ComponentFixture<UserAbsentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserAbsentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserAbsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
