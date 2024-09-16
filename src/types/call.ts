import { GeoPoint } from 'firebase/firestore';

interface CallTranscript {
  role: 'assistant' | 'user';
  content: string;
}

interface Emotion {
  emotion: string;
  intensity: number;
}

interface LocationCoords {
  lat: number;
  lng: number;
}

interface LocationCoords {
  lat: number;
  lng: number;
}

type GeoPointInput = LocationCoords | GeoPoint;

export interface Call {
  id: string;
  time: string;
  transcript: CallTranscript[];
  emotions: Emotion[];
  phone: string;
  recommendation: string;
  severity: 'BAIXO' | 'MODERADO' | 'ALTO';
  type: string;
  name: string;
  title: string;
  street_view: string;
  summary: string;
  location_name: string;
  location_coords: GeoPoint;
}
