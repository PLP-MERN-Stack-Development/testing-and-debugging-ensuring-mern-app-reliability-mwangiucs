import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import useFetchPosts from '../../hooks/useFetchPosts';

function Harness() {
  const { data, loading, error } = useFetchPosts();
  if (loading) return <div>loading</div>;
  if (error) return <div role="alert">{error}</div>;
  return <div data-testid="count">{data.length}</div>;
}

describe('useFetchPosts', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('loads posts successfully', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue([{ _id: '1' }, { _id: '2' }]),
    });

    render(<Harness />);
    expect(screen.getByText('loading')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByTestId('count')).toHaveTextContent('2'));
  });

  it('shows error when request fails', async () => {
    global.fetch = jest.fn().mockResolvedValue({ ok: false, status: 500 });

    render(<Harness />);
    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
  });
});
