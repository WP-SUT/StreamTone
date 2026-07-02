interface PlaylistCardListProps {
    children: React.ReactNode;
}

export default function PlaylistCardList({ children }: PlaylistCardListProps) {
    return <div className="flex flex-wrap gap-3 sm:gap-4">
        {children}
    </div>
}