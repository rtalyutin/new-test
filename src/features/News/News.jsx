import PropTypes from 'prop-types';
import './News.css';

const News = ({ data }) => (
  <div className="news">
    <h3 className="news__headline">{data.headline}</h3>
    <ul className="news__list">
      {data.articles.map((article) => (
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

News.propTypes = {
  data: PropTypes.shape({
    headline: PropTypes.string.isRequired,
    articles: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        title: PropTypes.string.isRequired,
        summary: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      }),
    ).isRequired,
  }).isRequired,
};

export default News;
