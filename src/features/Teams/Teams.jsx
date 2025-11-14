import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import './Teams.css';

const teamLogoAssets = import.meta.glob('./assets/*.{png,jpg,jpeg,gif,svg,webp,avif}', {
  eager: true,
  import: 'default',
  query: '?url',
});

const resolveTeamLogo = (logoPath) => {
  if (!logoPath) {
    return '';
  }

  if (/^https?:/i.test(logoPath)) {
    return logoPath;
  }

  const normalizedPath = logoPath.startsWith('./') ? logoPath : `./${logoPath}`;
  const localAsset = teamLogoAssets[normalizedPath];

  if (localAsset) {
    return localAsset;
  }

  try {
    return new URL(logoPath, import.meta.url).href;
  } catch (error) {
    console.warn('Не удалось обработать логотип команды', logoPath, error);
    return logoPath;
  }
};

const normalizeTeams = (teams) =>
  Array.isArray(teams)
    ? teams
        .filter((team) => team && typeof team === 'object')
        .map((team) => {
          const logo = resolveTeamLogo(team.logo);
          const logoLarge = resolveTeamLogo(team.logoLarge || team.logo);

          return {
            ...team,
            logo,
            logoLarge,
            players: Array.isArray(team.players)
            ? team.players.slice(0, 5).map((player, index) => ({
                ...player,
                name:
                  typeof player.name === 'string' && player.name.trim()
                    ? player.name.trim()
                    : `Игрок ${index + 1}`,
              }))
            : [],
          };
        })
    : [];

const getCardsPerView = () => {
  if (typeof window === 'undefined') {
    return 1;
  }

  const width = window.innerWidth;

  if (width >= 1280) {
    return 3;
  }

  if (width >= 768) {
    return 2;
  }

  return 1;
};

const chunkTeams = (teams, size) => {
  if (!size || size <= 0) {
    return teams.length ? [teams] : [];
  }

  const result = [];
  for (let index = 0; index < teams.length; index += size) {
    result.push(teams.slice(index, index + size));
  }
  return result;
};

const playerShape = PropTypes.shape({
  position: PropTypes.number.isRequired,
  hoursPlayed: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
});

const teamShape = PropTypes.shape({
  id: PropTypes.string,
  logo: PropTypes.string,
  logoLarge: PropTypes.string,
  name: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  players: PropTypes.arrayOf(playerShape).isRequired,
});

const Teams = ({ data }) => {
  const teams = useMemo(() => normalizeTeams(data?.teams), [data?.teams]);
  const [cardsPerView, setCardsPerView] = useState(() => getCardsPerView());
  const [pageIndex, setPageIndex] = useState(0);
  const [expandedPlayers, setExpandedPlayers] = useState(() => ({}));
  const carouselId = useId();

  const paginatedTeams = useMemo(() => chunkTeams(teams, cardsPerView || 1), [teams, cardsPerView]);
  const totalPages = paginatedTeams.length;

  const handlePlayerToggle = useCallback((key) => {
    setExpandedPlayers((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  }, []);

  const cardRefs = useRef([]);
  const viewportRef = useRef(null);

  if (cardRefs.current.length !== totalPages) {
    cardRefs.current = Array.from({ length: totalPages }, () => []);
  }

  useEffect(() => {
    if (typeof window === 'undefined') {
      return () => {};
    }

    const handleResize = () => {
      setCardsPerView(getCardsPerView());
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (pageIndex >= totalPages) {
      setPageIndex(0);
    }
  }, [pageIndex, totalPages]);

  useEffect(() => {
    setExpandedPlayers((prev) => {
      const next = {};
      teams.forEach((team, teamIndex) => {
        const teamKey = team.id || team.name || `team-${teamIndex}`;
        team.players.forEach((player, playerIndex) => {
          const positionKey =
            typeof player.position === 'number' && Number.isFinite(player.position)
              ? player.position
              : playerIndex + 1;
          const key = `${teamKey}-${positionKey}-${playerIndex}`;
          if (prev[key]) {
            next[key] = true;
          }
        });
      });
      return next;
    });
  }, [teams]);

  const focusActiveCard = useCallback(
    (index = pageIndex) => {
      const activePageRefs = cardRefs.current[index];
      if (activePageRefs && activePageRefs[0] && typeof activePageRefs[0].focus === 'function') {
        activePageRefs[0].focus();
      }
    },
    [pageIndex],
  );

  useEffect(() => {
    if (totalPages > 0) {
      focusActiveCard(pageIndex);
    }
  }, [pageIndex, totalPages, focusActiveCard]);

  const goToPage = useCallback(
    (index) => {
      if (!totalPages) {
        return;
      }

      const nextIndex = ((index % totalPages) + totalPages) % totalPages;
      setPageIndex(nextIndex);
      if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
        window.requestAnimationFrame(() => {
          focusActiveCard(nextIndex);
        });
      } else {
        focusActiveCard(nextIndex);
      }
    },
    [focusActiveCard, totalPages],
  );

  const handlePrevClick = () => {
    goToPage(pageIndex - 1);
  };

  const handleNextClick = () => {
    goToPage(pageIndex + 1);
  };

  const handleKeyDown = useCallback(
    (event) => {
      if (!totalPages) {
        return;
      }

      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          goToPage(pageIndex - 1);
          break;
        case 'ArrowRight':
          event.preventDefault();
          goToPage(pageIndex + 1);
          break;
        case 'Home':
          event.preventDefault();
          goToPage(0);
          break;
        case 'End':
          event.preventDefault();
          goToPage(totalPages - 1);
          break;
        default:
          break;
      }
    },
    [goToPage, pageIndex, totalPages],
  );

  useEffect(() => {
    const node = viewportRef.current;

    if (!node) {
      return undefined;
    }

    node.addEventListener('keydown', handleKeyDown);

    return () => {
      node.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const activeTeams = paginatedTeams[pageIndex] || [];
  const panelId = `${carouselId}-panel`;
  const tabIdPrefix = `${carouselId}-tab`;
  const activeTabId = totalPages ? `${tabIdPrefix}-${pageIndex}` : undefined;

  const statusMessage = totalPages
    ? `Показана страница ${pageIndex + 1} из ${totalPages}. Команды ${activeTeams
        .map((team) => team.name)
        .join(', ')}.`
    : 'Нет команд для отображения.';

  return (
    <div className="teams">
      <div className="teams__controller" role="group" aria-label="Карусель команд">
        <button
          type="button"
          className="teams__control teams__control--prev"
          onClick={handlePrevClick}
          aria-label="Показать предыдущие команды"
          disabled={totalPages <= 1}
        >
          <span aria-hidden="true">←</span>
        </button>
        <div
          id={panelId}
          className="teams__viewport"
          role="tabpanel"
          aria-roledescription="carousel"
          aria-live="polite"
          aria-atomic="true"
          aria-label="Команды участницы"
          aria-labelledby={activeTabId || undefined}
          tabIndex={0}
          ref={viewportRef}
        >
          <div
            className="teams__track"
            style={{ transform: `translateX(-${pageIndex * 100}%)` }}
          >
            {paginatedTeams.map((page, pagePosition) => (
              <div
                key={page.map((team) => team.id || team.name).join('-') || pagePosition}
                className="teams__page"
                style={{ '--teams-cards-per-view': cardsPerView || 1 }}
                aria-hidden={pagePosition !== pageIndex}
              >
                {page.map((team, teamIndex) => (
                  <article
                    key={team.id || team.name}
                    className="teams__card"
                    tabIndex={pagePosition === pageIndex ? 0 : -1}
                    ref={(element) => {
                      if (!cardRefs.current[pagePosition]) {
                        cardRefs.current[pagePosition] = [];
                      }
                      cardRefs.current[pagePosition][teamIndex] = element;
                    }}
                    aria-label={`Команда ${team.name}`}
                  >
                    <header className="teams__card-header">
                      <div className="teams__logo-wrapper">
                        {team.logo ? (
                          <img
                            className="teams__logo"
                            src={team.logo}
                            alt={`Логотип ${team.name}`}
                            loading="lazy"
                          />
                        ) : (
                          <div className="teams__logo teams__logo--placeholder" aria-hidden="true">
                            {team.name.slice(0, 2)}
                          </div>
                        )}
                      </div>
                      <div className="teams__card-meta">
                        <span className="teams__type" aria-label={`Тип команды: ${team.type}`}>
                          {team.type}
                        </span>
                        <h3 className="teams__name">{team.name}</h3>
                      </div>
                    </header>
                    {team.logoLarge ? (
                      <figure className="teams__card-hero" aria-hidden="true">
                        <img
                          className="teams__logo-large"
                          src={team.logoLarge}
                          alt=""
                          loading="lazy"
                        />
                      </figure>
                    ) : null}
                    <ul className="teams__players">
                      {team.players.map((player, playerIndex) => {
                        const teamKey = team.id || team.name || `team-${teamIndex}`;
                        const positionKey =
                          typeof player.position === 'number' && Number.isFinite(player.position)
                            ? player.position
                            : playerIndex + 1;
                        const playerKey = `${teamKey}-${positionKey}-${playerIndex}`;
                        const descriptionId = `${carouselId}-player-${playerKey}`;
                        const isExpanded = Boolean(expandedPlayers[playerKey]);
                        const togglePlayer = () => handlePlayerToggle(playerKey);
                        const hoursValue =
                          typeof player.hoursPlayed === 'number'
                            ? player.hoursPlayed.toLocaleString('ru-RU')
                            : player.hoursPlayed;

                        return (
                          <li key={`${teamKey}-${player.position || playerIndex}`} className="teams__player">
                            <div className={`teams__player-summary${isExpanded ? ' teams__player-summary--expanded' : ''}`}>
                              <button
                                type="button"
                                className="teams__player-toggle"
                                onClick={togglePlayer}
                                aria-expanded={isExpanded}
                                aria-controls={descriptionId}
                              >
                                <span className="teams__player-position">
                                  #{positionKey}
                                </span>
                                <span className="teams__player-name">{player.name}</span>
                                <span className="teams__player-hours">{hoursValue} ч</span>
                                <span className="teams__player-indicator" aria-hidden="true" />
                              </button>
                            </div>
                            <div
                              id={descriptionId}
                              className={`teams__player-panel${isExpanded ? ' teams__player-panel--expanded' : ''}`}
                              role="region"
                              aria-hidden={!isExpanded}
                            >
                              <p className="teams__player-description">{player.description}</p>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
        <button
          type="button"
          className="teams__control teams__control--next"
          onClick={handleNextClick}
          aria-label="Показать следующие команды"
          disabled={totalPages <= 1}
        >
          <span aria-hidden="true">→</span>
        </button>
      </div>
      <div className="teams__pagination" role="tablist" aria-label="Пагинация карусели команд">
        {paginatedTeams.map((page, index) => {
          const firstIndex = index * (cardsPerView || 1) + 1;
          const lastIndex = firstIndex + page.length - 1;
          const tabId = `${tabIdPrefix}-${index}`;

          return (
            <button
              type="button"
              key={`page-${page.map((team) => team.id || team.name).join('-') || index}`}
              className={`teams__dot${index === pageIndex ? ' teams__dot--active' : ''}`}
              onClick={() => goToPage(index)}
              aria-label={`Показать команды ${firstIndex}–${lastIndex}`}
              aria-selected={index === pageIndex}
              role="tab"
              tabIndex={index === pageIndex ? 0 : -1}
              id={tabId}
              aria-controls={panelId}
            />
          );
        })}
      </div>
      <p className="teams__sr-only" aria-live="polite">
        {statusMessage}
      </p>
    </div>
  );
};

Teams.propTypes = {
  data: PropTypes.shape({
    teams: PropTypes.arrayOf(teamShape),
  }),
};

Teams.defaultProps = {
  data: { teams: [] },
};

export default Teams;

