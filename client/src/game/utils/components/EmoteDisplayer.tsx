import { Html } from '@react-three/drei';

import OurFade from '../../../components/OurFade';
import Emotes from '../../../constants/Emotes';

interface EmoteDisplayerProps {
  emote: string;
  displaying?: boolean;
  position?: [number, number, number];
  size?: number;
}

const EmoteDisplayer = ({ emote, displaying = true, position = undefined, size = 75 }: EmoteDisplayerProps) => {
  const imgSrc = Emotes[emote] || null;
  return (
    <Html position={position}>
      {imgSrc && (
        <div style={{ userSelect: 'none', zIndex: 2000 }}>
          <OurFade show={displaying}>
            <div style={{ height: `${size}px`, width: `${size}px` }}>
              <img src={imgSrc} alt={emote} style={{ maxWidth: '100%' }} />
            </div>
          </OurFade>
        </div>
      )}
    </Html>
  );
};

export default EmoteDisplayer;
