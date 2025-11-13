import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorBoundary from '../../components/ErrorBoundary';

function Boom() {
  throw new Error('Boom');
}

describe('ErrorBoundary', () => {
  it('renders fallback UI when a child throws', () => {
    render(
      <ErrorBoundary fallback={<div>fallback</div>}>
        <Boom />
      </ErrorBoundary>
    );
    expect(screen.getByText('fallback')).toBeInTheDocument();
  });
});
