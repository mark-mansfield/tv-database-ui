import React, { useState, ReactChild, useRef, useEffect } from 'react';
import './App.css';
import { Hero, Search, Meta, Show, Loader, ShowList } from './components';
import { IShow, FormValues } from './types';

export const DEFAULT_HERO_IMAGE =
  'https://images.ladbible.com/resize?type=webp&quality=70&width=720&fit=contain&gravity=null&dpr=2&url=https://eu-images.contentstack.com/v3/assets/bltcd74acc1d0a99f3a/blt463df292361e2de7/62c60c00383b79158e7ae49d/Untitled_design_-_2022-07-06T232454.969.png';

export default function App(): JSX.Element {
  const [heroImage, setHeroImage] = useState<string>(DEFAULT_HERO_IMAGE);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [_, setHasSearched] = useState<boolean>(false);
  const [shows, setShows] = useState<Array<IShow>>([]);
  const [show, setShow] = useState<IShow | null>(null);
  const queryRef = useRef<string>('');
  const usedQuery = queryRef.current;

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
      .catch(() => {
        setIsLoading(false);
        setError('Could not load shows.');
      });
  }

  function onSelectShow(show: IShow): void {
    setIsLoading(true);
    setError('');
    fetch(`https://api.tvmaze.com/shows/${show.id}?embed=cast`)
      .then((r: Response) => r.json())
      .then((json: IShow) => {
        setIsLoading(false);
        setShow(json);
        if (json?.image?.original) {
          setHeroImage(json.image.original);
        } else {
          setHeroImage(DEFAULT_HERO_IMAGE);
        }
      })
      .catch((e) => {
        setIsLoading(false);
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
        {error && (
          <div aria-label="error" tabIndex={0}>
            {error}
          </div>
        )}
        {isLoading ? <Loader /> : null}
        {show ? <Show show={show} onCancel={() => setShow(null)} /> : null}
        {!show && !isLoading ? (
          <>
            {usedQuery ? <Meta length={shows.length} query={usedQuery} /> : null}
            <ShowList shows={shows} onSelectShow={onSelectShow} />
          </>
        ) : null}
      </div>
    </>
  );
}
