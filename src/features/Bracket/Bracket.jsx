import PropTypes from 'prop-types';

const Bracket = ({ data }) => (
  <div className="bracket">
    <div className="bracket__rounds">
      {data.rounds.map((round) => (
        <div key={round.id} className="bracket__round">
          <h3 className="bracket__round-title">{round.title}</h3>
          <ul className="bracket__matches">
            {round.matches.map((match) => (
              <li key={match.id} className="bracket__match">
                <span className="bracket__team bracket__team--home">{match.home}</span>
                <span className="bracket__score">{match.score}</span>
                <span className="bracket__team bracket__team--away">{match.away}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="bracket__note">{data.note}</div>
  </div>
);

Bracket.propTypes = {
  data: PropTypes.shape({
    rounds: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
        title: PropTypes.string.isRequired,
        matches: PropTypes.arrayOf(
          PropTypes.shape({
            id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
            home: PropTypes.string.isRequired,
            away: PropTypes.string.isRequired,
            score: PropTypes.string.isRequired,
          }),
        ).isRequired,
      }),
    ).isRequired,
    note: PropTypes.string.isRequired,
  }).isRequired,
};

export default Bracket;
