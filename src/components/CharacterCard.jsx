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
    variables: { ids: episode.map(ep => ep.id) },
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
      <h2 className="name">
        {name} {id}
      </h2>
      <ul className="character-info">
        <li>Species: {species}</li>
        <li>Gender: {gender}</li>
        <li>Origin: {origin.name}</li>
        <li>Dimension: {origin.dimension ? origin.dimension : 'unknown'}</li>
        <li>Status: {status}</li>
      </ul>
      <div className="buttons-wrapper">
        <button
          className={`favorite-button ${isFavorite ? 'favorite' : ''}`}
          onClick={() => onToggleFavorite(id)}
        >
          <img
            src={isFavorite ? '/star-filled.svg' : '/star-empty.svg'}
            alt={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            className="star-icon"
          />
        </button>
        <button onClick={handleExpand}>{expanded ? 'Less' : 'More'}</button>
      </div>
      {expanded && (
        <div className="episodes-list">
          <h3>Latest Episodes</h3>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul className="character-info">
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
