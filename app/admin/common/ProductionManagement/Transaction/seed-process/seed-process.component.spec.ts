import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SeedProcessComponent } from './seed-process.component';

describe('SeedProcessComponent', () => {
  let component: SeedProcessComponent;
  let fixture: ComponentFixture<SeedProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SeedProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SeedProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
