import { CastMember } from '../';
import { IShow, ICastMember } from '../../types';
import { Summary } from './Summary';
import '../../style.scss'
export function Show({ show, onCancel }: { show: IShow; onCancel: () => void }): JSX.Element {
  const cast = show._embedded.cast;
  const showCast = cast.length > 0;
  const premierText = show.premiered ? 'Premiered ' + show.premiered : 'Yet to premiere';
  const showImage = show?.image?.original;
  return (
    <>
      <button className="show-back" onClick={onCancel}>
        Back to list
      </button>
      <div className="show">
        {showImage ? (
          <div className="show-image">
            <img src={show.image.original} alt="" />
          </div>
        ) : null}
        <div className="show-details">
          <h2>{show.name}</h2>
          <div className="show-meta">{premierText}</div>
          <Summary summary={show.summary} />
          {showCast ? (
            <>
              <h3>Cast</h3>
              <ul className={`cast ${!showImage || cast.length > 5 ? 'two__column' : ''}`}>
                {cast.map((member: ICastMember) => (
                  <li key={member.character.name}>
                    <CastMember member={member} />
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
