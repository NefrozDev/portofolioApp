import { ComponentFixture, TestBed } from '@angular/core/testing';

import { getGlossaryInfoKey } from '@common/constants/glossary';
import { provideTestI18n } from '../../../testing/provide-test-i18n';
import { InfoTerm } from './info-term';

describe('InfoTerm', () => {
  let component: InfoTerm;
  let fixture: ComponentFixture<InfoTerm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoTerm],
      providers: [...provideTestI18n()]
    }).compileComponents();

    fixture = TestBed.createComponent(InfoTerm);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('label', 'Docker');
    fixture.componentRef.setInput(
      'descriptionKey',
      'app.glossary.docker'
    );
    fixture.detectChanges();
  });

  it('should render the translated information for the term', () => {
    const host = fixture.nativeElement as HTMLElement;
    const trigger = host.querySelector<HTMLButtonElement>('.info-term__trigger');
    const tooltip = host.querySelector<HTMLElement>('[role="tooltip"]');

    expect(trigger?.textContent).toContain('Docker');
    expect(trigger?.getAttribute('aria-label')).toBe('More information about Docker');
    expect(tooltip?.textContent).toContain('packages an application');
  });

  it('should toggle on click and close on Escape', () => {
    const trigger = fixture.nativeElement.querySelector(
      '.info-term__trigger'
    ) as HTMLButtonElement;

    trigger.click();
    fixture.detectChanges();
    expect(component.isOpen()).toBeTrue();

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    fixture.detectChanges();
    expect(component.isOpen()).toBeFalse();
  });

  it('should place an embedded tooltip in the top layer', () => {
    fixture.componentRef.setInput('embedded', true);
    fixture.detectChanges();

    const trigger = fixture.nativeElement.querySelector(
      '.info-term__trigger'
    ) as HTMLElement;
    const tooltip = fixture.nativeElement.querySelector(
      '[role="tooltip"]'
    ) as HTMLElement;

    trigger.click();
    fixture.detectChanges();

    expect(tooltip.matches(':popover-open')).toBeTrue();

    trigger.click();
    fixture.detectChanges();

    expect(tooltip.matches(':popover-open')).toBeFalse();
  });

  it('should include the approved glossary terms and omit the exclusions', () => {
    const includedTerms = [
      'Angular',
      'TypeScript',
      'Node.js',
      'Express',
      'SCSS',
      'RxJS',
      'Docker',
      'API',
      'REST API',
      'WebSocket',
      'ROS / ROS2',
      'MQTT',
      'AI',
      'Gerrit',
      'C#',
      '.NET',
      'SQL',
      'Azure DevOps',
      'FastAPI',
      'Python',
      'Microsoft Dynamics 365',
      'Power Platform',
      'Ionic',
      'NgRx',
      'seo',
      'ci-cd'
    ];
    const excludedTerms = [
      'Automation',
      'Data Processing',
      'performance',
      'optimization',
      'testing',
      'security',
      'maintainability',
      'documentation',
      'observability',
      'scalability',
      'real-time',
      'responsive',
      'data-visualization',
      'architecture',
      'accessibility',
      'internationalization'
    ];

    expect(includedTerms.every((term) => getGlossaryInfoKey(term))).toBeTrue();
    expect(excludedTerms.every((term) => !getGlossaryInfoKey(term))).toBeTrue();
  });
});
