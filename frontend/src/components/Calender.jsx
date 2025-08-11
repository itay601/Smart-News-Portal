import React, { useState, useEffect } from 'react';

// Simple date formatting utilities
const formatDate = (date) => {
  return date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const isSameDay = (date1, date2) => {
  return date1.toDateString() === date2.toDateString();
};

// Modal component for adding events
const AddEventModal = ({ isOpen, onClose, onSubmit, selectedDate }) => {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    try {
      await onSubmit({ title: title.trim(), url: url.trim() });
      setTitle('');
      setUrl('');
      onClose();
    } catch (error) {
      console.error('Error adding event:', error);
      alert('Failed to add event. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">Add Economic Event</h3>
        <div onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Federal Reserve Meeting"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL (Optional)
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com"
            />
          </div>
          {selectedDate && (
            <div className="mb-4 text-sm text-gray-600">
              <strong>Date:</strong> {formatDate(selectedDate)}
            </div>
          )}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Adding...' : 'Add Event'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Simple calendar component
const SimpleCalendar = ({ events, onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const getMonthDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    while (days.length < 42) { // 6 weeks * 7 days
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const getEventsForDate = (date) => {
    return events.filter(event => isSameDay(new Date(event.date), date));
  };

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const monthDays = getMonthDays();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={() => navigateMonth(-1)}
          className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          ‹
        </button>
        <h2 className="text-xl font-semibold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button
          onClick={() => navigateMonth(1)}
          className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          ›
        </button>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-1">
        {monthDays.map((day, index) => {
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = isSameDay(day, today);
          const dayEvents = getEventsForDate(day);

          return (
            <div
              key={index}
              onClick={() => onDateClick(day)}
              className={`
                min-h-[80px] p-1 border cursor-pointer transition-colors
                ${isCurrentMonth ? 'bg-white hover:bg-blue-50' : 'bg-gray-100 text-gray-400'}
                ${isToday ? 'bg-blue-100 border-blue-300' : 'border-gray-200'}
                hover:border-blue-300
              `}
            >
              <div className={`text-sm ${isToday ? 'font-bold text-blue-600' : ''}`}>
                {day.getDate()}
              </div>
              <div className="mt-1">
                {dayEvents.map((event, eventIndex) => (
                  <div
                    key={eventIndex}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (event.url) window.open(event.url, '_blank');
                    }}
                    className={`
                      text-xs p-1 mb-1 rounded truncate
                      ${event.url ? 'bg-green-100 text-green-800 cursor-pointer hover:bg-green-200' : 'bg-blue-100 text-blue-800'}
                    `}
                    title={event.url ? `${event.title} - Click to visit link` : event.title}
                  >
                    {event.title}
                    {event.url && ' 🔗'}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Event list component
const EventList = ({ events }) => {
  const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
  const today = new Date();
  const upcomingEvents = sortedEvents.filter(event => new Date(event.date) >= today);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold mb-3">Upcoming Events</h3>
      {upcomingEvents.length === 0 ? (
        <p className="text-gray-500">No upcoming events</p>
      ) : (
        <div className="space-y-2">
          {upcomingEvents.slice(0, 10).map((event, index) => (
            <div key={index} className="flex justify-between items-center p-2 border-l-4 border-blue-400 bg-gray-50">
              <div>
                <div className="font-medium">{event.title}</div>
                <div className="text-sm text-gray-500">
                  {formatDate(new Date(event.date))}
                </div>
              </div>
              {event.url && (
                <button
                  onClick={() => window.open(event.url, '_blank')}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                >
                  Visit
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

function MyCalendar() {
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  // Get JWT token - for demo purposes, using a hardcoded token
  const getAuthToken = () => {
    // In production, get this from your auth system
    return localStorage.getItem('authToken') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicGFzc3dvcmQiOiIkMmIkMTAkcVEwajVpdnZQMk43WVpCZ2FTRnFUT3VlMUU1ODQ4UFBCZE9ZREptWDRQcnBmU0I3NnE5cTYiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUyLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc1NDkyOTkyOSwiZXhwIjoxNzU0OTMzNTI5fQ.8hakbotvsre8fRyE4B8OigeXq2W-mjOD8N8NcNjvxt4';
  };

  // Fetch events using GraphQL
  const fetchEvents = async () => {
    const token = getAuthToken();
    if (!token) {
      console.error('No auth token found');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: 'query GetCalendarEvents { calenderEvents { date title url } }'
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.errors) {
        throw new Error(data.errors[0].message);
      }

      // Transform the events
      const transformedEvents = data.data.calenderEvents || [];
      setEvents(transformedEvents);
    } catch (error) {
      console.error('Error fetching events:', error);
      // For demo purposes, use sample data if API fails
      setEvents([
        {
          title: 'Sample Economic Event',
          date: new Date().toISOString().split('T')[0],
          url: 'https://example.com'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Add new event using REST API
  const addEvent = async (eventData) => {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No auth token found');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/v1/api/calender/addEvent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error(`Failed to add event: ${response.statusText}`);
      }

      // Refresh events after adding
      await fetchEvents();
    } catch (error) {
      console.error('API Error:', error);
      // For demo purposes, add event locally if API fails
      const newEvent = {
        title: eventData.title,
        date: selectedDate.toISOString().split('T')[0],
        url: eventData.url
      };
      setEvents(prev => [...prev, newEvent]);
    }
  };

  // Handle date selection
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  // Load events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Community Economic Calendar</h1>
          <p className="text-gray-600 mb-4">
            Click on any date to add an economic event for the community. Events with links can be clicked to visit external resources.
          </p>
          <button
            onClick={fetchEvents}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Refresh Events'}
          </button>
        </div>

        {/* Calendar and Events Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <SimpleCalendar events={events} onDateClick={handleDateClick} />
          </div>
          
          {/* Event List */}
          <div className="lg:col-span-1">
            <EventList events={events} />
          </div>
        </div>

        {/* Add Event Modal */}
        <AddEventModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={addEvent}
          selectedDate={selectedDate}
        />

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-40">
            <div className="bg-white p-6 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <span>Loading events...</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyCalendar;