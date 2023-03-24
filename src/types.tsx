export interface IShow {
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

export interface ICastMember {
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

export interface FormValues {
  search: string;
}
