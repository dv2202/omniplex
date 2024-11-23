'use client'

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateNews } from "@/store/chatSlice";
import { NewsType } from "@/utils/types";

const News = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState("");
  const [news, setNews] = useState<NewsType[]>([]);
  const dispatch = useDispatch();

  const handleNews = async (chatIndex: number) => {
    setIsLoading(true);
    setIsCompleted(false);

    try {
      const response = await fetch(`/api/news`);
      if (!response.ok) {
        throw new Error("Failed to fetch news data");
      }

      const newsData = await response.json();
      const newsResults = newsData?.data ?? [];
      setNews(newsResults);
      setIsCompleted(true);

      dispatch(
        updateNews({
          threadId: "1",
          chatIndex,
          newsResults,
        })
      );
    } catch (error) {
      console.error("Error fetching news:", error);
      setError("Error fetching or processing news data");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleNews(0);
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {isLoading
        ? Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
              <div className="h-48 bg-gray-300" />
              <div className="p-4">
                <div className="h-6 bg-gray-300 w-3/4 mb-2" />
                <div className="h-4 bg-gray-300 w-full mb-2" />
                <div className="h-4 bg-gray-300 w-full" />
              </div>
              <div className="p-4 flex justify-between items-center border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-gray-300 rounded-full" />
                  <div className="h-4 bg-gray-300 w-24" />
                </div>
                <div className="h-4 bg-gray-300 w-24" />
              </div>
            </div>
          ))
        : news.map((item, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="h-48 overflow-hidden">
                <img
                  src={item.photo_url || item.thumbnail_url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                  <a href={item.link} target="_blank" rel="noopener noreferrer" className="hover:underline text-gray-800">
                    {item.title}
                  </a>
                </h3>
                <p className="text-sm text-gray-600 line-clamp-3">{item.snippet}</p>
              </div>
              <div className="p-4 flex justify-between items-center border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <img src={item.source_favicon_url} alt={item.source_name} className="h-6 w-6 rounded-full" />
                  <span className="text-sm font-medium text-gray-700">{item.source_name}</span>
                </div>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {new Date(item.published_datetime_utc).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
    </div>
  );
};

export default News;

