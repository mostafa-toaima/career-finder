import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathHeaderComponent } from './path-header.component';

describe('PathHeaderComponent', () => {
  let component: PathHeaderComponent;
  let fixture: ComponentFixture<PathHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PathHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PathHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
