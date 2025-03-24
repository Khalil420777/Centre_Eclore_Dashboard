"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar/page";
import { sendNotification } from "../../utils/sendNotifications";
import { useRouter } from "next/navigation";
interface News {
  idNews: string;
  title: string;
  Description: string;
  Event_date: string; 
  Event_time: string;
  Image: string;
  button_count: number;
  button_1_text: string | null;
  button_2_text: string | null;
  button_3_text: string | null;
}

const Page = () => {
      const router = useRouter();
  const [news, setNews] = useState<News[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    Description: "",
    Event_date: "",
    Event_time: "",
    image: null as File | null,
    button_count: 0,
    button_1_text: "",
    button_2_text: "",
    button_3_text: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("http://localhost:3001/NEWS/news");
        if (!response.ok) throw new Error("Failed to fetch news");
        const data = await response.json();

        // Sort news by Event_date in descending order
        data.sort((a: News, b: News) => new Date(b.Event_date).getTime() - new Date(a.Event_date).getTime());

        setNews(data);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    };

    fetchNews();
  }, []);

  // Format the Event_date to a readable format
  const formatDate = (date: string) => {
    const formattedDate = new Date(date);
    return formattedDate.toLocaleDateString("fr", {
      weekday: "long", // "Monday"
      year: "numeric", // "2025"
      month: "long", // "February"
      day: "numeric", // "14"
    });
  };

  // Handle Input Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const value = e.target.name === "button_count" ? parseInt(e.target.value) : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  // Handle File Change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("Description", formData.Description);
    formDataToSend.append("Event_date", formData.Event_date);
    formDataToSend.append("Event_time", formData.Event_time);
    formDataToSend.append("button_count", formData.button_count.toString());
    
    if (formData.button_count >= 1) formDataToSend.append("button_1_text", formData.button_1_text);
    if (formData.button_count >= 2) formDataToSend.append("button_2_text", formData.button_2_text);
    if (formData.button_count >= 3) formDataToSend.append("button_3_text", formData.button_3_text);
    
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    try {
      const response = await fetch("http://localhost:3001/NEWS/add", {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.log("Server error response:", errorData);
        throw new Error(`Failed to create event: ${errorData}`);
      }

      setMessage("Event created successfully!");
      setFormData({ 
        title: "", 
        Description: "", 
        Event_date: "", 
        Event_time: "", 
        image: null,
        button_count: 0,
        button_1_text: "",
        button_2_text: "",
        button_3_text: ""
      });
      await sendNotification(
        "New Event!", 
        `A new event has been added. Check it out!`,
        { 
          screen: "News"    
        }
      );
      // Refresh news list
      const updatedNews = await fetch("http://localhost:3001/NEWS/news").then((res) => res.json());
      updatedNews.sort((a: News, b: News) => new Date(b.Event_date).getTime() - new Date(a.Event_date).getTime());
      setNews(updatedNews);
    } catch (error) {
      console.error("Error creating event:", error);
      setMessage("Failed to create event. Please try again.");
    }
  };
 const handlenavigate=(id: string)=>{
    router.push(`/evenement_reserve?id=${id}`);
  }
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this news?")) return;
  
    try {
      const response = await fetch(`http://localhost:3001/NEWS/deletenews/${id}`, {
        method: "DELETE",
      });
  
      if (!response.ok) throw new Error("Failed to delete news");
  
      setNews((prevNews) => prevNews.filter((item) => item.idNews !== id));
    } catch (error) {
      console.error("Error deleting news:", error);
    }
  };
  

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-row p-4 w-full">
        {/* News feed on the left */}
        <div className="w-7/12 pr-6">
          <h1 className="text-xl font-bold mb-4">News</h1>
          <div className="flex flex-col gap-4">
            {news.map((item) => (
         <div key={item.idNews} className="border p-4 rounded-lg shadow-md flex flex-col relative">
         {/* Delete button - red X in top right corner */}
         <button 
           onClick={(e) => {
             e.stopPropagation(); // Prevent triggering the handlenavigate
             handleDelete(item.idNews);
           }}
           className="absolute top-2 right-2 text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition-colors"
           title="Delete event"
         >
           <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
             <line x1="18" y1="6" x2="6" y2="18"></line>
             <line x1="6" y1="6" x2="18" y2="18"></line>
           </svg>
         </button>
         
         {/* Rest of your news item content */}
         <div onClick={() => handlenavigate(item.idNews)}>
           <h2 className="text-lg font-semibold">{item.title}</h2>
           <p className="text-gray-600">{item.Description}</p>
           <p className="text-sm text-gray-500">
             Date: {formatDate(item.Event_date)} | Time: {item.Event_time}
           </p>
           <img src={`http://localhost:3001/${item.Image}`} alt={item.title} className="w-48 h-auto mt-2 rounded object-cover" />
       
           <div className="mt-3 flex gap-2">
             {item.button_1_text && <span className="px-4 py-2 bg-gray-300 rounded">{item.button_1_text}</span>}
             {item.button_2_text && <span className="px-4 py-2 bg-gray-300 rounded">{item.button_2_text}</span>}
             {item.button_3_text && <span className="px-4 py-2 bg-gray-300 rounded">{item.button_3_text}</span>}
           </div>
         </div>
       </div>
            ))}
          </div>
        </div>

        {/* Admin Event Creation Form on the right */}
        <div className="w-5/12">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Ajouter un événement</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Title</label>
                <input
                  name="title"
                  type="text"
                  placeholder="Enter event title"
                  onChange={handleChange}
                  value={formData.title}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="Description"
                  placeholder="Enter event description"
                  onChange={handleChange}
                  value={formData.Description}
                  className="border p-2 rounded w-full"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Date</label>
                  <input
                    name="Event_date"
                    type="date"
                    onChange={handleChange}
                    value={formData.Event_date}
                    className="border p-2 rounded w-full"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Time</label>
                  <input
                    name="Event_time"
                    type="time"
                    onChange={handleChange}
                    value={formData.Event_time}
                    className="border p-2 rounded w-full"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Event Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 file:cursor-pointer transition-all duration-200"
                  required
                />
              </div>
              
              {/* Button Configuration Section */}
              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-md font-medium mb-3 text-gray-800">Button Configuration</h4>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Number of Buttons</label>
                  <select
                    name="button_count"
                    onChange={handleChange}
                    value={formData.button_count}
                    className="border p-2 rounded w-full"
                  >
                    <option value="0">No Buttons</option>
                    <option value="1">1 Button</option>
                    <option value="2">2 Buttons</option>
                    <option value="3">3 Buttons</option>
                  </select>
                </div>
                
                {parseInt(formData.button_count.toString()) >= 1 && (
                  <div className="flex flex-col gap-1.5 mt-3">
                    <label className="text-sm font-medium text-gray-700">Button 1 Text</label>
                    <input
                      name="button_1_text"
                      type="text"
                      placeholder="Enter Button 1 text"
                      onChange={handleChange}
                      value={formData.button_1_text}
                      className="border p-2 rounded w-full"
                    />
                  </div>
                )}
                {parseInt(formData.button_count.toString()) >= 2 && (
                  <div className="flex flex-col gap-1.5 mt-3">
                    <label className="text-sm font-medium text-gray-700">Button 2 Text</label>
                    <input
                      name="button_2_text"
                      type="text"
                      placeholder="Enter Button 2 text"
                      onChange={handleChange}
                      value={formData.button_2_text}
                      className="border p-2 rounded w-full"
                    />
                  </div>
                )}
                {parseInt(formData.button_count.toString()) >= 3 && (
                  <div className="flex flex-col gap-1.5 mt-3">
                    <label className="text-sm font-medium text-gray-700">Button 3 Text</label>
                    <input
                      name="button_3_text"
                      type="text"
                      placeholder="Enter Button 3 text"
                      onChange={handleChange}
                      value={formData.button_3_text}
                      className="border p-2 rounded w-full"
                    />
                  </div>
                )}
              </div>

              {/* Message */}
              {message && <p className="mt-4 text-center text-red-500">{message}</p>}
              
              <button
                type="submit"
                className="w-full mt-4 py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Submit Event
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
