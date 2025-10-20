import config from './config.json';

const News = () => (
  <div className="news">
    <h3 className="news__headline">{config.headline}</h3>
    <ul className="news__list">
      {config.articles.map((article) => (
        <li key={article.id} className="news__item">
          <article>
            <h4 className="news__title">{article.title}</h4>
            <p className="news__summary">{article.summary}</p>
            <a className="news__link" href={article.url} target="_blank" rel="noreferrer">
              Read more
            </a>
          </article>
        </li>
      ))}
    </ul>
  </div>
);

export default News;
