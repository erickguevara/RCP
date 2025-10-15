import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CropSelectionPage } from './crop-selection.page';

describe('CropSelectionPage', () => {
  let component: CropSelectionPage;
  let fixture: ComponentFixture<CropSelectionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CropSelectionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
