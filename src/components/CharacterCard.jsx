import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/client';
import { GET_EPISODES_BY_IDS } from '../api/queries';
import '../styles/CharacterCard.css';

/**
 * CharacterCard component to display individual character details.
 * @param {Object} character - The character object containing details.
 * @param {function} onToggleFavorite - Function to toggle the favorite status of the character.
 * @param {boolean} isFavorite - Boolean indicating if the character is a favorite.
 */
const CharacterCard = ({ character, onToggleFavorite, isFavorite }) => {
  const { id, name, image, species, gender, origin, status, episode } =
    character;

  // State to manage whether the character card is expanded
  const [expanded, setExpanded] = useState(false);

  // Lazy query to fetch episodes by IDs
  const [fetchEpisodes, { loading, data }] = useLazyQuery(GET_EPISODES_BY_IDS, {
    variables: { ids: episode.map(ep => ep.id) },
  });

  /**
   * Handle expanding or collapsing the character card.
   */
  const handleExpand = () => {
    if (!expanded) {
      fetchEpisodes();
    }
    setExpanded(!expanded);
  };

  // Extract episodes data from the query result
  const episodes = data ? data.getEpisodesByIds : [];

  return (
    <div className={`character-card ${expanded ? 'expanded' : ''}`}>
      <img className="avatar" src={image} alt={name} />
      <h2 className="name">{name}</h2>
      <ul>
        <li>Species: {species}</li>
        <li>Gender: {gender}</li>
        <li>Origin: {origin.name}</li>
        <li>Dimension: {origin.dimension ? origin.dimension : 'unknown'}</li>
        <li>Status: {status}</li>
      </ul>
      <div className="buttons-wrapper">
        {/* Favorite toggle button */}
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
        {/* Expand/collapse button */}
        <button onClick={handleExpand}>{expanded ? 'Less' : 'More'}</button>
      </div>
      {/* Expanded section to display latest episodes */}
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
