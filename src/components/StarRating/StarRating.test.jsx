import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import StarRating from './StarRating';

describe('Componente: StarRating', () => {
    it('deve renderizar a nota inicial corretamente com estrelas inteiras e metades', () => {
        const { container } = render(<StarRating nota={3.5} setNota={vi.fn()} />);
        
        const fullStars = container.querySelectorAll('.star-wrapper.full');
        const halfStars = container.querySelectorAll('.star-wrapper.half');
        
        expect(fullStars).toHaveLength(3);
        expect(halfStars).toHaveLength(1);
    });

    it('deve atualizar visualmente a quantidade de estrelas ao passar o mouse (hover) e resetar ao sair', () => {
        const { container } = render(<StarRating nota={0} setNota={vi.fn()} />);
        
        const ratingContainer = container.querySelector('.star-rating');
        
        const halfStar = screen.getByLabelText('1.5 estrelas');
        const fullStar = screen.getByLabelText('2 estrelas');

        fireEvent.mouseEnter(halfStar);
        expect(container.querySelectorAll('.star-wrapper.full')).toHaveLength(1);
        expect(container.querySelectorAll('.star-wrapper.half')).toHaveLength(1);

        fireEvent.mouseEnter(fullStar);
        expect(container.querySelectorAll('.star-wrapper.full')).toHaveLength(2);
        expect(container.querySelectorAll('.star-wrapper.half')).toHaveLength(0);

        fireEvent.mouseLeave(ratingContainer);
        expect(container.querySelectorAll('.star-wrapper.full')).toHaveLength(0);
        expect(container.querySelectorAll('.star-wrapper.half')).toHaveLength(0);
    });

    it('deve chamar a função setNota com o valor correto ao clicar em uma estrela inteira e meia estrela', () => {
        const mockSetNota = vi.fn();
        render(<StarRating nota={0} setNota={mockSetNota} />);
        
        fireEvent.click(screen.getByLabelText('4.5 estrelas'));
        expect(mockSetNota).toHaveBeenCalledWith(4.5);

        fireEvent.click(screen.getByLabelText('5 estrelas'));
        expect(mockSetNota).toHaveBeenCalledWith(5);
    });
});