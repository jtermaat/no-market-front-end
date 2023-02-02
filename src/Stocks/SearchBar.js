import { useState } from "react";


const SearchBar = (props) => {
    const [searchInput, setSearchInput] = useState("");

    const handleChange = (e) => {
        e.preventDefault();
        const input = !!e.target.value ? e.target.value.toUpperCase() : '';
        setSearchInput(input);
        props.onSearchInputChange(input);
    }

    return (
        <input
            type="text"
            placeholder="Search"
            onChange={handleChange}
            value={searchInput} />
    );
};

export default SearchBar;