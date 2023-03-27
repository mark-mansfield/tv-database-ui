import { CastMember } from '../';
import { IShow, ICastMember } from '../../types';
import { Summary } from './Summary';
import './style.scss';
export function Show({ show, onCancel }: { show: IShow; onCancel: () => void }): JSX.Element {
  const cast = show._embedded.cast;
  const showCast = cast.length > 0;
  const premierText = show.premiered ? 'Premiered ' + show.premiered : 'Yet to premiere';
  const showImage = show?.image?.original;
  return (
    <>
      <div className="show">
        <button className="show-back" aria-label="Back to list" tabIndex={0} onClick={onCancel}>
          Back to list
        </button>
        <div className="show__detail-wrapper">
          {showImage ? (
            <div className="show-image" aria-label="show image">
              <img src={show.image.original} alt={`${show.name}`} />
            </div>
          ) : null}
          <div className="show-text">
            <h2 aria-label={`${show.name}`}tabIndex={0} >{show.name}</h2>
            <p aria-label={premierText} tabIndex={0}>{premierText}</p>
            <Summary summary={show.summary} />
          </div>
        </div>
      </div>
      {showCast ? (
        <div className="cast">
          <div className="cast-wrapper">
            <h3>Cast</h3>
            <ul className={`${!showImage || cast.length > 5 ? 'two-column' : ''}`}>
              {cast.map((member: ICastMember) => (
                <li key={member.character.name}>
                  <CastMember member={member} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </>
  );
}
