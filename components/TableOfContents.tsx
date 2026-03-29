interface TocItem {
  id: string;
  text: string;
  level: number;
}

export default function TableOfContents({ items }: { items: TocItem[] }) {
  if (items.length === 0) return null;

  return (
    <nav className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-8">
      <h2 className="font-bold text-sm text-gray-900 mb-3">この記事の内容</h2>
      <ol className="space-y-1.5 text-sm">
        {items.map((item, i) => (
          <li
            key={item.id}
            className={item.level > 2 ? "ml-4" : ""}
          >
            <a
              href={`#${item.id}`}
              className="text-gray-600 hover:text-spanish-red transition-colors"
            >
              {i + 1}. {item.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
