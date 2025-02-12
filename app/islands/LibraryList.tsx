import { useEffect, useState } from "preact/hooks";

type LibraryData = Record<string, string>;

export default function LibraryList() {
  const [data, setData] = useState<LibraryData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/library")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setData(data);
        }
      })
      .catch(() => setError("データの取得に失敗しました"));
  }, []);

  return (
    <div class="p-4 max-w-xl mx-auto">
      <h1 class="text-2xl font-bold mb-4">信州大学 図書館開館時間</h1>
      {error && <p class="text-red-500">{error}</p>}
      {!data && !error && <p>読み込み中...</p>}
      {data && (
        <ul class="bg-white shadow-md rounded p-4">
          {Object.entries(data).map(([library, hours]) => (
            <li class="border-b py-2" key={library}>
              <strong>{library}</strong>: {hours}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
