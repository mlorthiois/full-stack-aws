export function Table({ ...props }) {
  return (
    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div className="shadow overflow-hidden border border-gray-100 sm:rounded-lg">
          <table {...props} className="min-w-full divide-y divide-gray-200" />
        </div>
      </div>
    </div>
  );
}
interface TitleType {
  title: string;
  size: string;
}

export function THeader({ titles }: { titles: TitleType[] }) {
  return (
    <thead className="bg-gray-50">
      <tr>
        {titles.map((title) => (
          <th
            key={title.title}
            scope="col"
            className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-${title.size}`}
          >
            {title.title}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export function TBody({ ...props }) {
  return <tbody {...props} className="bg-white divide-y divide-gray-200" />;
}
