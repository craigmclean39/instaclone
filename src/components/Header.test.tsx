import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from './Header';

test('Render instagram Logo', () => {
  render(<Header />);
  const instagramLogo = screen.getByAltText('Instagram');
  expect(instagramLogo).toBeInTheDocument();
});

test('Render Header Icons', () => {
  render(<Header />);
  const home = screen.getByText('home.svg');
  const direct = screen.getByText('explore.svg');
  const post = screen.getByText('newpost.svg');
  const explore = screen.getByText('explore.svg');
  const feed = screen.getByText('activityfeed.svg');

  expect(home).toBeInTheDocument();
  expect(direct).toBeInTheDocument();
  expect(post).toBeInTheDocument();
  expect(explore).toBeInTheDocument();
  expect(feed).toBeInTheDocument();
});
