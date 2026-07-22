import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoShell } from './demo-shell';

describe('DemoShell', () => {
  let fixture: ComponentFixture<DemoShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [DemoShell] }).compileComponents();

    fixture = TestBed.createComponent(DemoShell);
    fixture.componentRef.setInput('title', 'Robot dashboard');
    fixture.componentRef.setInput('returnUrl', '/en/projects');
    fixture.detectChanges();
  });

  it('should render the project title and portfolio return link', () => {
    const host = fixture.nativeElement as HTMLElement;
    const returnLink = host.querySelector<HTMLAnchorElement>('.demo-shell__back');

    expect(host.querySelector('h1')?.textContent).toContain('Robot dashboard');
    expect(returnLink?.getAttribute('href')).toBe('/en/projects');
  });
});
