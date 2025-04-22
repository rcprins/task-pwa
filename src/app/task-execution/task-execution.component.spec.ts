import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskExecutionComponent } from './task-execution.component';

describe('TaskExecutionComponent', () => {
  let component: TaskExecutionComponent;
  let fixture: ComponentFixture<TaskExecutionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskExecutionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaskExecutionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
