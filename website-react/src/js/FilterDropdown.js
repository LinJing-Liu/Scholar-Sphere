import { useState } from "react";

const FilterDropdown = ({ display, label, options, selection, onSelect, displaySelection = true }) => {
    const selectOption = (event) => {
        let newSelection = [];
        let selected = event.target.value;
        if(event.target.checked) {
            // add option
            if(selected == "all") {
                newSelection = options;
                [...document.querySelectorAll("." + label + "-check-input")].map(input => input.checked = true);
            } else {
                newSelection = selection.concat(selected);

                if(newSelection.length == options.length) {
                    [...document.querySelectorAll("." + label + "-check-input")].map(input => input.checked = true);
                }
            }
        } else {
            // remove option
            if(selected == "all") {
                [...document.querySelectorAll("." + label + "-check-input")].map(input => input.checked = false);
            } else {
                newSelection = selection.filter(option => option != selected);
                document.getElementById("flexCheckAll" + label).checked = false;
            }
        }
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
                        <input class={"form-check-input" + " " + label + "-check-input"} type="checkbox" value="all" id={"flexCheckAll" + label} onChange={selectOption}
                            defaultChecked={options.length == selection.length}/>
                        <label class={"form-check-label" + " " + label + "-check-label"} for={"flexCheckAll" + label}>Select All</label>
                    </div>
                    {options.map((option, id) => 
                    <div class="form-check" key={id}>
                        <input class={"form-check-input" + " " + label + "-check-input"} type="checkbox" value={option} id={"flexCheck" + option} onChange={selectOption} 
                            defaultChecked={selection.filter(t => t == option).length > 0} />
                        <label class={"form-check-label" + " " + label + "-check-label"} for={"flexCheck" + option}>{option}</label>
                    </div>
                    )}
                </div>
            </div>
            {displaySelection && selection.map((option, id) => <span class={"badge " + label + "Badge"} key={id}>{option}</span>)}
        </div>
    );
}

export default FilterDropdown;