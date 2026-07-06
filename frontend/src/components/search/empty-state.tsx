import { Search } from "lucide-react";

export default function EmptyState({
    type,
    query,
}: {
    type: "idle" | "no-results";
    query?: string;
}) {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <Search size={48} className="mb-4 text-neutral-700" />
            {type === "idle" ? (
                <>
                    <p className="text-lg font-semibold text-neutral-300">
                        Find Your Music
                    </p>
                    <p className="mt-1 text-sm text-neutral-500">
                        Search by track title or artist name
                    </p>
                </>
            ) : (
                <>
                    <p className="text-lg font-semibold text-neutral-300">
                        No results for "{query}"
                    </p>
                    <p className="mt-1 text-sm text-neutral-500">
                        Try different spelling or keywords
                    </p>
                </>
            )}
        </div>
    );
}