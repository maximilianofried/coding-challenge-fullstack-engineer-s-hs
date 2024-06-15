import React, { useState } from 'react';
import { gql, useLazyQuery } from '@apollo/client';
import '../styles/CharacterCard.css';

const GET_EPISODES_BY_IDS = gql`
  query GetEpisodesByIds($ids: [ID!]!) {
    getEpisodesByIds(ids: $ids) {
      id
      name
      air_date
    }
  }
`;

const CharacterCard = ({ character, onToggleFavorite, isFavorite }) => {
  const { id, name, image, species, gender, origin, status, episode } =
    character;
  const [expanded, setExpanded] = useState(false);
  const [fetchEpisodes, { loading, data }] = useLazyQuery(GET_EPISODES_BY_IDS, {
    variables: { ids: episode.slice(0, 3).map(ep => ep.id) },
  });

  const handleExpand = () => {
    if (!expanded) {
      fetchEpisodes();
    }
    setExpanded(!expanded);
  };

  const episodes = data ? data.getEpisodesByIds : [];

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
      <button onClick={handleExpand}>{expanded ? 'Less' : 'More'}</button>
      {expanded && (
        <div className="episodes-list">
          <h3>Latest Episodes</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul>
              {episodes.map(ep => (
                <li key={ep.id}>
                  {ep.name} ({ep.air_date})
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default CharacterCard;
