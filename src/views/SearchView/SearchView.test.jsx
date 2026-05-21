import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import SearchView from './SearchView';

describe('SearchView Component', () => {
  it('deve renderizar a barra de pesquisa na tela principal', () => {
    render(<SearchView />);
    
    const searchInput = screen.getByPlaceholderText('Buscar por título ou autor...');
    
    expect(searchInput).toBeInTheDocument();
  });
});