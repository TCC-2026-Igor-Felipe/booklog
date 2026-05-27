import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FilterBar from './FilterBar';

describe('FilterBar Component', () => {
  it('deve renderizar os seletores de gênero e ano de publicação', () => {
    render(<FilterBar />);

    const seletorGenero = screen.getByRole('combobox', { name: /gênero/i });
    const seletorAno = screen.getByRole('combobox', { name: /ano/i });

    expect(seletorGenero).toBeInTheDocument();
    expect(seletorAno).toBeInTheDocument();
  });

  it('deve chamar a função onFilterChange quando o usuário seleciona um género', () => {
    const mockOnFilterChange = vi.fn();

    render(<FilterBar onFilterChange={mockOnFilterChange} />);

    const seletorGenero = screen.getByRole('combobox', { name: /gênero/i });

    fireEvent.change(seletorGenero, { target: { value: 'Ficção' } });

    expect(mockOnFilterChange).toHaveBeenCalled();
  });
});