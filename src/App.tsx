import React, { useState, ReactChild, useRef, useEffect } from 'react';
import './App.css';
import { Hero, Search, Meta, CastMember } from './components';
import { IShow, FormValues, ICastMember } from './types';
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';

export default function App(): JSX.Element {
  const [heroImage, setHeroImage] = useState<string>(
    'https://raw.githubusercontent.com/jellyfin/jellyfin-ux/master/plugins/SVG/jellyfin-plugin-tvmaze.svg'
  );
  const [query, setQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [shows, setShows] = useState<Array<IShow>>([]);
  const [show, setShow] = useState<IShow | null>(null);
  const queryRef = useRef<string>('');
  const usedQuery = queryRef.current;

  function onQueryChange(nextQuery: string): void {
    setHasSearched(false);
    setQuery(nextQuery);
    setShows([]);
    setShow(null);
    setError('');
  }

  function handleSubmit(values: FormValues): void {
    queryRef.current = values.search;
    setHasSearched(false);
    setIsLoading(true);
    setShows([]);
    setShow(null);
    setError('');

    fetch(`https://api.tvmaze.com/search/shows?q=${values.search}`)
      .then((r: Response) => r.json())
      .then((json: Array<{ show: IShow }>) => {
        let foundImg = false;

        let i = 0;
        while (foundImg == false) {
          const imgPath = json[i].show.image.original;
          if (imgPath) {
            setHeroImage(imgPath);
            foundImg = true;
          }
          i++;
        }

        setHasSearched(true);
        setIsLoading(false);
        setShows(
          json.map((r, idx) => {
            if (idx) {
            }
            return r.show;
          })
        );
      })
      .catch((e) => {
        setIsLoading(false);
        setError('Could not load shows.', e);
      });
  }

  function onSelectShow(show: IShow): void {
    setIsLoading(true);
    setError('');

    fetch(`https://api.tvmaze.com/shows/${show.id}?embed=cast`)
      .then((r: Response) => r.json())
      .then((json: IShow) => {
        setIsLoading(false);
        console.log(json);
        setShow(json);
        if (json?.image?.original) {
          setHeroImage(json.image.original);
        }
      })
      .catch((e) => {
        setIsLoading(false);
        console.log(e);
        setError('Could not load show details.');
      });
  }

  return (
    <>
      <Hero imgUrl={heroImage} />
      <div className="app">
        <header className="header">
          <h1>TV Database</h1>
        </header>
        <Search handleSubmit={handleSubmit} />
        {error && <div>{error}</div>}
        <Loading isLoading={isLoading}>
          {show ? (
            <Show show={show} onCancel={() => setShow(null)} />
          ) : (
            <>
              {hasSearched && usedQuery && <Meta length={shows.length} query={usedQuery} />}
              <ShowList shows={shows} onSelectShow={onSelectShow} />
            </>
          )}
        </Loading>
      </div>
    </>
  );
}

function Loading({ isLoading, children }: { isLoading: boolean; children: ReactChild }): JSX.Element {
  return isLoading ? <div>Loading...</div> : <>{children}</>;
}

function ShowList({ shows, onSelectShow }: { shows: Array<IShow>; onSelectShow: (show: IShow) => void }): JSX.Element {
  return (
    <div className="show-list">
      {shows.map((show) => {
        return (
          <button
            aria-label={`show ${show.name} selected click to read more`}
            key={show.id}
            tabIndex={0}
            className="show-preview"
            onClick={() => onSelectShow(show)}>
            {show.image ? (
              <div className="">
                <img src={show?.image.medium} alt="" key={show.id} tabIndex={-1} width="100%" />
                <span tabIndex={-1}>{show.name}</span>
              </div>
            ) : (
              <div className="">
                <p className="show-name" tabIndex={-1}>
                  {show.name}
                </p>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}

function Show({ show, onCancel }: { show: IShow; onCancel: () => void }): JSX.Element {
  const MAX_TEXT = 360;
  const [usedSummary, setUsedSummary] = useState('');
  const [showFullSummary, setShowFullSummary] = useState(true);
  const [hasLargeSummary, setHasLargeSummary] = useState(false);
  const [summary, setSummary] = useState('');

  function toggleShowMore() {
    setShowFullSummary(!showFullSummary);
    console.log('showing more', !showFullSummary);
  }

  useEffect(() => {
    if (!showFullSummary) {
      setUsedSummary(show.summary.substring(0, MAX_TEXT));
    }
    if (showFullSummary) {
      setUsedSummary(show.summary);
    }
  }, [showFullSummary]);

  //  because we need to set a default view of the summary
  useEffect(() => {
    if (!show.summary) return;

    //  init a flag
    const hasLargeSummary = show.summary.length > MAX_TEXT ? true : false;
    setHasLargeSummary(hasLargeSummary);

    // store the summary
    setSummary(show.summary);

    // set displayed summary to full or partial
    if (hasLargeSummary) {
      setUsedSummary(show.summary.substring(0, MAX_TEXT));
      setShowFullSummary(false);
    }

    if (!hasLargeSummary) {
      setUsedSummary(show.summary);
    }
  }, [show.summary]);

  const cast = show._embedded.cast;
  const showCast = cast.length > 0;
  const premierText = show.premiered ? 'Premiered ' + show.premiered : 'Yet to premiere';
  const sanitzedData = parse(DOMPurify.sanitize(usedSummary));
  return (
    <>
      <div className="show-back">
        <button onClick={onCancel}>Back to list</button>
      </div>
      <div className="show">
        <div className="show-image">{show.image && <img src={show.image.original} alt="" />}</div>
        <div className="show-details">
          <h2>{show.name}</h2>
          <div className="show-meta">{premierText}</div>
          <div>
            {sanitzedData}
            {hasLargeSummary ? (
              <>
                <a onClick={toggleShowMore} aria-label="show full summary" tabIndex={0}>
                  {showFullSummary ? 'less' : 'more'}
                </a>
              </>
            ) : null}
          </div>
          {showCast ? (
            <>
              <h3>Cast</h3>
              <ul className="cast">
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
