import TagBadge from './TagBadge';

import addIcon from '../img/addIcon.png';
import removeIcon from '../img/removeIcon.png';

const AddWordForm = ({ tags, customClass, formColor, word, setWord, handleSave, handleCancel }) => {
	const handleChange = (event) => {
		setWord({ ...word, [event.target.name]: event.target.value });
	}

	const handleTagChange = (event) => {
		let newWord = word;
		let tag = event.target.id;
		if (newWord.tag.indexOf(tag) != -1) {
			newWord.tag = newWord.tag.filter(t => t != tag);
		} else {
			newWord.tag.push(tag);
		}
		if (event.target.src == addIcon) {
			event.target.setAttribute("src", removeIcon);
		} else {
			event.target.setAttribute("src", addIcon);
		}
		setWord(newWord);
	}

	return (
		<div className={"word-item " + customClass} style={{ backgroundColor: formColor }}>
			<div class="form-group">
				<label>Word</label>
				<input class="form-control" name="word" value={word.word} onChange={handleChange} />
			</div>
			<div class="form-group">
				<label>Short Definition</label>
				<textarea class="form-control" name="definition" value={word.definition} onChange={handleChange} />
			</div>
			<div class="form-group">
				<label>Explanation</label>
				<textarea class="form-control" name="explanation" value={word.explanation} onChange={handleChange} />
			</div>
			<div class="form-group">
				<label>Example</label>
				<textarea class="form-control" name="example" value={word.example} onChange={handleChange} />
			</div>
			<div class="form-group">
				<label>Picture Url</label>
				<textarea class="form-control" name="picture" value={word.picture} onChange={handleChange} />
			</div>
			<div class="form-group">
				<label>Confidence Level</label>
				<select class="form-control" id="confidence-select" name="confidence" value={word.confidence} onChange={handleChange}>
					{[1, 2, 3, 4, 5].map((n, id) => <option key={id}>{n}</option>)}
				</select>
			</div>
			<div class="form-group">
				<label>Tags</label>
				<div class="add-tag-section">
					{
						word.tag?.filter(t => t != "starred").map((t, id) => <TagBadge key={id} tag={t} showAdd={false} handleTagChange={handleTagChange} />)
					}
				</div>
				<div class="remove-tag-section">
					{
						tags?.filter(t => word.tag.indexOf(t) == -1 && t != "starred").map((t, id) => <TagBadge key={id} tag={t} showAdd={true} handleTagChange={handleTagChange} />)
					}
				</div>
			</div>
			<button type="button" class="btn primary-btn word-button save-button" onClick={handleSave}>Save</button>
			<button type="button" class="btn primary-btn word-button cancel-button" onClick={handleCancel}>Cancel</button>
		</div>
	);
}

export default AddWordForm;