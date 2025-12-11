import { TestBed } from '@angular/core/testing';

import { StudySession } from './study-session';

describe('StudySession', () => {
  let service: StudySession;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudySession);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
