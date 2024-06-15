import React from 'react';
import { gql, useQuery } from '@apollo/client';
import '../styles/CharacterCard.css';

const GET_LATEST_EPISODES = gql`
  query GetLatestEpisodes($ids: [ID!]!) {
    episodesByIds(ids: $ids) {
      id
      name
      air_date
    }
  }
`;

const CharacterCard = ({
  character,
  onExpand,
  expanded,
  onToggleFavorite,
  isFavorite,
}) => {
  const { id, name, image, species, gender, origin, status, episode } =
    character;

  const latestEpisodeIds = episode.slice(0, 3).map(ep => ep.id);

  const { data: episodesData } = useQuery(GET_LATEST_EPISODES, {
    variables: { ids: latestEpisodeIds },
    skip: !expanded || latestEpisodeIds.length === 0,
  });

  const episodes = episodesData
    ? episodesData.episodesByIds.sort(
        (a, b) => new Date(b.air_date) - new Date(a.air_date)
      )
    : [];

  return (
    <div className={`character-card ${expanded ? 'expanded' : ''}`}>
      <img className="avatar" src={image} alt={name} />
      <h2 className="name">{name}</h2>
      <p>Species: {species}</p>
      <p>Gender: {gender}</p>
      <p>Origin: {origin.name}</p>
      <p>Dimension: {origin.dimension}</p>
      <p>Status: {status}</p>
      <button onClick={() => onToggleFavorite(id)}>
        {isFavorite ? 'Unfavorite' : 'Favorite'}
      </button>
      <button onClick={() => onExpand(id)}>{expanded ? 'Less' : 'More'}</button>
      {expanded && (
        <div className="episodes-list">
          <h3>Latest Episodes</h3>
          <ul>
            {episodes.map(episode => (
              <li key={episode.id}>
                {episode.name} ({episode.air_date})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CharacterCard;
