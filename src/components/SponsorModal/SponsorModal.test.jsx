/* eslint-env jest */

import { render } from '@testing-library/react';
import SponsorModal from './SponsorModal';

describe('SponsorModal', () => {
  it('renders into a portal attached to document.body', () => {
    const sponsorsSection = document.createElement('section');
    document.body.appendChild(sponsorsSection);

    render(
      <SponsorModal
        isOpen
        onClose={() => {}}
        onSubmit={() => {}}
        isSubmitting={false}
      />,
      { container: sponsorsSection },
    );

    const modalElement = document.querySelector('.sponsor-modal');

    expect(modalElement).not.toBeNull();
    expect(document.body.contains(modalElement)).toBe(true);
    expect(sponsorsSection.contains(modalElement)).toBe(false);

    sponsorsSection.remove();
  });
});
