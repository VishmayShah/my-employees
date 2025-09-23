export default function Toastr({ message, type }: { message: string, type: string }) {
  return (
    <div className={`fixed top-20 right-4 px-4 py-2 rounded shadow-lg z-50 transition-opacity duration-300 ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
      {message}
    </div>
  );
}