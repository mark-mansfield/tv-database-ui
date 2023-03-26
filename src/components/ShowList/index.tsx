import { IShow } from '../../types';
import { LazyLoadImage } from 'react-lazy-load-image-component';
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
        console.log(show);
        return (
          <button
            aria-label={`show ${show.name} selected click to read more`}
            key={show.id}
            tabIndex={0}
            className="show-preview"
            onClick={() => onSelectShow(show)}>
            <div className={!show?.image?.medium ? 'no-image-bg' : ''}>
              <LazyLoadImage effect="opacity"  key={show.id} src={ show?.image?.medium ||
                  'https://raw.githubusercontent.com/jellyfin/jellyfin-ux/master/plugins/SVG/jellyfin-plugin-tvmaze.svg?sanitize=true'} tabIndex={-1} width="100%"/>
              {/* <img
                className="image fade-in"
                src={
                  show?.image?.medium ||
                  'https://raw.githubusercontent.com/jellyfin/jellyfin-ux/master/plugins/SVG/jellyfin-plugin-tvmaze.svg?sanitize=true'
                }
                alt=""
                key={show.id}
                tabIndex={-1}

              /> */}
              <div className="overlay lowercase">
                <ul>
                  <li className="overlay-name">{show.name}</li>
                  {show.genres.length > 0 ? (
                    <li>
                      {show.genres.map((item: string, idx: number) => (
                        <span className="overlay-genre">{`${item}${
                          show.genres.length > 1 && idx < show.genres.length - 1 ? ', ' : ''
                        }`}</span>
                      ))}
                    </li>
                  ) : null}
                  <li className="overlay-language">{show.language}</li>
                </ul>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
