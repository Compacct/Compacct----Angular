import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TutoMastereQNAComponent } from './tuto-mastere-qna.component';

describe('TutoMastereQNAComponent', () => {
  let component: TutoMastereQNAComponent;
  let fixture: ComponentFixture<TutoMastereQNAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TutoMastereQNAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutoMastereQNAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
