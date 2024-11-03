import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

interface SearchBarProps {
    data: string[];
}

const SearchBar: React.FC<SearchBarProps> = ({ data }) => {
    const [query, setQuery] = useState('');
    const [filteredResult, setFilteredResult] = useState<string[]>([]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        setQuery(input);

        if (input) {
            const results = data.filter((item) => {
                item.toLowerCase().includes(input.toLowerCase());
            });
            setFilteredResult(results);
        } else {
            setFilteredResult([]);
        }
    };

    return (
        <div className="search-bar relative mt-2">
            <div className="relative w-full ml-[50px] mr-[40px]">
                <FontAwesomeIcon
                    icon={faSearch}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                    type="text"
                    placeholder="Search..."
                    value={query}
                    onChange={handleSearch}
                    className="search-input p-2 pl-10 border border-gray-300 rounded-full w-[500px]"
                />
            </div>
            <div className="search-results mt-2">
                {filteredResult.length > 0 ? (
                    <ul>
                        {filteredResult.map((item, index) => (
                            <li key={index} className="search-item">
                                {item}
                            </li>
                        ))}
                    </ul>
                ) : (
                    query && <p>No results  found</p>
                )}
            </div>
        </div>
    )
}

export default SearchBar;