import { useState } from 'react';

export default function useSearch(resultados = []) {
    const [termoBusca, setTermoBusca] = useState('');
    const [filtroGenero, setFiltroGenero] = useState('');
    const [filtroAno, setFiltroAno] = useState('');

    const livrosFiltrados = resultados.filter((livro) => {
        const termo = termoBusca.toLowerCase();
        const titulo = livro?.titulo?.toLowerCase() || '';
        const autor = livro?.autor?.toLowerCase() || '';

        const passouNoTexto = titulo.includes(termo) || autor.includes(termo);
        const passouNoGenero = filtroGenero === '' || livro?.genero === filtroGenero;
        const passouNoAno = filtroAno === '' || String(livro?.ano || '').startsWith(String(filtroAno));

        return passouNoTexto && passouNoGenero && passouNoAno;
    });

    return {
        termoBusca,
        setTermoBusca,
        filtroGenero,
        setFiltroGenero,
        filtroAno,
        setFiltroAno,
        livrosFiltrados
    };
}