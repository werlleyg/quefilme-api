type MovieEntityType = {
  title: string;
  imdbID: string;
  type: string;
  image: string;
  runtime?: string;
  genre?: string;
  actors?: string;
  description?: string;
};

export class MovieEntity {
  constructor(public props: MovieEntityType) {}

  get title(): string {
    return this.props.title;
  }

  get imdbID(): string {
    return this.props.imdbID;
  }

  get type(): string {
    return this.props.type;
  }

  get image(): string {
    return this.props.image;
  }

  get runtime(): string | undefined {
    return this.props.runtime;
  }

  get genre(): string | undefined {
    return this.props.genre;
  }

  get actors(): string | undefined {
    return this.props.actors;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get toJSON(): MovieEntityType {
    return {
      image: this.props.image,
      imdbID: this.props.imdbID,
      title: this.props.title,
      type: this.props.type,
      actors: this.props.actors,
      description: this.props.description,
      genre: this.props.genre,
      runtime: this.props.runtime,
    };
  }

  static fromJson(data: any): MovieEntity {
    return new MovieEntity({
      image: data?.Poster,
      imdbID: data?.imdbID,
      title: data?.Title,
      type: data?.Type,
      actors: data?.Actors,
      description: data?.Plot,
      genre: data?.Genre,
      runtime: data?.Year,
    });
  }
}
