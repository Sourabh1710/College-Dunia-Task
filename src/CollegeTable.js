import React, { useState, useEffect } from 'react';
import collegeData from './collegeData';
import './CollegeTable.css';

const CollegeTable = () => {
    const [data, setData] = useState(() => collegeData.map((item, index) => ({ ...item, index })));
    const [displayData, setDisplayData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
    const [currentIndex, setCurrentIndex] = useState(0);
    const rowsPerPage = 10;

    useEffect(() => {
        loadMoreRows();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [data, currentIndex]);

    const handleScroll = () => {
        if (window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
            loadMoreRows();
        }
    };

    const loadMoreRows = () => {
        const newRows = data.slice(currentIndex, currentIndex + rowsPerPage);
        setDisplayData(prevDisplayData => [...prevDisplayData, ...newRows]);
        setCurrentIndex(prevIndex => prevIndex + rowsPerPage);
    };

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
        const filteredData = collegeData.filter(college => college.name.toLowerCase().includes(query));
        setData(filteredData.map((item, index) => ({ ...item, index })));
        setDisplayData([]);
        setCurrentIndex(0);
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });

        const sortedData = [...data].sort((a, b) => {
            if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
            return 0;
        });
        setData(sortedData);
        setDisplayData([]);
        setCurrentIndex(0);
    };

    return (
        <div className="table-container">
            <input
                type="text"
                placeholder="Search by college name..."
                value={searchQuery}
                onChange={handleSearch}
                className="search-input"
            />
            <table className="college-table">
                <thead>
                    <tr>
                        <th className="index-header">Index</th>
                        <th className="college-name-header sortable" onClick={() => handleSort('name')}>College Name</th>
                        <th className="rating-header sortable" onClick={() => handleSort('collegeduniaRating')}>Collegedunia Rating</th>
                        <th className="fees-header sortable" onClick={() => handleSort('fees')}>Fees</th>
                        <th className="review-rating-header sortable" onClick={() => handleSort('userReviewRating')}>User Review Rating</th>
                        <th className="featured-header">Featured</th>
                    </tr>
                </thead>
                <tbody>
                    {displayData.map((college) => (
                        <tr key={college.index} className={`college-row ${college.featured ? 'featured' : ''}`}>
                            <td className="index-cell">{college.index + 1}</td>
                            <td className="college-name-cell">
                                {college.featured && <span className="featured-label">Featured</span>}
                                {college.name}
                            </td>
                            <td className="rating-cell">{college.collegeduniaRating}</td>
                            <td className="fees-cell">{college.fees}</td>
                            <td className="review-rating-cell">{college.userReviewRating}</td>
                            <td className="featured-cell">
                                {college.featured ? 'Yes' : 'No'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default CollegeTable;
