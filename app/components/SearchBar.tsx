export function SearchBar() {
  return (
    <form className="w-full max-w-md mx-auto flex items-center bg-white rounded-full shadow-md p-2">
      <input
        type="text"
        placeholder="Search plant tips..."
        className="flex-1 px-4 py-2 bg-transparent outline-none text-[#2D5A27]"
      />
      <button
        type="submit"
        className="bg-[#8E9775] text-white rounded-full px-4 py-2 font-semibold hover:bg-[#2D5A27] transition"
      >
        Search
      </button>
    </form>
  );
}
