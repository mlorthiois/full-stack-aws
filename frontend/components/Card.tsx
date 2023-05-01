export default function Card({ ...props }) {
  return (
    <div
      {...props}
      className="border border-gray-100 rounded-md bg-white shadow-md hover:shadow-xl transition-shadow duration-200  bg-clip-padding"
    />
  );
}
