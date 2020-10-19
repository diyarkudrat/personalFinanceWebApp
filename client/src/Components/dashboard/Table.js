import React, { useState, useEffect } from 'react';
require('es6-promise').polyfill();
requestAnimationFrame('isomorphic-fetch');

export default function App() {
    const [data, setData] = useState([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        fetchData()
          .then(res => res.json())
          .then(json => setData(json));
    }, [])

    return (
        <div>
            <div>Filter goes here</div>
            <div>Datatable goes here</div>
        </div>
    )
}