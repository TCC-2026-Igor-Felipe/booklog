import { useState } from 'react';
import './StarRating.css';

export default function StarRating({ nota, setNota }) {
    const [hover, setHover] = useState(null);
    const valorAtual = hover !== null ? hover : (nota || 0);

    return (
        <div className="star-rating" onMouseLeave={() => setHover(null)}>
            {[...Array(5)].map((_, i) => {
                const isFull = valorAtual >= i + 1;
                const isHalf = valorAtual >= i + 0.5 && valorAtual < i + 1;

                return (
                    <div
                        key={i}
                        className={`star-wrapper ${isFull ? 'full' : ''} ${isHalf ? 'half' : ''}`}
                    >
                        <div
                            className="star-half left"
                            role="button"
                            onMouseEnter={() => setHover(i + 0.5)}
                            onClick={() => setNota(i + 0.5)}
                            aria-label={`${i + 0.5} estrelas`}
                        ></div>
                        
                        <div
                            className="star-half right"
                            role="button"
                            onMouseEnter={() => setHover(i + 1)}
                            onClick={() => setNota(i + 1)}
                            aria-label={`${i + 1} estrelas`}
                        ></div>
                    </div>
                );
            })}
        </div>
    );
}