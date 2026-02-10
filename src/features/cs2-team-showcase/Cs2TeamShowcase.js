import {
  createElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { getFollowingIndex, getNextIndex, getPreviousIndex } from '../team-showcase/carouselUtils.js';
import { getCachedConfig, loadConfig } from './loadConfig.js';

export const loadTeamShowcaseStyles = (loader = () => import('../team-showcase/TeamShowcase.css')) => {
  if (typeof document === 'undefined') {
    return Promise.resolve(false);
  }

  return loader()
    .then(() => true)
    .catch((error) => {
      if (
        typeof globalThis !== 'undefined' &&
        globalThis.process?.env?.NODE_ENV !== 'production'
      ) {
        console.error('Failed to load CS2 TeamShowcase styles', error);
      }
      return false;
    });
};

const AUTO_PLAY_INTERVAL = 8000;
const numberFormatter = new Intl.NumberFormat('ru-RU');


const renderMember = (member) =>
  createElement(
    'li',
    { key: member.name, className: 'team-card__member' },
    createElement(
      'div',
      { className: 'team-card__member-header' },
      createElement('p', { className: 'team-card__member-name' }, member.name),
      createElement('p', { className: 'team-card__member-position' }, member.position),
    ),
    createElement(
      'p',
      { className: 'team-card__member-hours' },
      `${numberFormatter.format(member.hours)} ч в игре`,
    ),
    createElement('p', { className: 'team-card__member-description' }, member.description),
  );

const renderTeamSlide = (team, index, activeIndex) =>
  createElement(
    'li',
    {
      key: team.name,
      className: `team-showcase__slide${
        index === activeIndex ? ' team-showcase__slide--active' : ''
      }`,
      'aria-hidden': index !== activeIndex,
    },
    createElement(
      'article',
      { className: 'team-card' },
      createElement(
        'header',
        { className: 'team-card__header' },
        createElement('img', {
          className: 'team-card__logo',
          src: team.logo,
          alt: `Логотип команды ${team.name}`,
          loading: 'lazy',
          width: '128',
          height: '128',
        }),
        createElement(
          'div',
          { className: 'team-card__meta' },
          createElement('p', { className: 'team-card__type' }, team.teamType),
          createElement('h3', { className: 'team-card__name' }, team.name),
        ),
      ),
      createElement('ul', { className: 'team-card__members' }, team.members.map(renderMember)),
    ),
  );

const Cs2TeamShowcase = () => {
  const [teams, setTeams] = useState(() => getCachedConfig() ?? []);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const totalSlides = teams.length;
  const autoplayRef = useRef(null);

  useEffect(() => {
    let isMounted = true;

    loadConfig()
      .then((dataset) => {
        if (isMounted) {
          setTeams(dataset);
        }
      })
      .catch((error) => {
        if (
          typeof globalThis !== 'undefined' &&
          globalThis.process?.env?.NODE_ENV !== 'production'
        ) {
          console.error('Failed to load CS2 TeamShowcase config', error);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    loadTeamShowcaseStyles();
  }, []);

  const goToIndex = useCallback(
    (index) => {
      setActiveIndex((prev) => {
        if (index === prev) {
          return prev;
        }
        return getNextIndex(0, index, totalSlides);
      });
    },
    [totalSlides],
  );

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => getFollowingIndex(prev, totalSlides));
  }, [totalSlides]);

  const handlePrevious = useCallback(() => {
    setActiveIndex((prev) => getPreviousIndex(prev, totalSlides));
  }, [totalSlides]);

  useEffect(() => {
    if (typeof document === 'undefined' || totalSlides <= 1 || isPaused) {
      return undefined;
    }

    autoplayRef.current = setInterval(() => {
      handleNext();
    }, AUTO_PLAY_INTERVAL);

    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, [handleNext, isPaused, totalSlides]);

  useEffect(() => {
    return () => {
      if (autoplayRef.current) {
        clearInterval(autoplayRef.current);
      }
    };
  }, []);

  const activeTeam = teams[activeIndex];

  return createElement(
    'section',
    { className: 'team-showcase', 'aria-label': 'Команды CS2 сезона' },
    createElement(
      'div',
      { className: 'team-showcase__header' },
      createElement(
        'div',
        { className: 'team-showcase__titles' },
        createElement('p', { className: 'team-showcase__eyebrow' }, 'CS2 команды, которые стоит знать'),
        createElement('h2', { className: 'team-showcase__heading' }, 'Галерея ростеров'),
      ),
      createElement(
        'div',
        { className: 'team-showcase__controls', role: 'group', 'aria-label': 'Управление слайдами' },
        createElement(
          'button',
          {
            type: 'button',
            className: 'team-showcase__control',
            onClick: handlePrevious,
            'aria-label': 'Предыдущая команда',
          },
          createElement('span', { 'aria-hidden': 'true' }, '‹'),
        ),
        createElement(
          'button',
          {
            type: 'button',
            className: 'team-showcase__control',
            onClick: handleNext,
            'aria-label': 'Следующая команда',
          },
          createElement('span', { 'aria-hidden': 'true' }, '›'),
        ),
      ),
    ),
    createElement(
      'div',
      {
        className: 'team-showcase__viewport',
        onMouseEnter: () => setIsPaused(true),
        onMouseLeave: () => setIsPaused(false),
        onFocusCapture: () => setIsPaused(true),
        onBlur: () => setIsPaused(false),
      },
      createElement(
        'ul',
        {
          className: 'team-showcase__track',
          style: { transform: `translateX(-${activeIndex * 100}%)` },
          'aria-live': 'polite',
        },
        teams.map((team, index) => renderTeamSlide(team, index, activeIndex)),
      ),
    ),
    createElement(
      'div',
      { className: 'team-showcase__footer' },
      createElement(
        'p',
        { className: 'team-showcase__pagination', 'aria-live': 'polite' },
        createElement(
          'span',
          { className: 'team-showcase__pagination-current' },
          numberFormatter.format(totalSlides === 0 ? 0 : activeIndex + 1),
        ),
        createElement('span', { className: 'team-showcase__pagination-divider', 'aria-hidden': 'true' }, '/'),
        createElement('span', { className: 'team-showcase__pagination-total' }, numberFormatter.format(totalSlides)),
      ),
      createElement(
        'div',
        { className: 'team-showcase__indicators', role: 'tablist', 'aria-label': 'Выбор команды' },
        teams.map((team, index) =>
          createElement('button', {
            key: team.name,
            type: 'button',
            className: `team-showcase__indicator${
              index === activeIndex ? ' team-showcase__indicator--active' : ''
            }`,
            onClick: () => goToIndex(index),
            role: 'tab',
            'aria-selected': index === activeIndex,
            'aria-label': `Открыть карточку команды ${team.name}`,
          }),
        ),
      ),
      activeTeam
        ? createElement(
          'div',
          { className: 'team-showcase__summary', 'aria-live': 'polite' },
          createElement('h3', { className: 'team-showcase__summary-title' }, 'Ключевые факты'),
          createElement(
            'p',
            { className: 'team-showcase__summary-text' },
            `${activeTeam.name} · ${activeTeam.teamType}`,
          ),
        )
        : null,
    ),
  );
};

export default Cs2TeamShowcase;
