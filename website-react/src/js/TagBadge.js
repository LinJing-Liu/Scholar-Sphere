import addIcon from '../img/addIcon.png';
import removeIcon from '../img/removeIcon.png';

const TagBadge = ({ tag, showAdd, handleTagChange }) => {
  return (
    <span>
      {
        showAdd ? <img class="badgeImg" src={addIcon} id={tag} onClick={(e) => handleTagChange(e)} /> 
        : <img class="badgeImg" src={removeIcon} id={tag} onClick={(e) => handleTagChange(e)} />
      }
      <span class="badge tag-badge">{tag}</span>
    </span>
  );
}

export default TagBadge;