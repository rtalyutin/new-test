import PropTypes from 'prop-types';
import './News.css';

const formatDate = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

const News = ({ data }) => (
  <div className="news">
    <h3 className="news__headline">{data.headline}</h3>
    <ul className="news__list">
      {data.articles.map((article) => {
        const formattedDate = formatDate(article.publishedAt);

        return (
          <li key={article.id} className="news__item">
            <article className="news__card">
              {article.image && (
                <a
                  className="news__media"
                  href={article.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Открыть материал «${article.title}»`}
                >
                  <img src={article.image} alt={article.title} loading="lazy" />
                </a>
              )}
              <div className="news__content">
                <div className="news__meta">
                  {article.source && <span className="news__source">{article.source}</span>}
                  {formattedDate && (
                    <time className="news__date" dateTime={article.publishedAt}>
                      {formattedDate}
                    </time>
                  )}
                </div>
                <h4 className="news__title">{article.title}</h4>
                <p className="news__summary">{article.summary}</p>
                <a className="news__link" href={article.url} target="_blank" rel="noreferrer">
                  Читать материал
                </a>
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  </div>
);

News.propTypes = {
  data: PropTypes.shape({
    headline: PropTypes.string.isRequired,
    articles: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        title: PropTypes.string.isRequired,
        summary: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
        source: PropTypes.string,
        publishedAt: PropTypes.string,
        image: PropTypes.string,
      }),
    ).isRequired,
  }).isRequired,
};

export default News;
