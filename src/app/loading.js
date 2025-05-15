
export default function Loading() {
  return (
    <div className="flex justify-center items-center my-40 bg-white">
      <div className="w-16 h-16 border-4 border-blue-100 rounded-full animate-spin">
        <div className="w-full h-full rounded-full border-4 border-transparent border-t-blue-600 animate-spin-slow"></div>
      </div>
    </div>
  );
}