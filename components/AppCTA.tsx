import { APP_URL, APP_NAME } from "@/lib/constants";

export default function AppCTA() {
  return (
    <div className="bg-gradient-to-r from-spanish-red to-red-700 rounded-xl p-6 text-white mt-12">
      <h3 className="text-lg font-bold mb-2">
        {APP_NAME}アプリで効率的に学習しよう
      </h3>
      <p className="text-sm text-red-100 mb-4">
        このブログの全コンテンツをアプリで学習できます。
        クイズ・音声・進捗管理付き。
      </p>
      <a
        href={APP_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-white text-spanish-red font-bold text-sm px-6 py-2.5 rounded-lg hover:bg-red-50 transition-colors"
      >
        無料で始める →
      </a>
    </div>
  );
}
