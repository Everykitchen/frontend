import { createContext, useContext, useState, useCallback } from "react";

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [searchKeyword, setSearchKeyword] = useState("");

    const updateSearchKeyword = useCallback((keyword) => {
        setSearchKeyword(keyword);
    }, []);

    return (
        <SearchContext.Provider value={{ 
            searchKeyword, 
            setSearchKeyword: updateSearchKeyword 
        }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
};
