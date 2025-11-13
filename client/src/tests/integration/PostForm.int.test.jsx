import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PostForm from '../../components/PostForm';

function mockFetchOnce(status = 200, body = {}) {
  global.fetch = jest.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: jest.fn().mockResolvedValue(body),
  });
}

describe('PostForm integration', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('shows validation error when fields are empty', async () => {
    render(<PostForm token="t" onSuccess={jest.fn()} />);
    fireEvent.submit(screen.getByRole('button', { name: /submit/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent('All fields are required');
  });

  it('submits data and calls onSuccess on success', async () => {
    const onSuccess = jest.fn();
    mockFetchOnce(201, { _id: '1', title: 'T' });
    render(<PostForm token="t" onSuccess={onSuccess} />);

    fireEvent.change(screen.getByLabelText('title'), { target: { value: 'T' } });
    fireEvent.change(screen.getByLabelText('content'), { target: { value: 'C' } });
    fireEvent.change(screen.getByLabelText('category'), { target: { value: 'cat' } });

    fireEvent.submit(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    expect(fetch).toHaveBeenCalledWith('/api/posts', expect.any(Object));
  });

  it('shows server error message on failure', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 400,
      json: jest.fn().mockResolvedValue({ error: 'Validation failed' }),
    });

    render(<PostForm token="t" onSuccess={jest.fn()} />);

    fireEvent.change(screen.getByLabelText('title'), { target: { value: 'T' } });
    fireEvent.change(screen.getByLabelText('content'), { target: { value: 'C' } });
    fireEvent.change(screen.getByLabelText('category'), { target: { value: 'cat' } });

    fireEvent.submit(screen.getByRole('button', { name: /submit/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent('Validation failed');
  });
});
