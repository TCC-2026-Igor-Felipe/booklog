import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FilterBar from './FilterBar';

describe('FilterBar Component', () => {
  it('deve renderizar os seletores de gênero e ano de publicação', () => {
    render(<FilterBar />);
    
    const seletorGenero = screen.getByRole('combobox', { name: /gênero/i });
    const seletorAno = screen.getByRole('combobox', { name: /ano/i });
    
    expect(seletorGenero).toBeInTheDocument();
    expect(seletorAno).toBeInTheDocument();
  });
});