import PropTypes from 'prop-types';
import { getTeamLogo } from '../../utils/teamLogos';
import styles from './UpcomingMatches.module.css';

const UpcomingMatches = ({ data }) => {
  const { title, tags, matches, channelPresets } = data;

  const resolveChannels = (channelIds) =>
    channelIds
      .map((channelId) => channelPresets[channelId])
      .filter(Boolean);

  return (
    <section className={styles.upcoming} aria-labelledby="upcoming-matches-title">
      <header className={styles.header}>
        <h3 id="upcoming-matches-title" className={styles.title}>
          {title}
        </h3>
        <div className={styles.tags} aria-label="теги турнира">
          {tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              #{tag}
            </span>
          ))}
        </div>
      </header>
      <ol className={styles.scheduleList}>
        {matches.map((match) => {
          const channels = resolveChannels(match.channelIds);

          return (
            <li key={match.id} className={styles.matchItem}>
              <div className={styles.meta}>
                <span className={styles.dayLabel}>{match.dayLabel}</span>
                <time className={styles.timeLabel} dateTime={match.dateTime}>
                  {match.timeLabel}
                </time>
              </div>
              <div className={styles.teams}>
                {['home', 'away'].map((side) => {
                  const teamName = match.teams[side];
                  const teamLogo = getTeamLogo(teamName);

                  return (
                    <span key={side} className={styles.team}>
                      {teamLogo ? (
                        <img
                          src={teamLogo}
                          alt={`Логотип команды ${teamName}`}
                          className={styles.teamLogo}
                          loading="lazy"
                          width={28}
                          height={28}
                        />
                      ) : null}
                      <span className={styles.teamName}>{teamName}</span>
                      {side === 'home' ? (
                        <span className={styles.separator} aria-hidden="true">
                          —
                        </span>
                      ) : null}
                    </span>
                  );
                })}
              </div>
              <div className={styles.channels}>
                {channels.map((channel) => (
                  <a
                    key={channel.id}
                    className={styles.channelLink}
                    href={channel.url}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <span className={styles.channelBadge}>{channel.label}</span>
                    <span>Смотреть</span>
                  </a>
                ))}
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
};

UpcomingMatches.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    tags: PropTypes.arrayOf(PropTypes.string).isRequired,
    channelPresets: PropTypes.objectOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        url: PropTypes.string.isRequired,
      }),
    ).isRequired,
    matches: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        dayLabel: PropTypes.string.isRequired,
        timeLabel: PropTypes.string.isRequired,
        dateTime: PropTypes.string.isRequired,
        teams: PropTypes.shape({
          home: PropTypes.string.isRequired,
          away: PropTypes.string.isRequired,
        }).isRequired,
        channelIds: PropTypes.arrayOf(PropTypes.string).isRequired,
      }),
    ).isRequired,
  }).isRequired,
};

export default UpcomingMatches;
