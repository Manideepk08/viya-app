import React from "react";

const stats = [
  { icon: "👥", label: "Active Users", value: "2,000+" },
  { icon: "💰", label: "Funding Raised", value: "$1.94B" },
  { icon: "📋", label: "Programs", value: "100+" },
  { icon: "🤝", label: "Value Partners", value: "100+" },
  { icon: "📅", label: "Events", value: "1,000+" },
  { icon: "🏢", label: "Corporate Engagements", value: "110+" },
  { icon: "🌏", label: "International Connects", value: "400+" },
  { icon: "🎓", label: "Mentors", value: "200+" },
];

const reviews = [
  {
    name: "Amit Sharma",
    text: "Viya Matrimony helped me find my perfect match! The process was smooth and the team was very supportive.",
  },
  {
    name: "Priya Singh",
    text: "I loved the transparency and the features. Highly recommended for anyone serious about marriage.",
  },
  {
    name: "Sunita Rao",
    text: "The mediator system is unique and really helped in the investigation process. Trustworthy platform!",
  },
];

export default function AppInfoAndReviews() {
  return (
    <div className="w-screen min-h-screen flex flex-col justify-center items-center py-16 px-2 md:px-8" style={{marginLeft: 'calc(50% - 50vw)', marginRight: 'calc(50% - 50vw)'}}>
      <div className="w-full flex flex-col items-center bg-black/60 rounded-2xl shadow-2xl py-12 px-2 md:px-8">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 text-white drop-shadow-lg">Our Impact & Growth</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-6xl mb-12">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center justify-center bg-[#23243a] bg-opacity-80 rounded-2xl p-8 shadow-xl min-h-[140px]">
              <span className="text-5xl mb-2">{stat.icon}</span>
              <span className="text-2xl font-extrabold">{stat.value}</span>
              <span className="text-base text-gray-300 text-center mt-1">{stat.label}</span>
            </div>
          ))}
        </div>
        <hr className="my-8 border-gray-600 w-3/4" />
        <h3 className="text-3xl md:text-4xl font-semibold text-center mb-8 text-white drop-shadow">What Our Users Say</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
          {reviews.map((review) => (
            <div key={review.name} className="bg-[#1a1b2e] bg-opacity-90 rounded-xl p-8 shadow-lg flex flex-col justify-between min-h-[180px]">
              <p className="italic mb-4 text-lg">"{review.text}"</p>
              <div className="text-right font-bold text-orange-300 text-lg">- {review.name}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 