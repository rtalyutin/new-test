import { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

const SOCIAL_ICON_MAP = {
  discord: (
    <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
      <path d="M20.317 4.369A18.707 18.707 0 0 0 16.552 3a13.172 13.172 0 0 0-.651 1.343 18.523 18.523 0 0 0-5.812 0A13.172 13.172 0 0 0 9.438 3a18.632 18.632 0 0 0-3.772 1.38C2.685 9.087 1.993 13.64 2.318 18.125a18.841 18.841 0 0 0 4.56 2.366c.37-.5.704-1.027.997-1.577a12.509 12.509 0 0 1-1.57-.75c.132-.1.26-.205.384-.313 3.034 1.415 6.4 1.415 9.41 0 .125.108.253.213.384.313-.5.25-1.018.477-1.57.75.293.55.627 1.077.997 1.577a18.646 18.646 0 0 0 4.562-2.366c.374-5.079-.639-9.589-2.153-13.756ZM9.497 15.346c-.919 0-1.673-.839-1.673-1.871s.733-1.878 1.673-1.878S11.17 12.43 11.17 13.462s-.748 1.884-1.673 1.884Zm5.01 0c-.92 0-1.673-.84-1.673-1.871s.732-1.878 1.673-1.878 1.673.826 1.673 1.858-.748 1.891-1.673 1.891Z" />
    </svg>
  ),
  telegram: (
    <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
      <path d="M21.447 4.104a1.248 1.248 0 0 0-1.306-.184L3.14 11.47c-.543.236-.889.728-.84 1.207.05.48.474.876 1.058 1.003l4.351.953 1.664 5.442c.156.509.585.861 1.073.877h.035c.47 0 .884-.313 1.073-.8l1.989-5.081 4.68 3.796c.226.183.497.279.772.279.16 0 .32-.029.474-.091.4-.161.684-.516.755-.95l1.838-11.07c.09-.547-.152-1.068-.61-1.331Z" />
    </svg>
  ),
  vk: (
    <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
      <path d="M20.082 6.844c.125-.415 0-.719-.595-.719h-1.962c-.5 0-.73.251-.855.529 0 0-1.001 2.417-2.417 3.981-.457.457-.665.604-.914.604-.125 0-.313-.147-.313-.562V6.844c0-.5-.148-.719-.562-.719H8.686c-.313 0-.5.234-.5.452 0 .47.719.579.794 1.904v2.876c0 .626-.109.74-.344.74-.665 0-2.28-2.425-3.241-5.193-.188-.532-.375-.75-.875-.75H1.559c-.562 0-.687.266-.687.53 0 .5.665 2.982 3.102 6.258 1.607 2.194 3.868 3.385 5.93 3.385 1.235 0 1.391-.282 1.391-.751V15.05c0-.563.125-.656.47-.656.266 0 .718.148 1.78 1.22 1.22 1.22 1.422 1.772 2.109 1.772h1.963c.562 0 .844-.282.687-.844-.187-.562-.859-1.376-1.75-2.343-.485-.546-1.211-1.14-1.434-1.434-.312-.406-.219-.594 0-.969-.001.001 2.531-3.563 2.798-4.787Z" />
    </svg>
  ),
  youtube: (
    <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
      <path d="M21.582 7.203a2.467 2.467 0 0 0-1.73-1.753C18.28 5 12 5 12 5s-6.28 0-7.852.45a2.467 2.467 0 0 0-1.73 1.753A25.776 25.776 0 0 0 2 11.998a25.776 25.776 0 0 0 .418 4.795 2.467 2.467 0 0 0 1.73 1.753C5.72 18.45 12 18.45 12 18.45s6.28 0 7.852-.45a2.467 2.467 0 0 0 1.73-1.753A25.776 25.776 0 0 0 22 11.998a25.776 25.776 0 0 0-.418-4.795Zm-12.54 7.72V8.07l6.505 3.426-6.505 3.426Z" />
    </svg>
  ),
};

const Community = ({ data }) => {
  const { headline, description, posts = [], channels = [], cta, displayCount = 3, refreshInterval = 20000 } = data;
  const effectiveCount = Math.max(1, Math.min(displayCount, posts.length || 1));

  const initialPosts = useMemo(() => posts.slice(0, effectiveCount), [posts, effectiveCount]);
  const [displayedPosts, setDisplayedPosts] = useState(initialPosts);

  useEffect(() => {
    setDisplayedPosts(posts.slice(0, effectiveCount));
  }, [posts, effectiveCount]);

  useEffect(() => {
    if (posts.length <= effectiveCount) {
      return undefined;
    }

    let offset = effectiveCount;
    const intervalId = setInterval(() => {
      setDisplayedPosts((prevPosts) => {
        if (!posts.length) {
          return prevPosts;
        }

        const nextPost = posts[offset % posts.length];
        offset += 1;
        return [...prevPosts.slice(1), nextPost];
      });
    }, refreshInterval);

    return () => clearInterval(intervalId);
  }, [posts, effectiveCount, refreshInterval]);

  return (
    <div className="community">
      <div className="community__intro">
        <div>
          <p className="community__eyebrow">Соцсети и комьюнити</p>
          <h3 className="community__headline">{headline}</h3>
          <p className="community__description">{description}</p>
        </div>
        {cta ? (
          <a
            className="community__cta"
            href={cta.href}
            target="_blank"
            rel="noreferrer"
            aria-label={cta.ariaLabel || cta.label}
          >
            {cta.label}
          </a>
        ) : null}
      </div>

      <div className="community__layout">
        <section className="community__wall" aria-label="Лента постов сообщества">
          <ul className="community__post-list" aria-live="polite">
            {displayedPosts.map((post) => (
              <li key={post.id} className="community__post-item">
                <article className="community__post-card">
                  <header className="community__post-header">
                    <span className={`community__avatar community__avatar--${post.platform}`}>
                      {SOCIAL_ICON_MAP[post.platform] || null}
                    </span>
                    <div className="community__post-meta">
                      <span className="community__post-author">{post.author}</span>
                      <span className="community__post-handle">{post.handle}</span>
                    </div>
                    <time className="community__post-time">
                      {post.timestamp}
                    </time>
                  </header>
                  <p className="community__post-content">{post.content}</p>
                  <a
                    className="community__post-link"
                    href={post.link}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Открыть пост ${post.author}`}
                  >
                    Читать пост
                  </a>
                </article>
              </li>
            ))}
          </ul>
        </section>

        <aside className="community__channels" aria-label="Официальные каналы YarCyberSeason">
          <h4 className="community__channels-title">Официальные каналы</h4>
          <ul className="community__channel-list">
            {channels.map((channel) => (
              <li key={channel.id} className="community__channel-item">
                <a
                  className="community__channel-link"
                  href={channel.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Открыть ${channel.name}`}
                >
                  <span className={`community__channel-icon community__channel-icon--${channel.platform}`}>
                    {SOCIAL_ICON_MAP[channel.platform] || null}
                  </span>
                  <span className="community__channel-info">
                    <span className="community__channel-name">{channel.name}</span>
                    <span className="community__channel-description">{channel.description}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
};

Community.propTypes = {
  data: PropTypes.shape({
    headline: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    posts: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        platform: PropTypes.string.isRequired,
        author: PropTypes.string.isRequired,
        handle: PropTypes.string.isRequired,
        timestamp: PropTypes.string.isRequired,
        content: PropTypes.string.isRequired,
        link: PropTypes.string.isRequired,
      }),
    ),
    channels: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        platform: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        href: PropTypes.string.isRequired,
      }),
    ),
    cta: PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
      ariaLabel: PropTypes.string,
    }),
    displayCount: PropTypes.number,
    refreshInterval: PropTypes.number,
  }).isRequired,
};

export default Community;
