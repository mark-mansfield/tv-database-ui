import { IShow } from '../../types';
import './style.scss';
export function ShowList({
  shows,
  onSelectShow,
}: {
  shows: Array<IShow>;
  onSelectShow: (show: IShow) => void;
}): JSX.Element {
  return (
    <div className="show-list">
      {shows.map((show) => {
        console.log(show)
        return (
          <button
            aria-label={`show ${show.name} selected click to read more`}
            key={show.id}
            tabIndex={0}
            className="show-preview"
            onClick={() => onSelectShow(show)}>

              {show.image ? (
                <img className="image" src={show?.image.medium} alt="" key={show.id} tabIndex={-1} width="100%" />
              ) : (
                <div className="no-image">
                  <p className="show-name" tabIndex={-1}>
                    {show.name}
                  </p>
                </div>
                // <span tabIndex={-1}>{show.name}</span>
              )}
              <div className="overlay">
                <ul>
                  <li>show</li>
                  <li>genre</li>
                </ul>
              </div>
            
          </button>
        );
      })}
    </div>
  );
}
