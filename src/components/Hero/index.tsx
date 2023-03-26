import './style.scss';
import { LazyLoadImage } from 'react-lazy-load-image-component';
export function Hero({ imgUrl }: { imgUrl: string }): JSX.Element {
  return (
    <div
      className="hero"
      style={{
        width: '100vw',
        height: '40rem',
        overflow: 'hidden',
      }}>
      <div className="overlay" />
      {imgUrl ? (
        <LazyLoadImage
          src={imgUrl}
          style={{ objectFit: 'cover' }}
          width={'100%'}
          alt="Image Alt"
          effect="opacity"
          placeholder={<div style={{ width: '100%', height: '100%', backgroundColor: 'none' }}></div>}
        />
      ) : null}
    </div>
  );
}
