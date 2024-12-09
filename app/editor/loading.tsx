const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className={`w-10 h-10 animate-spin`}>
        <div className="h-full w-full border-4 border-t-teal-500 border-b-teal-700 rounded-full"></div>
      </div>
    </div>
  );
};

export default Loading;
