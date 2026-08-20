import { useState, useEffect } from 'react';
import './StatusModal.css';
import StarRating from '../StarRating/StarRating';

export default function StatusModal({ livro, isOpen, onClose, onSave, onDelete, listas = [], onAddToList }) {
    const [status, setStatus] = useState('QUERO_LER');
    const [nota, setNota] = useState('');
    const [resenha, setResenha] = useState('');
    const [listaSelecionada, setListaSelecionada] = useState('');

    useEffect(() => {
        if (livro?.statusLeitura) {
            setStatus(livro.statusLeitura);
            setNota(livro.notaAvaliacao || '');
            setResenha(livro.resenhaTextual || '');
        } else {
            setStatus('QUERO_LER');
            setNota('');
            setResenha('');
        }
    }, [livro, isOpen]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave({
            statusLeitura: status,
            notaAvaliacao: nota ? Number(nota) : null,
            resenhaTextual: resenha
        });
        onClose();
    };

    const handleDecreaseOrDelete = () => {
        if (onDelete) {
            onDelete();
        }
        onClose();
    };

    const handleAddToList = () => {
        if (listaSelecionada && onAddToList) {
            onAddToList(listaSelecionada);
            setListaSelecionada('');
        }
    };

    const estaNaEstante = Boolean(livro?.statusLeitura);

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Atualizar Estante</h3>
                <p>Livro: <strong>{livro?.titulo}</strong></p>

                <div className="modal-form-group">
                    <label htmlFor="status-select">Status de Leitura: </label>
                    <select
                        id="status-select"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="QUERO_LER">Quero Ler</option>
                        <option value="LENDO">Lendo</option>
                        <option value="LIDO">Lido</option>
                        <option value="ABANDONADO">Abandonado</option>
                    </select>
                </div>

                {status === 'LIDO' && (
                    <>
                        <div className="modal-form-group">
                            <label>Avaliação: </label>
                            <StarRating nota={nota} setNota={setNota} />
                        </div>
                        <div className="modal-form-group">
                            <label htmlFor="resenha-input">Resenha: </label>
                            <textarea
                                id="resenha-input"
                                rows="3"
                                value={resenha}
                                onChange={(e) => setResenha(e.target.value)}
                            />
                        </div>
                    </>
                )}

                {listas.length > 0 && (
                    <div className="modal-form-group">
                        <label htmlFor="lista-select">Adicionar à Lista: </label>
                        <div style={{ display: 'flex', gap: '10px', marginTop: '8px', marginBottom: '20px' }}>
                            <select
                                id="lista-select"
                                value={listaSelecionada}
                                onChange={(e) => setListaSelecionada(e.target.value)}
                                style={{ margin: 0 }}
                            >
                                <option value="">Selecione uma lista...</option>
                                {listas.map((lista) => (
                                    <option key={lista.id} value={lista.id}>
                                        {lista.titulo}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={handleAddToList}
                                title="Adicionar livro à lista"
                                style={{ background: 'var(--accent-color)', color: '#fff', border: 'none', borderRadius: '6px', padding: '0 15px', cursor: 'pointer' }}
                            >
                                +
                            </button>
                        </div>
                    </div>
                )}

                <div className="modal-actions">
                    <button className="btn-cancelar" onClick={onClose}>Cancelar</button>
                    <button className="btn-salvar" onClick={handleSave}>Salvar</button>
                    {estaNaEstante && (
                        <button className="btn-excluir" onClick={handleDecreaseOrDelete} title="Excluir da estante">
                            🗑️
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}