import React from 'react';
import './FormattedText.css';

/**
 * Convierte texto con formato simple a HTML con estilos.
 * - **texto** → <strong>texto</strong>
 * - Líneas en blanco → separadores de párrafo
 */
const FormattedText = ({ text }) => {
  if (!text) return null;

  // Dividir por líneas
  const lines = text.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Saltos de línea vacíos → separadores
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Detectar si es un título (termina con ":" o empieza con número+.)
    const isTitle = /^[0-9]+[\.\)]\s/.test(line.trim()) || 
                     line.trim().endsWith(':') ||
                     /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+:/.test(line.trim());

    // Detectar si es un ítem de lista (empieza con - o •)
    const isListItem = /^[\-\•]\s/.test(line.trim());

    if (isListItem) {
      // Agrupar ítems de lista consecutivos
      const items = [];
      while (i < lines.length && /^[\-\•]\s/.test(lines[i].trim())) {
        const cleanLine = lines[i].replace(/^[\-\•]\s/, '').trim();
        items.push(renderLine(cleanLine));
        i++;
      }
      elements.push(
        <ul key={`list-${i}`} className="formatted-list">
          {items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      );
      continue;
    }

    if (isTitle) {
      elements.push(
        <h4 key={`title-${i}`} className="formatted-title">
          {renderLine(line.trim())}
        </h4>
      );
      i++;
      continue;
    }

    // Párrafo normal
    if (line.trim()) {
      elements.push(
        <p key={`p-${i}`} className="formatted-paragraph">
          {renderLine(line.trim())}
        </p>
      );
    }
    i++;
  }

  return <div className="formatted-text">{elements}</div>;
};

// Función para renderizar una línea con negritas
const renderLine = (line) => {
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={idx}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
};

export default FormattedText;