interface ErrorDisplayProps {
  message?: string;
}

export default function ErrorDisplay({ message = "An unexpected error occurred" }: ErrorDisplayProps) {
  return (
    <div className="max-w-2xl mx-auto my-12 p-8 vintage-card rounded-lg text-center">
      <div className="text-6xl mb-4">⚠</div>
      <h2 className="text-2xl font-bold text-[var(--primary)] mb-4">
        Error
      </h2>
      <p className="text-[var(--foreground)] mb-6">
        {message}
      </p>
      <a href="/" className="vintage-button inline-block">
        Return Home
      </a>
    </div>
  );
}
