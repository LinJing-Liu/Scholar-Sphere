import { useState } from "react";

const FilterDropdown = ({ display, label, options, selection, onSelect, displaySelection = true }) => {

    const removeFilter = (optionToRemove) => {
        const newSelection = selection.filter(option => option !== optionToRemove);

        // Uncheck the "Select All" checkbox if it was checked
        if (document.getElementById("flexCheckAll" + label).checked) {
            document.getElementById("flexCheckAll" + label).checked = false;
        }

        onSelect(newSelection);
    }
    const selectOption = (event) => {
        let newSelection = [];
        let selected = event.target.value;

        if (event.target.checked) {
            // add option
            if (selected === "all") {
                newSelection = options;
                [...document.querySelectorAll("." + label + "-check-input")].map(input => input.checked = true);
            } else {
                newSelection = selection.concat(selected);

                if (newSelection.length === options.length) {
                    [...document.querySelectorAll("." + label + "-check-input")].map(input => input.checked = true);
                }
            }
        } else {
            // remove option
            if (selected === "all") {
                [...document.querySelectorAll("." + label + "-check-input")].map(input => input.checked = false);
            } else {
                newSelection = selection.filter(option => option !== selected);
                document.getElementById("flexCheckAll" + label).checked = false;
            }
        }

        newSelection.sort();
        onSelect(newSelection);
    }

    return (
        <div class="filterDropdown">
            <div class="dropdown">
                <button class="btn dropdown-toggle" type="button" id={label + "dropdownBtn"} data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {display}
                </button>
                <div class="dropdown-menu" aria-labelledby={label + "dropdownBtn"}>
                    <div class="form-check selectAll">
                        <input
                            class={"form-check-input" + " " + label + "-check-input"}
                            type="checkbox"
                            value="all"
                            id={"flexCheckAll" + label}
                            onChange={selectOption}
                            checked={options.length === selection.length} // <-- Change here
                        />
                        <label class={"form-check-label" + " " + label + "-check-label"} htmlFor={"flexCheckAll" + label}>
                            Select All
                        </label>
                    </div>
                    {options.map((option, id) =>
                        <div class="form-check" key={id}>
                            <input
                                class={"form-check-input" + " " + label + "-check-input"}
                                type="checkbox"
                                value={option}
                                id={"flexCheck" + option}
                                onChange={selectOption}
                                checked={selection.includes(option)} // <-- Change here
                            />
                            <label class={"form-check-label" + " " + label + "-check-label"} htmlFor={"flexCheck" + option}>
                                {option}
                            </label>
                        </div>
                    )}
                </div>
            </div>
            {displaySelection && (
                <div class="selected-filters">
                    {selection.map((option, id) => (
                        <div class="selected-filter" key={id}>
                            <span class={"badge " + label + "Badge"}>{option}</span>
                            <button class="remove-filter-btn" onClick={() => removeFilter(option)}>x</button>
                        </div>
                    ))}
                </div>
            )}        
        </div>
    );
}

export default FilterDropdown;