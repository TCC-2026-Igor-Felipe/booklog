import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import NavigationBar from './NavigationBar';

describe('Componente: NavigationBar', () => {
  it('deve renderizar os links de navegação principais', () => {
    render(
      <BrowserRouter>
        <NavigationBar />
      </BrowserRouter>
    );
    
    const linkPesquisa = screen.getByRole('link', { name: /pesquisa/i });
    const linkEstante = screen.getByRole('link', { name: /minha estante/i });
    const linkPerfil = screen.getByRole('link', { name: /perfil/i });
    
    expect(linkPesquisa).toBeInTheDocument();
    expect(linkPesquisa).toHaveAttribute('href', '/');
    
    expect(linkEstante).toBeInTheDocument();
    expect(linkEstante).toHaveAttribute('href', '/estante');
    
    expect(linkPerfil).toBeInTheDocument();
    expect(linkPerfil).toHaveAttribute('href', '/perfil');
  });
});