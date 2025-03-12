import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelcetUniversityComponent } from './selcet-university.component';

describe('SelcetUniversityComponent', () => {
  let component: SelcetUniversityComponent;
  let fixture: ComponentFixture<SelcetUniversityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelcetUniversityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelcetUniversityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
