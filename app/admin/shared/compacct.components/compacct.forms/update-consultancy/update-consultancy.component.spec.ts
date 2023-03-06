import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateConsultancyComponent } from './update-consultancy.component';

describe('UpdateConsultancyComponent', () => {
  let component: UpdateConsultancyComponent;
  let fixture: ComponentFixture<UpdateConsultancyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateConsultancyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateConsultancyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
