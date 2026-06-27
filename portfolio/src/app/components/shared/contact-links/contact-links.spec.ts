import { ComponentFixture, TestBed } from '@angular/core/testing';

import { provideTestI18n } from '../../../testing/provide-test-i18n';
import { ContactLinks } from './contact-links';

describe('ContactLinks', () => {
  let component: ContactLinks;
  let fixture: ComponentFixture<ContactLinks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactLinks],
      providers: [...provideTestI18n()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactLinks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
