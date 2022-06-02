import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BSHPAmeyoKBComponent } from './bshp-ameyo-kb.component';

describe('BSHPAmeyoKBComponent', () => {
  let component: BSHPAmeyoKBComponent;
  let fixture: ComponentFixture<BSHPAmeyoKBComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BSHPAmeyoKBComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BSHPAmeyoKBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
