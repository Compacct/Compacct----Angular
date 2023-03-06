import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NepalSubledgerAliasCategoryComponent } from './nepal-subledger-alias-category.component';

describe('NepalSubledgerAliasCategoryComponent', () => {
  let component: NepalSubledgerAliasCategoryComponent;
  let fixture: ComponentFixture<NepalSubledgerAliasCategoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NepalSubledgerAliasCategoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NepalSubledgerAliasCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
