export default function ErrorNotice({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="rounded-md border border-danger/30 bg-danger-bg px-4 py-3 text-sm text-danger">
      {message}
    </div>
  );
}
