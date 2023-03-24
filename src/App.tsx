import React from "react";
import "./App.css";

interface IShow {
  id: string;
  name: string;
  summary: string;
  image: {
    original: string;
    medium: string;
  };
  premiered: string;
  _embedded: {
    cast: Array<ICastMember>;
  };
}

interface ICastMember {
  person: {
    name: string;
    image: {
      medium: string;
    };
  };
  character: {
    name: string;
  };
}

export default function App(): JSX.Element {
  const [query, setQuery] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const [hasSearched, setHasSearched] = React.useState<boolean>(false);
  const [shows, setShows] = React.useState<Array<IShow>>([]);
  const [show, setShow] = React.useState<IShow | null>(null);

  function onQueryChange(nextQuery: string): void {
    setHasSearched(false);
    setQuery(nextQuery);
    setShows([]);
    setShow(null);
    setError("");
  }

  function onSearch(): void {
    setHasSearched(false);
    setIsLoading(true);
    setShows([]);
    setShow(null);
    setError("");

    fetch(`https://api.tvmaze.com/search/shows?q=${query}`)
      .then((r: Response) => r.json())
      .then((json: Array<{ show: IShow }>) => {
        setHasSearched(true);
        setIsLoading(false);
        setShows(json.map((r) => r.show));
      })
      .catch(() => {
        setIsLoading(false);
        setError("Could not load shows.");
      });
  }

  function onSelectShow(show: IShow): void {
    setIsLoading(true);
    setError("");

    fetch(`https://api.tvmaze.com/shows/${show.id}?embed=cast`)
      .then((r: Response) => r.json())
      .then((json: IShow) => {
        setIsLoading(false);
        setShow(json);
      })
      .catch(() => {
        setIsLoading(false);
        setError("Could not load show details.");
      });
  }

  return (
    <div className="app">
      <h1>TV Database</h1>
      <form className="search">
        <input
          autoFocus
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Enter the name of a TV show..."
        />
        <button type="button" onClick={onSearch}>Search</button>
      </form>

      {error && <div>{error}</div>}

      <div>
        <Loading isLoading={isLoading}>
          {show ? (
            <Show show={show} onCancel={() => setShow(null)} />
          ) : (
            <>
              {hasSearched && query && (
                <div className="results-meta">
                  {shows.length} results for "{query}"
                </div>
              )}
              <ShowList shows={shows} onSelectShow={onSelectShow} />
            </>
          )}
        </Loading>
      </div>
    </div>
  );
}

function Loading({
  isLoading,
  children,
}: {
  isLoading: boolean;
  children: React.ReactChild;
}): JSX.Element {
  return isLoading ? <div>Loading...</div> : <>{children}</>;
}

function ShowList({
  shows,
  onSelectShow,
}: {
  shows: Array<IShow>;
  onSelectShow: (show: IShow) => void;
}): JSX.Element {
  return (
    <div className="show-list">
      {shows.map((show) => {
        return (
          <div
            key={show.id}
            className="show-preview"
            onClick={() => onSelectShow(show)}
          >
            {show.image && <img src={show.image.medium} alt="" />}
            <span>{show.name}</span>
          </div>
        );
      })}
    </div>
  );
}

function Show({
  show,
  onCancel,
}: {
  show: IShow;
  onCancel: () => void;
}): JSX.Element {
  const cast = show._embedded.cast;

  return (
    <>
      <div className="show-back">
        <button onClick={onCancel}>Back to list</button>
      </div>
      <div className="show">
        <div className="show-image">
          {show.image && <img src={show.image.original} alt="" />}
        </div>
        <div className="show-details">
          <h2>{show.name}</h2>
          <div className="show-meta">
            {show.premiered ? "Premiered " + show.premiered : "Yet to premiere"}
          </div>
          <div dangerouslySetInnerHTML={{ __html: show.summary }} />
          <h3>Cast</h3>
          <ul className="cast">
            {cast.map((member: ICastMember) => (
              <li key={member.character.name}>
                <CastMember member={member} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

function CastMember({ member }: { member: ICastMember }): JSX.Element {
  return (
    <div className="cast-member">
      <div className="cast-member-image">
        {member.person.image && <img src={member.person.image.medium} alt="" />}
      </div>
      <strong>{member.person.name}</strong>&nbsp;as&nbsp;
      {member.character.name}
    </div>
  );
}
