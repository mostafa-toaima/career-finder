import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillModelComponent } from './skill-model.component';

describe('SkillModelComponent', () => {
  let component: SkillModelComponent;
  let fixture: ComponentFixture<SkillModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SkillModelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SkillModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
