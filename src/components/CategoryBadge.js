import React from 'react';
import { CAT_COLORS } from '../constants';

export default function CategoryBadge({ category }) {
  const color = CAT_COLORS[category] || '#1A1208';
  return (
    <span style={{
      fontSize: 9,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      color,
      fontFamily: 'Geist Mono',
      borderBottom: `1px solid ${color}`,
      paddingBottom: 1,
    }}>
      {category}
    </span>
  );
}