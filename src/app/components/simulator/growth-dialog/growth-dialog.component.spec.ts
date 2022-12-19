import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrowthDialogComponent } from './growth-dialog.component';

describe('GrowthDialogComponent', () => {
  let component: GrowthDialogComponent;
  let fixture: ComponentFixture<GrowthDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GrowthDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GrowthDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
