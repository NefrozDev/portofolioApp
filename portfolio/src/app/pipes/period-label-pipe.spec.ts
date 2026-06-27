import { PeriodLabelPipe } from './period-label-pipe';

describe('PeriodLabelPipe', () => {
  it('create an instance', () => {
    const pipe = new PeriodLabelPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return a neutral placeholder when no period is provided', () => {
    const pipe = new PeriodLabelPipe();

    expect(pipe.transform('')).toBe('-');
  });
});
