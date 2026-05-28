import { useState } from 'react';

export default function useShelf() {
    const [estante, setEstante] = useState(() => {
        const estanteSalva = window.localStorage.getItem('booklog_estante');
        return estanteSalva ? JSON.parse(estanteSalva) : [];
    });

    const adicionarLivro = (livro, statusLeitura) => {
        const novoLivroComStatus = { ...livro, statusLeitura };

        setEstante((estanteAnterior) => {
            const novaEstante = [...estanteAnterior, novoLivroComStatus];

            window.localStorage.setItem('booklog_estante', JSON.stringify(novaEstante));

            return novaEstante;
        });
    };

    return {
        estante,
        adicionarLivro
    };
}