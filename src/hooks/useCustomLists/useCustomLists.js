import { useState } from 'react';

export default function useCustomLists() {
    const [listas, setListas] = useState(() => {
        const listasSalvas = window.localStorage.getItem('booklog_listas');
        return listasSalvas ? JSON.parse(listasSalvas) : [];
    });

    const salvarListas = (novasListas) => {
        setListas(novasListas);
        window.localStorage.setItem('booklog_listas', JSON.stringify(novasListas));
    };

    const criarLista = (titulo, descricao) => {
        const novaLista = {
            id: Date.now().toString(),
            titulo,
            descricao,
            livros: []
        };
        salvarListas([...listas, novaLista]);
    };

    const adicionarLivroNaLista = (idLista, livro) => {
        const novasListas = listas.map((lista) => {
            if (lista.id === idLista) {
                const jaExiste = lista.livros.find((l) => l.titulo === livro.titulo);
                if (jaExiste) return lista;

                return { ...lista, livros: [...lista.livros, livro] };
            }
            return lista;
        });
        salvarListas(novasListas);
    };

    const removerLivroDaLista = (idLista, tituloLivro) => {
        const novasListas = listas.map((lista) => {
            if (lista.id === idLista) {
                return {
                    ...lista,
                    livros: lista.livros.filter((l) => l.titulo !== tituloLivro)
                };
            }
            return lista;
        });
        salvarListas(novasListas);
    };

    const removerLista = (idLista) => {
        const novasListas = listas.filter((lista) => lista.id !== idLista);
        salvarListas(novasListas);
    };

    const atualizarLivrosDaLista = (idLista, novosLivros) => {
        const novasListas = listas.map((lista) => {
            if (lista.id === idLista) {
                return { ...lista, livros: novosLivros };
            }
            return lista;
        });
        salvarListas(novasListas);
    };

    return {
        listas,
        criarLista,
        adicionarLivroNaLista,
        removerLivroDaLista,
        removerLista,
        atualizarLivrosDaLista,
    };
}