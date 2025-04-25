import { TestBed } from '@angular/core/testing';

import { TaskExecutionService } from './services/task-execution.service';

describe('TaskExecutionService', () => {
  let service: TaskExecutionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskExecutionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
