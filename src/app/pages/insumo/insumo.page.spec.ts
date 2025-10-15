import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InsumoPage } from './insumo.page';

describe('InsumoPage', () => {
  let component: InsumoPage;
  let fixture: ComponentFixture<InsumoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InsumoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
