import { useState, useEffect } from 'react';
import './StatusModal.css';

export default function StatusModal({ livro, isOpen, onClose, onSave, onDelete }) {
    const [status, setStatus] = useState('QUERO_LER');
    const [nota, setNota] = useState('');
    const [resenha, setResenha] = useState('');

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
        // Envia o objeto completo conforme exigido pelos testes
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

                {/* Renderização condicional dos novos campos */}
                {status === 'LIDO' && (
                    <>
                        <div className="modal-form-group">
                            <label htmlFor="nota-input">Nota (1 a 5): </label>
                            <input
                                id="nota-input"
                                type="number"
                                min="1"
                                max="5"
                                value={nota}
                                onChange={(e) => setNota(e.target.value)}
                            />
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