import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FilterBar from './FilterBar';

describe('FilterBar Component', () => {
  it('deve renderizar o seletor de gênero e o campo de ano de publicação', () => {
    render(<FilterBar />);

    const seletorGenero = screen.getByRole('combobox', { name: /gênero/i }); S
    const inputAno = screen.getByRole('spinbutton', { name: /ano/i });

    expect(seletorGenero).toBeInTheDocument();
    expect(inputAno).toBeInTheDocument();
  });

  it('deve chamar a função onFilterChange quando o usuário seleciona um género e digita um ano', () => {
    const mockOnFilterChange = vi.fn();
    render(<FilterBar onFilterChange={mockOnFilterChange} />);

    const seletorGenero = screen.getByRole('combobox', { name: /gênero/i });
    const inputAno = screen.getByRole('spinbutton', { name: /ano/i });

    fireEvent.change(seletorGenero, { target: { value: 'Fantasia' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith('genero', 'Fantasia');

    fireEvent.change(inputAno, { target: { value: '1984' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith('ano', '1984');
  });
});