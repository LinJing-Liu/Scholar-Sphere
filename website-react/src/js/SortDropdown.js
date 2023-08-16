import { useState } from "react";

const SortDropdown = ({ label, words, setWords }) => {
    const [options, setOptions] = useState(["Order Added", "Alphabetical", "Reverse Alphabetical", "Confidence Level(1-5)", "Confidence Level(5-1)"]);
    const [displayText, setDisplayText] = useState(label + ": Order Added");
    const [selected, setSelected] = useState("Order Added");

    const selectOption = (event) => {
        if (event.target.checked) {
            let value = event.target.value;
            var wordsCopy = structuredClone(words);

            if(value == "Order Added") {
                wordsCopy = JSON.parse(localStorage.getItem("words"));
            } else if (value == "Alphabetical") {
                wordsCopy.sort((a, b) => a.word.localeCompare(b.word));
            } else if (value == "Reverse Alphabetical") {
                wordsCopy.sort((a, b) => b.word.localeCompare(a.word));
            } else if (value == "Confidence Level(1-5)") {
                wordsCopy.sort((a, b) => a.confidence - b.confidence);
            } else if (value == "Confidence Level(5-1)") {
                wordsCopy.sort((a, b) => b.confidence - a.confidence);
            }

            setWords(wordsCopy);
            setDisplayText(label + ": " + value);
            setSelected(value);
        }
    }

    return (
        <div class="sortDropdown">
            <div class="dropdown">
                <button class="btn dropdown-toggle" type="button" id={label + "dropdownBtn"} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {displayText}
                </button>
                <div class="dropdown-menu" aria-labelledby={label + "dropdownBtn"}>
                    {options.map((option, id) =>
                        <div class="form-check" key={id}>
                            <input
                                class={"form-check-input" + " " + label + "-check-input"}
                                type="radio"
                                value={option}
                                id={"flexRadio" + option}
                                onChange={selectOption}
                                checked={option == selected}
                            />
                            <label class={"form-check-label" + " " + label + "-check-label"} htmlFor={"flexCheck" + option}>
                                {option}
                            </label>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SortDropdown;