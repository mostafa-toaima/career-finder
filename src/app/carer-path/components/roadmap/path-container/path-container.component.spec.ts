import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PathContainerComponent } from './path-container.component';

describe('PathContainerComponent', () => {
  let component: PathContainerComponent;
  let fixture: ComponentFixture<PathContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PathContainerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PathContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
