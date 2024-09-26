import React from 'react';

interface JsonViewerProps {
  data: unknown;
  space?: number;
}

export function JsonViewer({ data, space = 2 }: JsonViewerProps) {
  return (
    <pre
      style={{
        backgroundColor: '#030303',
        padding: '10px',
        borderRadius: '5px',
        overflow: 'auto',
        maxHeight: '400px',
        fontSize: '14px',
      }}
    >
      {JSON.stringify(data, null, space)}
    </pre>
  );
}
