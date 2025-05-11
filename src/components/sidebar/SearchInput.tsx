"use client"
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function SearchInput() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (query.trim() !== "") {
        searchUsers();
      } else {
        setResults([]);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounce);
  }, [query]);

  async function searchUsers() {
    setLoading(true);
    try {
      const res = await fetch(`/api/users/search?query=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.success) {
        setResults(data.message);
      }
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
  <div className="relative max-w-md mx-auto p-4">
    <input
      type="text"
      className="w-full border rounded-md px-4 py-2 mb-1"
      placeholder="Search users..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
    {loading && <p className="text-sm text-gray-500">Searching...</p>}

    {results.length > 0 && (
      <ul className="absolute z-50 w-full bg-white border rounded-md shadow-lg max-h-64 overflow-y-auto mt-1">
        {results.map((user: any) => (
          <Link key={user._id} href={`/profile/${user.username}`}>
          <li
            
            className="flex items-center space-x-3 p-2 hover:bg-gray-100 cursor-pointer"
            >
            <img
              src={user.profilePicture || "/default-profile.png"}
              alt={user.username}
              className="w-8 h-8 rounded-full"
              />
            <span>{user.username}</span>
          </li>
              </Link>
        ))}
      </ul>
    )}
  </div>
);

}
