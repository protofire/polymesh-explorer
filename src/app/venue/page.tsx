'use client';

import { useState } from 'react';
import { useListVenues } from '@/hooks/venue/useListVenues';

const PAGE_SIZE = 10;

export default function VenuePage() {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const { data, isLoading, error } = useListVenues({ pageSize: PAGE_SIZE, cursor });

  if (isLoading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No hay datos disponibles</div>;

  return (
    <div>
      <h1>Lista de Venues</h1>
      <ul>
        {data.venues.map((venue) => (
          <li key={venue.id}>{venue.name}</li>
        ))}
      </ul>
      {data.hasNextPage && (
        <button onClick={() => setCursor(data.endCursor)}>Cargar más</button>
      )}
    </div>
  );
}