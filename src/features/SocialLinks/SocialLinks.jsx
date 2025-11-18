import PropTypes from 'prop-types';
import './SocialLinks.css';

import twitchIcon from './icons/icon-twitch.svg';
import youtubeIcon from './icons/icon-youtube.svg';
import emailIcon from './icons/icon-email.svg';
import tiktokIcon from './icons/icon-tiktok.svg';
import instagramIcon from './icons/icon-instagram.svg';

const iconMap = {
  twitch: twitchIcon,
  youtube: youtubeIcon,
  email: emailIcon,
  tiktok: tiktokIcon,
  instagram: instagramIcon,
};

const getTarget = (url) => (url.startsWith('mailto:') ? undefined : '_blank');
const getRel = (url) => (url.startsWith('mailto:') ? undefined : 'noreferrer');

const SocialLinks = ({ data }) => {
  const { eyebrow, title, description, channels = [], footnote } = data || {};
  const twitchChannels = channels.filter((channel) => channel.type === 'twitch');
  const communityChannels = channels.filter((channel) => channel.type !== 'twitch');

  const renderChannelCard = (channel) => {
    const { id, label, handle, description: channelDescription, url, type } = channel;
    const iconSrc = iconMap[type] || iconMap.email;
    const actionText = type === 'twitch' ? 'Смотреть' : 'Открыть';

    return (
      <a
        key={id}
        className={`social-links__card social-links__card--${type}`}
        href={url}
        target={getTarget(url)}
        rel={getRel(url)}
        aria-label={`${label} — ${handle}`}
      >
        <span className="social-links__card-icon" aria-hidden="true">
          <img src={iconSrc} alt="" loading="lazy" />
        </span>
        <span className="social-links__card-body">
          <span className="social-links__card-label">{label}</span>
          <span className="social-links__card-handle">{handle}</span>
          {channelDescription ? (
            <span className="social-links__card-description">{channelDescription}</span>
          ) : null}
        </span>
        <span className="social-links__card-action" aria-hidden="true">
          {actionText}
        </span>
      </a>
    );
  };

  return (
    <section className="social-links" aria-label="Социальные каналы YarCyberSeason">
      <div className="social-links__intro">
        {eyebrow ? <p className="social-links__eyebrow">{eyebrow}</p> : null}
        {title ? <h3 className="social-links__title">{title}</h3> : null}
        {description ? <p className="social-links__description">{description}</p> : null}
      </div>
      <div className="social-links__panels">
        {twitchChannels.length ? (
          <div className="social-links__panel social-links__panel--streams">
            <div className="social-links__panel-head">
              <p className="social-links__panel-eyebrow">Прямые эфиры</p>
              <h4 className="social-links__panel-title">Трансляции и аналитика</h4>
              <p className="social-links__panel-description">
                Три Twitch-канала для основного эфира, аналитики и тренировок.
              </p>
            </div>
            <div className="social-links__list social-links__list--streams">
              {twitchChannels.map(renderChannelCard)}
            </div>
          </div>
        ) : null}
        {communityChannels.length ? (
          <div className="social-links__panel social-links__panel--community">
            <div className="social-links__panel-head">
              <p className="social-links__panel-eyebrow">Комьюнити</p>
              <h4 className="social-links__panel-title">Соцсети и связь</h4>
              <p className="social-links__panel-description">
                Контент для TikTok и Instagram, YouTube-хайлайты и почта для партнёров.
              </p>
            </div>
            <div className="social-links__list social-links__list--community">
              {communityChannels.map(renderChannelCard)}
            </div>
          </div>
        ) : null}
      </div>
      {footnote ? <p className="social-links__footnote">{footnote}</p> : null}
    </section>
  );
};

SocialLinks.propTypes = {
  data: PropTypes.shape({
    eyebrow: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string,
    footnote: PropTypes.string,
    channels: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
        handle: PropTypes.string,
        description: PropTypes.string,
        url: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['twitch', 'youtube', 'email', 'tiktok', 'instagram']).isRequired,
      })
    ),
  }).isRequired,
};

export default SocialLinks;
