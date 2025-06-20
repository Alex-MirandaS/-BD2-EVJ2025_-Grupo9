import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploGrafosComponent } from './explo-grafos.component';

describe('ExploGrafosComponent', () => {
  let component: ExploGrafosComponent;
  let fixture: ComponentFixture<ExploGrafosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExploGrafosComponent]
    });
    fixture = TestBed.createComponent(ExploGrafosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
