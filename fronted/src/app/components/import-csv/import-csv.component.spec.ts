import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportCSVComponent } from './import-csv.component';

describe('ImportCSVComponent', () => {
  let component: ImportCSVComponent;
  let fixture: ComponentFixture<ImportCSVComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImportCSVComponent]
    });
    fixture = TestBed.createComponent(ImportCSVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
