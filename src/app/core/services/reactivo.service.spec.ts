import { TestBed } from '@angular/core/testing';

import { ReactivoService } from './reactivo.service';

describe('ReactivoService', () => {
  let service: ReactivoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReactivoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
