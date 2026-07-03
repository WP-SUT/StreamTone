interface SongCardListProps {
    children: React.ReactNode;
}

export default function SongCardList({ children }: SongCardListProps) {
    return <div className="flex flex-col gap-1 mt-3">
        {children}
    </div>
}