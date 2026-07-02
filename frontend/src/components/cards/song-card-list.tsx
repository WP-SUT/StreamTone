interface SongCardListProps {
    children: React.ReactNode;
}

export default function SongCardList({ children }: SongCardListProps) {
    return <div className="flex flex-col gap-8 p-6">
        {children}
    </div>
}